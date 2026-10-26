// Daily auto-update for IXO plugins, run by the plugin's SessionStart hook (startup|resume).
// Claude Code: `claude plugin marketplace update ixo-plugins`, then `claude plugin update <id>` for
// every installed @ixo-plugins plugin still in the catalog. Codex: `codex plugin marketplace upgrade
// ixo-plugins`. At most one success a day (one attempt an hour). Never prints, always exits 0.
// Off with IXO_PLUGIN_AUTO_UPDATE=0, or Claude Code's DISABLE_AUTOUPDATER (unless FORCE_AUTOUPDATE_PLUGINS).
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MARKETPLACE = "ixo-plugins";
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const TIMEOUT = 45_000;

const truthy = (v) => Boolean(v) && v !== "0" && v !== "false";

// Codex sets PLUGIN_ROOT and CLAUDE_PLUGIN_ROOT for hooks; Claude Code only CLAUDE_PLUGIN_ROOT.
export const clientOf = (env) => (env.PLUGIN_ROOT ? "codex" : env.CLAUDE_PLUGIN_ROOT ? "claude" : null);

export function disabled(client, env) {
  if (env.IXO_PLUGIN_AUTO_UPDATE === "0" || env.IXO_PLUGIN_AUTO_UPDATE === "false") return true;
  return client === "claude" && truthy(env.DISABLE_AUTOUPDATER) && !truthy(env.FORCE_AUTOUPDATE_PLUGINS);
}

export const configDir = (client, env) =>
  client === "codex" ? env.CODEX_HOME || join(homedir(), ".codex") : env.CLAUDE_CONFIG_DIR || join(homedir(), ".claude");

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

function refresh(client, dir, env, run) {
  const deadline = Date.now() + TIMEOUT;
  const call = (argv, cwd = process.cwd()) => {
    const timeout = deadline - Date.now();
    return timeout > 0 ? run(argv, { cwd, env, timeout }) : { ok: false, stdout: "" };
  };
  if (client === "codex") return call(["codex", "plugin", "marketplace", "upgrade", MARKETPLACE]).ok;

  const listing = call(["claude", "plugin", "list", "--json"]);
  if (!listing.ok) return false;
  let installed;
  try { installed = JSON.parse(listing.stdout); } catch { return false; }
  if (!Array.isArray(installed)) return false;
  if (!call(["claude", "plugin", "marketplace", "update", MARKETPLACE]).ok) return false;
  const listed = catalogNames(dir);
  let ok = true;
  for (const p of installed) {
    const m = typeof p?.id === "string" && /^([a-z0-9]+(?:-[a-z0-9]+)*)@ixo-plugins$/.exec(p.id);
    if (!m || !["user", "project", "local"].includes(p.scope)) continue;
    // Renamed or removed from the catalog (ixo-openhands → asks): Claude Code moves it; not ours to update.
    if (listed && !listed.has(m[1])) continue;
    if (p.scope !== "user" && !(typeof p.projectPath === "string" && isAbsolute(p.projectPath))) continue;
    const done = call(["claude", "plugin", "update", p.id, "--scope", p.scope], p.scope === "user" ? process.cwd() : p.projectPath);
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
export function check({ env = process.env, now = Date.now(), run = exec } = {}) {
  const client = clientOf(env);
  if (!client) return "no-client";
  if (disabled(client, env)) return "disabled";
  const cfg = configDir(client, env);
  const dir = join(cfg, "ixo-plugin-updates");
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  const lockPath = join(dir, "lock");
  if (!lock(lockPath, now)) return "busy";
  try {
    const path = join(dir, "state.json");
    const state = readState(path);
    const recent = (t, span) => Number.isFinite(t) && now >= t && now - t < span;
    if (recent(state.lastSuccessAt, DAY) || recent(state.lastAttemptAt, HOUR)) return "not-due";
    state.lastAttemptAt = now; // before running, so an interrupted run also waits an hour
    saveState(path, state);
    let ok = false;
    try { ok = refresh(client, cfg, env, run); } catch {}
    if (ok) state.lastSuccessAt = now;
    saveState(path, state);
    return ok ? "updated" : "failed";
  } finally {
    rmSync(lockPath, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { check(); } catch {}
  process.exitCode = 0;
}
