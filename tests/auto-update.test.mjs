// node --test tests/*.test.mjs — the asks plugin's auto-update (template/asks/hooks/auto-update.mjs).
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { check, findClaude } from "../template/asks/hooks/auto-update.mjs";

const MIN = 60 * 1000;
const CLI = "/bin/claude-test";

function setup({ catalog = ["asks"], installed = [{ id: "asks@ixo-plugins", scope: "user" }], fail = [], local = "2.3.2", remote = { asks: "2.3.3" }, others = {} } = {}) {
  const home = mkdtempSync(join(tmpdir(), "ixo-update-"));
  const mp = join(home, "plugins", "marketplaces", "ixo-plugins", ".claude-plugin");
  mkdirSync(mp, { recursive: true });
  writeFileSync(join(mp, "marketplace.json"), JSON.stringify({ plugins: catalog.map((name) => ({ name })) }));
  const reg = { asks: local, ...others };
  writeFileSync(join(home, "plugins", "installed_plugins.json"), JSON.stringify({
    version: 2, plugins: Object.fromEntries(Object.entries(reg).map(([n, v]) => [`${n}@ixo-plugins`, [{ scope: "user", version: v }]])),
  }));
  const root = join(home, "root");
  mkdirSync(join(root, ".claude-plugin"), { recursive: true });
  writeFileSync(join(root, ".claude-plugin", "plugin.json"), JSON.stringify({ name: "asks", version: local }));
  const calls = [];
  const run = (argv) => {
    calls.push(argv.join(" "));
    if (argv[2] === "list") return { ok: true, stdout: JSON.stringify(installed) };
    return { ok: !fail.some((f) => argv.join(" ").includes(f)), stdout: "" };
  };
  const fetched = [];
  const fetch = async (url) => {
    fetched.push(url);
    if (remote === null) throw new Error("offline");
    const name = url.split("/plugins/")[1].split("/")[0];
    return name in remote
      ? { ok: true, status: 200, json: async () => ({ version: remote[name] }) }
      : { ok: false, status: 404, json: async () => ({}) };
  };
  const env = { CLAUDE_PLUGIN_ROOT: root, CLAUDE_CONFIG_DIR: home, PATH: "" };
  const opts = { env, run, fetch, isExec: (p) => p === CLI };
  env.CLAUDE_CODE_EXECPATH = CLI;
  return { home, calls, fetched, opts };
}

test("same version: no CLI call, nothing written", async () => {
  const { home, calls, fetched, opts } = setup({ remote: { asks: "2.3.2" } });
  assert.equal(await check(opts), "current");
  assert.equal(calls.length, 0);
  assert.deepEqual(fetched, ["https://raw.githubusercontent.com/ixoworld/ixo-plugins/main/plugins/asks/.claude-plugin/plugin.json"]);
  assert.equal(existsSync(join(home, "ixo-plugin-updates")), false);
});

test("newer on main: full update, and again every session while stale (no daily cap)", async () => {
  const { calls, opts } = setup();
  const now = Date.now();
  assert.equal(await check({ ...opts, now }), "updated");
  assert.deepEqual(calls, [
    `${CLI} plugin list --json`,
    `${CLI} plugin marketplace update ixo-plugins`,
    `${CLI} plugin update asks@ixo-plugins --scope user`,
  ]);
  assert.equal(await check({ ...opts, now: now + MIN }), "updated");
  assert.equal(calls.length, 6);
});

test("any installed @ixo-plugins plugin out of date triggers the update", async () => {
  const { calls, fetched, opts } = setup({ remote: { asks: "2.3.2", memory: "1.1.0" }, others: { memory: "1.0.0", gone: "0.1.0" } });
  assert.equal(await check(opts), "updated");
  assert.ok(fetched.some((u) => u.includes("/memory/")));
  assert.ok(calls.length > 0);
});

test("a plugin removed from main (404) is not stale", async () => {
  const { calls, opts } = setup({ remote: { asks: "2.3.2" }, others: { gone: "0.1.0" } });
  assert.equal(await check(opts), "current");
  assert.equal(calls.length, 0);
});

test("offline: quiet, backoff written, 15 min wait, then checks again", async () => {
  const { home, calls, fetched, opts } = setup({ remote: null });
  const now = Date.now();
  assert.equal(await check({ ...opts, now }), "offline");
  assert.equal(calls.length, 0);
  const state = join(home, "ixo-plugin-updates", "state.json");
  assert.equal(JSON.parse(readFileSync(state, "utf8")).lastFailureAt, now);
  assert.equal(statSync(state).mode & 0o777, 0o600);
  const n = fetched.length;
  assert.equal(await check({ ...opts, now: now + 10 * MIN }), "backoff");
  assert.equal(fetched.length, n);
  assert.equal(await check({ ...opts, now: now + 16 * MIN }), "offline");
  assert.equal(existsSync(join(home, "ixo-plugin-updates", "lock")), false);
});

test("a failed update backs off 15 min; a later success clears it", async () => {
  const { home, opts } = setup({ fail: ["marketplace update"] });
  const now = Date.now();
  assert.equal(await check({ ...opts, now }), "failed");
  assert.equal(await check({ ...opts, now: now + 5 * MIN }), "backoff");
  const ok = setup();
  const okOpts = { ...ok.opts, env: { ...ok.opts.env, CLAUDE_CONFIG_DIR: home } };
  assert.equal(await check({ ...okOpts, now: now + 20 * MIN }), "updated");
  assert.equal(JSON.parse(readFileSync(join(home, "ixo-plugin-updates", "state.json"), "utf8")).lastFailureAt, undefined);
});

test("opt-outs run nothing, fetch nothing, write nothing", async () => {
  for (const extra of [{ IXO_PLUGIN_AUTO_UPDATE: "0" }, { DISABLE_AUTOUPDATER: "1" }]) {
    const { home, calls, fetched, opts } = setup();
    assert.equal(await check({ ...opts, env: { ...opts.env, ...extra } }), "disabled");
    assert.equal(calls.length + fetched.length, 0);
    assert.equal(existsSync(join(home, "ixo-plugin-updates")), false);
  }
  const { opts } = setup();
  assert.equal(await check({ ...opts, env: { ...opts.env, DISABLE_AUTOUPDATER: "1", FORCE_AUTOUPDATE_PLUGINS: "1" } }), "updated");
  assert.equal(await check({ ...opts, env: { ...opts.env, DISABLE_AUTOUPDATER: "1", CLAUDE_CODE_ENTRYPOINT: "claude-desktop" } }), "updated");
});

test("a renamed or removed plugin is skipped, not a failure", async () => {
  const { calls, opts } = setup({
    installed: [
      { id: "ixo-openhands@ixo-plugins", scope: "user" },
      { id: "asks@ixo-plugins", scope: "user" },
      { id: "other@elsewhere", scope: "user" },
    ],
    fail: ["update ixo-openhands"],
  });
  assert.equal(await check(opts), "updated");
  assert.ok(!calls.some((c) => c.includes("ixo-openhands") || c.includes("other@")));
  assert.ok(calls.includes(`${CLI} plugin update asks@ixo-plugins --scope user`));
});

test("no claude CLI anywhere: quiet no-op", async () => {
  const { calls, opts } = setup();
  assert.equal(await check({ ...opts, isExec: () => false }), "no-cli");
  assert.equal(calls.length, 0);
});

test("findClaude: PATH, then known paths, then CLAUDE_CODE_EXECPATH (not node)", () => {
  const env = { HOME: "/h", PATH: "/a:/b", CLAUDE_CODE_EXECPATH: "/app/claude" };
  assert.equal(findClaude(env, (p) => p === "/b/claude" || p === "/opt/homebrew/bin/claude"), "/b/claude");
  assert.equal(findClaude(env, (p) => p === "/h/.local/bin/claude" || p === "/app/claude"), "/h/.local/bin/claude");
  assert.equal(findClaude(env, (p) => p === "/app/claude"), "/app/claude");
  assert.equal(findClaude({ ...env, CLAUDE_CODE_EXECPATH: "/usr/bin/node" }, (p) => p === "/usr/bin/node"), null);
});

test("Codex: same cheap check, then upgrades its marketplace", async () => {
  const home = mkdtempSync(join(tmpdir(), "ixo-update-codex-"));
  writeFileSync(join(home, "plugin.json"), JSON.stringify({ name: "asks", version: "2.3.2" }));
  const calls = [];
  const run = (argv) => (calls.push(argv.join(" ")), { ok: true, stdout: "" });
  const fetchV = (v) => async () => ({ ok: true, status: 200, json: async () => ({ version: v }) });
  const env = { PLUGIN_ROOT: home, CLAUDE_PLUGIN_ROOT: home, CODEX_HOME: home };
  assert.equal(await check({ env, run, fetch: fetchV("2.3.2") }), "current");
  assert.equal(calls.length, 0);
  assert.equal(await check({ env, run, fetch: fetchV("2.3.3") }), "updated");
  assert.deepEqual(calls, ["codex plugin marketplace upgrade ixo-plugins"]);
});
