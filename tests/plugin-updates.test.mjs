import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import { fileURLToPath } from "node:url";
import { updatePlugins } from "../template/plugin-updates/scripts/update.mjs";

const roots = [];
afterEach(() => { for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true }); });
const script = fileURLToPath(new URL("../template/plugin-updates/scripts/update.mjs", import.meta.url));
const start = 1_800_000_000_000;
const hour = 60 * 60 * 1000;

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "ixo-updates-"));
  roots.push(root);
  const bin = join(root, "bin");
  mkdirSync(bin);
  for (const client of ["claude", "codex"]) {
    writeFileSync(join(bin, client), `#!/usr/bin/env node
import { appendFileSync } from 'node:fs';
appendFileSync(process.env.IXO_TEST_LOG, JSON.stringify(process.argv.slice(1)) + '\\n');
if (process.env.IXO_TEST_CWD_LOG) appendFileSync(process.env.IXO_TEST_CWD_LOG, JSON.stringify(process.cwd()) + '\\n');
console.error('private client output');
if (process.argv.includes('--json')) console.log(process.env.IXO_TEST_LIST || JSON.stringify([
  { id: 'fixture@ixo-plugins', scope: 'user', enabled: false },
  { id: 'other@another-marketplace', scope: 'user' }
]));
if (process.env.IXO_TEST_DELAY) await new Promise(r => setTimeout(r, 300));
process.exitCode = process.argv.includes(process.env.IXO_TEST_FAIL_ID) ? 1 : Number(process.env.IXO_TEST_EXIT || 0);
`, { mode: 0o755 });
  }
  const env = {
    ...process.env,
    PATH: `${bin}${delimiter}${process.env.PATH}`,
    CODEX_HOME: join(root, "codex"),
    CLAUDE_CONFIG_DIR: join(root, "claude"),
    IXO_TEST_LOG: join(root, "commands.jsonl"),
    IXO_PLUGIN_AUTO_UPDATE: "1",
    DISABLE_AUTOUPDATER: "0",
    FORCE_AUTOUPDATE_PLUGINS: "0",
  };
  delete env.PLUGIN_ROOT;
  delete env.CLAUDE_PLUGIN_ROOT;
  const run = (options = {}) => updatePlugins({ client: "codex", env, now: start, ...options });
  const commands = () => {
    try { return readFileSync(env.IXO_TEST_LOG, "utf8").trim().split("\n").map(JSON.parse); }
    catch (error) { if (error.code === "ENOENT") return []; throw error; }
  };
  const statePath = join(env.CODEX_HOME, "ixo-plugin-updates", "state.json");
  return { root, env, run, commands, statePath };
}

for (const client of ["claude", "codex"]) {
  test(`${client}: runs only the native IXO marketplace update`, () => {
    const f = fixture();
    const result = f.run({ client });
    assert.equal(result.status, "checked");
    const [executable, ...args] = f.commands()[client === "claude" ? 1 : 0];
    assert.equal(executable, join(f.root, "bin", client));
    assert.deepEqual(args, ["plugin", "marketplace", client === "codex" ? "upgrade" : "update", "ixo-plugins"]);
    if (client === "claude") assert.deepEqual(f.commands()[2].slice(1), ["plugin", "update", "fixture@ixo-plugins", "--scope", "user"]);
    const state = f.run({ client, action: "status" });
    assert.equal(state.lastSuccessAt, start);
    assert.equal(state.lastExitCode, 0);
    assert.ok(!JSON.stringify(state).includes("private client output"));
  });
}

test("checks daily; --now bypasses the cadence", () => {
  const f = fixture();
  f.run();
  assert.equal(f.run({ now: start + 23 * hour }).status, "not-due");
  assert.equal(f.run({ now: start + 24 * hour }).status, "checked");
  assert.equal(f.run({ action: "now", now: start + 24 * hour + 1 }).status, "checked");
  assert.equal(f.commands().length, 3);
});

test("failed commands retry after an hour without recording success", () => {
  const f = fixture();
  f.env.IXO_TEST_EXIT = "1";
  assert.equal(f.run().status, "failed");
  assert.equal(f.run({ now: start + hour - 1 }).status, "not-due");
  assert.equal(f.run({ now: start + hour }).status, "failed");
  assert.equal(f.run({ action: "status" }).lastSuccessAt, undefined);
  f.env.IXO_TEST_EXIT = "0";
  assert.equal(f.run({ now: start + 2 * hour }).status, "checked");
});

test("a forced check failing after success retries after an hour", () => {
  const f = fixture();
  f.run();
  f.env.IXO_TEST_EXIT = "1";
  assert.equal(f.run({ action: "now", now: start + hour }).status, "failed");
  f.env.IXO_TEST_EXIT = "0";
  assert.equal(f.run({ now: start + 2 * hour }).status, "checked");
});

test("Claude updates recorded scopes and project directories, skipping managed installs", () => {
  const f = fixture();
  const project = join(f.root, "a project with spaces");
  mkdirSync(project);
  f.env.IXO_TEST_LIST = JSON.stringify([
    { id: "fixture@ixo-plugins", scope: "user", enabled: false },
    { id: "fixture@ixo-plugins", scope: "project", projectPath: project },
    { id: "fixture@ixo-plugins", scope: "local", projectPath: project },
    { id: "managed@ixo-plugins", scope: "managed" },
    { id: "other@another-marketplace", scope: "user" },
    { id: "bad;command@ixo-plugins", scope: "user" },
  ]);
  f.env.IXO_TEST_CWD_LOG = join(f.root, "cwd.jsonl");
  assert.equal(f.run({ client: "claude" }).status, "checked");
  const updates = f.commands().slice(2).map(c => c.slice(1));
  assert.deepEqual(updates, ["user", "project", "local"].map(scope => ["plugin", "update", "fixture@ixo-plugins", "--scope", scope]));
  const cwds = readFileSync(f.env.IXO_TEST_CWD_LOG, "utf8").trim().split("\n").map(JSON.parse);
  assert.ok(cwds.slice(-2).every(cwd => cwd.endsWith("a project with spaces")));
});

test("Claude records partial failure and still attempts remaining installed plugins", () => {
  const f = fixture();
  f.env.IXO_TEST_LIST = JSON.stringify(["one", "two"].map(id => ({ id: `${id}@ixo-plugins`, scope: "user" })));
  f.env.IXO_TEST_FAIL_ID = "one@ixo-plugins";
  assert.equal(f.run({ client: "claude" }).status, "failed");
  assert.equal(f.commands().length, 4);
  assert.equal(f.run({ client: "claude", action: "status" }).lastResult, "failed");
});

test("unsupported Claude inventory fails closed before any refresh", () => {
  const f = fixture();
  for (const inventory of ["{}", "not JSON", '[{"id":"fixture@ixo-plugins","scope":"project"}]']) {
    f.env.IXO_TEST_LIST = inventory;
    assert.equal(f.run({ client: "claude", action: "now" }).status, "failed");
  }
  assert.equal(f.commands().length, 3);
  assert.ok(f.commands().every(c => c.includes("--json")));
});

test("pause persists across process calls and --now respects it", () => {
  const f = fixture();
  f.run({ action: "disable" });
  assert.equal(f.run().status, "disabled");
  assert.equal(f.run({ action: "now" }).status, "disabled");
  assert.equal(f.commands().length, 0);
  f.run({ action: "enable" });
  assert.equal(f.run().status, "checked");
});

test("environment opt-out avoids all writes and commands", () => {
  const f = fixture();
  f.env.IXO_PLUGIN_AUTO_UPDATE = "0";
  assert.equal(f.run().status, "disabled");
  assert.equal(f.run({ action: "now" }).status, "disabled");
  assert.equal(f.run({ action: "status" }).environmentDisabled, true);
  assert.equal(f.commands().length, 0);
  assert.deepEqual(readdirSync(f.root).sort(), ["bin"]);
});

test("Claude global update policy is respected, including its plugin override", () => {
  const f = fixture();
  f.env.DISABLE_AUTOUPDATER = "1";
  assert.equal(f.run({ client: "claude" }).status, "disabled");
  assert.equal(f.run().status, "checked");
  f.env.FORCE_AUTOUPDATE_PLUGINS = "1";
  assert.equal(f.run({ client: "claude" }).status, "checked");
});

test("active locks skip; abandoned locks recover", () => {
  const f = fixture();
  const lock = join(f.env.CODEX_HOME, "ixo-plugin-updates", "lock");
  mkdirSync(lock, { recursive: true });
  utimesSync(lock, start / 1000, start / 1000);
  assert.equal(f.run().status, "busy");
  assert.equal(f.commands().length, 0);
  assert.equal(f.run({ now: start + hour }).status, "checked");
});

test("malformed state is preserved and never triggers an update", () => {
  const f = fixture();
  f.run({ action: "disable" });
  writeFileSync(f.statePath, '{"enabled":"false"}');
  assert.throws(() => f.run(), /Invalid updater state/);
  assert.equal(readFileSync(f.statePath, "utf8"), '{"enabled":"false"}');
  assert.equal(f.commands().length, 0);
});

test("a clock rollback does not suppress checks indefinitely", () => {
  const f = fixture();
  f.run();
  assert.equal(f.run({ now: start - hour }).status, "checked");
});

test("unsupported clients and invalid actions cannot execute commands", () => {
  const f = fixture();
  assert.throws(() => f.run({ client: "codex; echo bad" }), /Choose --client/);
  assert.throws(() => f.run({ action: "unknown" }), /Unknown updater action/);
  assert.equal(f.commands().length, 0);
});

function runProcess(env, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], { env });
    let stdout = "", stderr = "";
    child.stdout.on("data", chunk => { stdout += chunk; });
    child.stderr.on("data", chunk => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", code => resolve({ code, stdout, stderr }));
  });
}

test("hook detects Codex and Claude; failures leave sessions usable", async () => {
  const f = fixture();
  for (const env of [{ PLUGIN_ROOT: "/installed", CLAUDE_PLUGIN_ROOT: "/installed" }, { CLAUDE_PLUGIN_ROOT: "/installed" }]) {
    const result = await runProcess({ ...f.env, ...env });
    assert.equal(result.code, 0);
    assert.equal(result.stdout, "");
  }
  assert.equal(f.commands().length, 4);
  const result = await runProcess({ ...f.env, IXO_TEST_EXIT: "1" }, ["--client", "codex", "--now"]);
  assert.equal(result.code, 1);
  assert.ok(!result.stderr.includes("private client output"));
});

test("missing CLI or corrupted state never blocks the startup hook", async () => {
  const f = fixture();
  const result = await runProcess({ ...f.env, PATH: join(f.root, "empty"), PLUGIN_ROOT: "/installed" });
  assert.equal(result.code, 0);
  assert.equal(result.stdout, "");
  assert.equal(f.run({ action: "status" }).lastResult, "failed");
  writeFileSync(f.statePath, "broken JSON");
  assert.equal((await runProcess({ ...f.env, PLUGIN_ROOT: "/installed" })).code, 0);
});

test("concurrent session starts produce one update", async () => {
  const f = fixture();
  const env = { ...f.env, PLUGIN_ROOT: "/installed", IXO_TEST_DELAY: "1" };
  const results = await Promise.all(Array.from({ length: 5 }, () => runProcess(env)));
  assert.ok(results.every(r => r.code === 0));
  assert.equal(f.commands().length, 1);
});
