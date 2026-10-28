// Auto-update for IXO plugins, run by the plugin's SessionStart hook (startup|resume).
// Every session: fetch each installed @ixo-plugins plugin's version from main (5 s) and compare.
// All the same: done, no CLI call. Else Claude Code: `claude plugin marketplace update ixo-plugins`,
// then `claude plugin update <id>` for every installed @ixo-plugins plugin still in the catalog.
// Codex: `codex plugin marketplace upgrade ixo-plugins`. A failed attempt waits 15 minutes.
// Never prints, always exits 0.
// Off with IXO_PLUGIN_AUTO_UPDATE=0, or Claude Code's DISABLE_AUTOUPDATER (unless FORCE_AUTOUPDATE_PLUGINS).
import { spawnSync } from "node:child_process";
import { accessSync, constants, mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, delimiter, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MARKETPLACE = "ixo-plugins";
const BACKOFF = 15 * 60 * 1000;
const TIMEOUT = 45_000;
const RAW = "https://raw.githubusercontent.com/ixoworld/ixo-plugins/main/plugins";

const truthy = (v) => Boolean(v) && v !== "0" && v !== "false";

// Codex sets PLUGIN_ROOT and CLAUDE_PLUGIN_ROOT for hooks; Claude Code only CLAUDE_PLUGIN_ROOT.
export const clientOf = (env) => (env.PLUGIN_ROOT ? "codex" : env.CLAUDE_PLUGIN_ROOT ? "claude" : null);

export function disabled(client, env) {
  if (env.IXO_PLUGIN_AUTO_UPDATE === "0" || env.IXO_PLUGIN_AUTO_UPDATE === "false") return true;
  return client === "claude" && truthy(env.DISABLE_AUTOUPDATER) && !truthy(env.FORCE_AUTOUPDATE_PLUGINS);
}

export const configDir = (client, env) =>
  client === "codex" ? env.CODEX_HOME || join(homedir(), ".codex") : env.CLAUDE_CONFIG_DIR || join(homedir(), ".claude");

const executable = (path) => {
  try { accessSync(path, constants.X_OK); return true; } catch { return false; }
};

/** The `claude` CLI: PATH, then the usual install paths, then the binary running this hook (Claude Desktop). */
export function findClaude(env, isExec = executable) {
  if (process.platform === "win32") return "claude"; // shortcut: cmd.exe resolves it on PATH; no Desktop fallback on Windows yet
  const home = env.HOME || homedir();
  const known = [join(home, ".claude", "local", "claude"), join(home, ".local", "bin", "claude"), "/usr/local/bin/claude", "/opt/homebrew/bin/claude"];
  const onPath = (env.PATH || "").split(delimiter).filter(Boolean).map((d) => join(d, "claude"));
  // CLAUDE_CODE_EXECPATH is the Claude Code binary for native installs, but node/bun for npm ones.
  const self = env.CLAUDE_CODE_EXECPATH && !/^(node|bun)(\.exe)?$/.test(basename(env.CLAUDE_CODE_EXECPATH)) ? [env.CLAUDE_CODE_EXECPATH] : [];
  return [...onPath, ...known, ...self].find((p) => isExec(p)) ?? null;
}

const readJson = (path) => {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return null; }
};

/** name → installed version for every @ixo-plugins plugin this machine has (always including this one). */
export function installedVersions(client, cfg, env) {
  const out = new Map();
  if (client === "claude") {
    try {
      const reg = JSON.parse(readFileSync(join(cfg, "plugins", "installed_plugins.json"), "utf8"));
      for (const [id, entries] of Object.entries(reg.plugins ?? {})) {
        const m = /^([a-z0-9]+(?:-[a-z0-9]+)*)@ixo-plugins$/.exec(id);
        const v = Array.isArray(entries) ? entries.find((e) => e?.version)?.version : null;
        if (m && v) out.set(m[1], v);
      }
    } catch {}
  }
  const root = env.PLUGIN_ROOT || env.CLAUDE_PLUGIN_ROOT;
  const own = readJson(join(root, ".claude-plugin", "plugin.json")) ?? readJson(join(root, "plugin.json"));
  if (typeof own?.name === "string" && typeof own.version === "string") out.set(own.name, own.version);
  return out;
}

/** "current" | "stale" | "offline". A plugin main no longer has (404: renamed or removed) is skipped. */
export async function compare(installed, fetchImpl = fetch) {
  let reached = 0;
  for (const [name, version] of installed) {
    try {
      const res = await fetchImpl(`${RAW}/${name}/.claude-plugin/plugin.json`, { signal: AbortSignal.timeout(5000) });
      if (res.status === 404) { reached++; continue; }
      if (!res.ok) continue;
      reached++;
      const remote = (await res.json())?.version;
      if (typeof remote === "string" && remote !== version) return "stale";
    } catch {}
  }
  return reached > 0 || installed.size === 0 ? "current" : "offline";
}

/** Default runner: argv, never a shell (on Windows npm installs .cmd launchers, so go through cmd). */
function exec(argv, { cwd, env, timeout }) {
  const [file, ...args] = process.platform === "win32" ? ["cmd.exe", "/d", "/s", "/c", argv.join(" ")] : argv;
  const r = spawnSync(file, args, {
    cwd, env: { ...env, GIT_TERMINAL_PROMPT: "0" }, stdio: ["ignore", "pipe", "ignore"],
    timeout, maxBuffer: 1024 * 1024, windowsHide: true,
  });
  return { ok: !r.error && r.status === 0, stdout: r.stdout?.toString() ?? "" };
}

/** Names the catalog still lists; null when it can't be read (then every install is tried). */
function catalogNames(dir) {
  try {
    const doc = JSON.parse(readFileSync(join(dir, "plugins", "marketplaces", MARKETPLACE, ".claude-plugin", "marketplace.json"), "utf8"));
    return new Set(doc.plugins.map((p) => p.name));
  } catch {
    return null;
  }
}

function refresh(client, dir, env, run, claude) {
  const deadline = Date.now() + TIMEOUT;
  const call = (argv, cwd = process.cwd()) => {
    const timeout = deadline - Date.now();
    return timeout > 0 ? run(argv, { cwd, env, timeout }) : { ok: false, stdout: "" };
  };
  if (client === "codex") return call(["codex", "plugin", "marketplace", "upgrade", MARKETPLACE]).ok;

  const listing = call([claude, "plugin", "list", "--json"]);
  if (!listing.ok) return false;
  let installed;
  try { installed = JSON.parse(listing.stdout); } catch { return false; }
  if (!Array.isArray(installed)) return false;
  if (!call([claude, "plugin", "marketplace", "update", MARKETPLACE]).ok) return false;
  const listed = catalogNames(dir);
  let ok = true;
  for (const p of installed) {
    const m = typeof p?.id === "string" && /^([a-z0-9]+(?:-[a-z0-9]+)*)@ixo-plugins$/.exec(p.id);
    if (!m || !["user", "project", "local"].includes(p.scope)) continue;
    // Renamed or removed from the catalog (ixo-openhands → asks): Claude Code moves it; not ours to update.
    if (listed && !listed.has(m[1])) continue;
    if (p.scope !== "user" && !(typeof p.projectPath === "string" && isAbsolute(p.projectPath))) continue;
    const done = call([claude, "plugin", "update", p.id, "--scope", p.scope], p.scope === "user" ? process.cwd() : p.projectPath);
    // A failure for a plugin the catalog no longer lists is a rename, not a failure.
    if (!done.ok && (listed === null || listed.has(m[1]))) ok = false;
  }
  return ok;
}

function readState(path) {
  try {
    const s = JSON.parse(readFileSync(path, "utf8"));
    return s && typeof s === "object" && !Array.isArray(s) ? s : {};
  } catch {
    return {};
  }
}

function saveState(path, state) {
  const temp = `${path}.${process.pid}.tmp`;
  writeFileSync(temp, `${JSON.stringify(state)}\n`, { mode: 0o600 });
  renameSync(temp, path);
}

function lock(path, now) {
  try {
    // Older than any run can last: a killed session's lock.
    if (now - statSync(path).mtimeMs > 5 * 60 * 1000) rmSync(path, { recursive: true, force: true });
  } catch {}
  try {
    mkdirSync(path, { mode: 0o700 });
    return true;
  } catch {
    return false;
  }
}

/** One check. Returns what happened, for tests; the hook ignores it. */
export async function check({ env = process.env, now = Date.now(), run = exec, fetch: fetchImpl = fetch, isExec = executable } = {}) {
  const client = clientOf(env);
  if (!client) return "no-client";
  if (disabled(client, env)) return "disabled";
  const cfg = configDir(client, env);
  const dir = join(cfg, "ixo-plugin-updates");
  const path = join(dir, "state.json");
  const state = readState(path);
  const t = state.lastFailureAt;
  if (Number.isFinite(t) && now >= t && now - t < BACKOFF) return "backoff";
  const seen = await compare(installedVersions(client, cfg, env), fetchImpl);
  if (seen === "current") return "current";
  const claude = client === "claude" ? findClaude(env, isExec) : "codex";
  if (!claude && seen === "stale") return "no-cli";
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  const lockPath = join(dir, "lock");
  if (!lock(lockPath, now)) return "busy";
  try {
    let ok = false; // "offline": nothing to run, just back off
    if (seen === "stale") try { ok = refresh(client, cfg, env, run, claude); } catch {}
    if (ok) delete state.lastFailureAt;
    else state.lastFailureAt = now;
    saveState(path, state);
    return ok ? "updated" : seen === "offline" ? "offline" : "failed";
  } finally {
    rmSync(lockPath, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  check().catch(() => {}).finally(() => { process.exitCode = 0; });
}
