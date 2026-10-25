import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const TIMEOUT = 45_000;
const COMMANDS = {
  claude: ["claude", "plugin", "marketplace", "update", "ixo-plugins"],
  codex: ["codex", "plugin", "marketplace", "upgrade", "ixo-plugins"],
};

function claudeInstalls(output) {
  const plugins = JSON.parse(output);
  if (!Array.isArray(plugins)) throw new Error("Unsupported Claude plugin list format");
  const installed = [];
  for (const plugin of plugins) {
    if (typeof plugin?.id !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*@ixo-plugins$/.test(plugin.id)) continue;
    if (plugin.scope === "managed") continue;
    if (!["user", "project", "local"].includes(plugin.scope)) throw new Error("Unsupported Claude plugin scope");
    if (plugin.scope !== "user" && (typeof plugin.projectPath !== "string" || !isAbsolute(plugin.projectPath))) {
      throw new Error("Missing Claude project install path");
    }
    installed.push({ id: plugin.id, scope: plugin.scope, cwd: plugin.scope === "user" ? process.cwd() : plugin.projectPath });
  }
  return installed;
}

function refreshClient(client, env) {
  const deadline = Date.now() + TIMEOUT;
  const run = (command, cwd = process.cwd()) => {
    const remaining = deadline - Date.now();
    if (remaining <= 0) return { status: null };
    // All tokens are fixed or validated plugin IDs/scopes; npm uses .cmd launchers on Windows.
    const [executable, ...args] = process.platform === "win32"
      ? ["cmd.exe", "/d", "/s", "/c", command.join(" ")]
      : command;
    return spawnSync(executable, args, {
      cwd,
      env: { ...env, GIT_TERMINAL_PROMPT: "0" },
      stdio: ["ignore", "pipe", "pipe"],
      timeout: remaining,
      maxBuffer: 256 * 1024,
      windowsHide: true,
    });
  };
  const ok = (result) => !result.error && result.status === 0;
  let installed = [];
  if (client === "claude") {
    const listing = run(["claude", "plugin", "list", "--json"]);
    if (!ok(listing)) return listing;
    installed = claudeInstalls(listing.stdout.toString());
  }
  const result = run(COMMANDS[client]);
  if (!ok(result)) return result;
  const failed = [];
  for (const plugin of installed) {
    const update = run(["claude", "plugin", "update", plugin.id, "--scope", plugin.scope], plugin.cwd);
    if (!ok(update)) failed.push(update);
  }
  return failed[0] ?? result;
}

function readState(path) {
  let state;
  try {
    state = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return { enabled: true };
    throw error;
  }
  if (!state || typeof state !== "object" || Array.isArray(state) || typeof state.enabled !== "boolean") {
    throw new Error("Invalid updater state; inspect state.json before retrying");
  }
  for (const key of ["lastAttemptAt", "lastSuccessAt"]) {
    if (state[key] !== undefined && (!Number.isFinite(state[key]) || state[key] < 0)) {
      throw new Error("Invalid updater timestamp");
    }
  }
  return state;
}

function saveState(path, state) {
  const temp = `${path}.${process.pid}.tmp`;
  try {
    writeFileSync(temp, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
    renameSync(temp, path);
  } finally {
    rmSync(temp, { force: true });
  }
}

function acquireLock(path, now) {
  try {
    // Longer than both the hook and child timeouts; recovers a killed session's lock.
    if (now - statSync(path).mtimeMs > 5 * 60 * 1000) rmSync(path, { recursive: true });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  try {
    mkdirSync(path, { mode: 0o700 });
    return true;
  } catch (error) {
    if (error.code === "EEXIST") return false;
    throw error;
  }
}

function disabledByEnvironment(client, env) {
  if (env.IXO_PLUGIN_AUTO_UPDATE === "0") return true;
  const truthy = (value) => Boolean(value) && value !== "0" && value !== "false";
  return client === "claude" && truthy(env.DISABLE_AUTOUPDATER) && !truthy(env.FORCE_AUTOUPDATE_PLUGINS);
}

export function updatePlugins({ client, action = "check", env = process.env, now = Date.now() }) {
  if (!Object.hasOwn(COMMANDS, client)) throw new Error("Choose --client claude or --client codex");
  if (!["check", "now", "status", "enable", "disable"].includes(action)) throw new Error("Unknown updater action");
  const clientHome = client === "codex"
    ? env.CODEX_HOME || join(homedir(), ".codex")
    : env.CLAUDE_CONFIG_DIR || join(homedir(), ".claude");
  const dir = join(clientHome, "ixo-plugin-updates");
  const path = join(dir, "state.json");
  const environmentDisabled = disabledByEnvironment(client, env);
  if (action === "status") return { client, path, environmentDisabled, ...readState(path) };
  // An environment opt-out also avoids creating files on session startup.
  if (["check", "now"].includes(action) && environmentDisabled) return { status: "disabled" };
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  const lock = join(dir, "lock");
  if (!acquireLock(lock, now)) return { status: "busy" };
  try {
    const state = readState(path);
    if (action === "enable" || action === "disable") {
      state.enabled = action === "enable";
      saveState(path, state);
      return { status: action, ...state };
    }
    if (!state.enabled) return { status: "disabled" };
    const recent = (timestamp, interval) => timestamp !== undefined && now >= timestamp && now - timestamp < interval;
    if (action !== "now" && ((state.lastResult === "success" && recent(state.lastSuccessAt, DAY)) || recent(state.lastAttemptAt, HOUR))) {
      return { status: "not-due" };
    }
    // Record before spawning so an interrupted attempt also gets a retry delay.
    state.lastAttemptAt = now;
    state.lastResult = "pending";
    state.lastExitCode = null;
    saveState(path, state);
    let result;
    try { result = refreshClient(client, env); }
    catch { result = { status: null }; }
    const succeeded = !result.error && result.status === 0;
    state.lastResult = succeeded ? "success" : "failed";
    state.lastExitCode = result.status;
    if (succeeded) state.lastSuccessAt = now;
    saveState(path, state);
    return { status: succeeded ? "checked" : "failed", client, ...state };
  } finally {
    rmSync(lock, { recursive: true, force: true });
  }
}

export function main(argv) {
  const args = [...argv];
  let client = process.env.PLUGIN_ROOT ? "codex" : process.env.CLAUDE_PLUGIN_ROOT ? "claude" : undefined;
  const index = args.indexOf("--client");
  if (index !== -1) {
    client = args[index + 1];
    args.splice(index, 2);
  }
  const action = args.length === 0 ? "check" : args.length === 1 ? args[0].replace(/^--/, "") : "invalid";
  try {
    const result = updatePlugins({ client, action });
    if (action !== "check") console.log(JSON.stringify(result, null, 2));
    if (result.status === "failed") {
      console.error("IXO plugin update check failed. Check the client CLI and marketplace, then run --now to retry.");
      return action === "check" ? 0 : 1;
    }
    return 0;
  } catch (error) {
    // Hook failures must not block starting a chat. Avoid printing client output or credentials.
    console.error("IXO plugin updater could not run. Check Node.js, the client CLI, and updater state.json.");
    return action === "check" ? 0 : 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
