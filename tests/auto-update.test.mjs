// node --test tests/*.test.mjs — the asks plugin's daily auto-update (template/asks/hooks/auto-update.mjs).
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { check } from "../template/asks/hooks/auto-update.mjs";

const HOUR = 60 * 60 * 1000;

function setup({ catalog = ["asks"], installed = [{ id: "asks@ixo-plugins", scope: "user" }], fail = [] } = {}) {
  const home = mkdtempSync(join(tmpdir(), "ixo-update-"));
  const mp = join(home, "plugins", "marketplaces", "ixo-plugins", ".claude-plugin");
  mkdirSync(mp, { recursive: true });
  writeFileSync(join(mp, "marketplace.json"), JSON.stringify({ plugins: catalog.map((name) => ({ name })) }));
  const calls = [];
  const run = (argv) => {
    calls.push(argv.join(" "));
    if (argv[2] === "list") return { ok: true, stdout: JSON.stringify(installed) };
    return { ok: !fail.some((f) => argv.join(" ").includes(f)), stdout: "" };
  };
  const env = { CLAUDE_PLUGIN_ROOT: "/x", CLAUDE_CONFIG_DIR: home };
  return { home, calls, run, env };
}

test("runs once, then not again the same day; again after a day", () => {
  const { home, calls, run, env } = setup();
  const now = Date.now();
  assert.equal(check({ env, now, run }), "updated");
  assert.deepEqual(calls, [
    "claude plugin list --json",
    "claude plugin marketplace update ixo-plugins",
    "claude plugin update asks@ixo-plugins --scope user",
  ]);
  assert.equal(check({ env, now: now + 23 * HOUR, run }), "not-due");
  assert.equal(calls.length, 3);
  assert.equal(check({ env, now: now + 25 * HOUR, run }), "updated");
  const state = join(home, "ixo-plugin-updates", "state.json");
  assert.equal(statSync(state).mode & 0o777, 0o600);
  assert.equal(existsSync(join(home, "ixo-plugin-updates", "lock")), false);
});

test("a failed attempt waits an hour, then retries", () => {
  const { calls, run, env } = setup({ fail: ["marketplace update"] });
  const now = Date.now();
  assert.equal(check({ env, now, run }), "failed");
  assert.equal(check({ env, now: now + HOUR / 2, run }), "not-due");
  const before = calls.length;
  assert.equal(check({ env, now: now + 2 * HOUR, run }), "failed");
  assert.ok(calls.length > before);
});

test("opt-outs run nothing and write nothing", () => {
  for (const extra of [{ IXO_PLUGIN_AUTO_UPDATE: "0" }, { DISABLE_AUTOUPDATER: "1" }]) {
    const { home, calls, run, env } = setup();
    assert.equal(check({ env: { ...env, ...extra }, run }), "disabled");
    assert.equal(calls.length, 0);
    assert.equal(existsSync(join(home, "ixo-plugin-updates")), false);
  }
  const { run, env } = setup();
  assert.equal(check({ env: { ...env, DISABLE_AUTOUPDATER: "1", FORCE_AUTOUPDATE_PLUGINS: "1" }, run }), "updated");
});

test("a renamed or removed plugin is skipped, not a failure", () => {
  const { calls, run, env } = setup({
    installed: [
      { id: "ixo-openhands@ixo-plugins", scope: "user" },
      { id: "asks@ixo-plugins", scope: "user" },
      { id: "other@elsewhere", scope: "user" },
    ],
    fail: ["update ixo-openhands"],
  });
  assert.equal(check({ env, run }), "updated");
  assert.ok(!calls.some((c) => c.includes("ixo-openhands") || c.includes("other@")));
  assert.ok(calls.includes("claude plugin update asks@ixo-plugins --scope user"));
});

test("Codex upgrades its marketplace", () => {
  const home = mkdtempSync(join(tmpdir(), "ixo-update-codex-"));
  const calls = [];
  const run = (argv) => (calls.push(argv.join(" ")), { ok: true, stdout: "" });
  assert.equal(check({ env: { PLUGIN_ROOT: "/x", CLAUDE_PLUGIN_ROOT: "/x", CODEX_HOME: home }, run }), "updated");
  assert.deepEqual(calls, ["codex plugin marketplace upgrade ixo-plugins"]);
});
