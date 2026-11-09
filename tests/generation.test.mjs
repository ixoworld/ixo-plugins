import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";

const source = join(import.meta.dirname, "..");

const fixture = () => {
  const dir = mkdtempSync(join(tmpdir(), "ixo-plugins-generation-"));
  for (const path of ["scripts", "template", "plugins", ".claude-plugin", ".agents", "README.md", "plugin-specs.json"]) {
    cpSync(join(source, path), join(dir, path), { recursive: true });
  }
  return dir;
};

const files = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? files(path) : [path];
});

const snapshot = (dir) => Object.fromEntries(
  [
    ...files(join(dir, "plugins")),
    join(dir, ".claude-plugin/marketplace.json"),
    join(dir, ".agents/plugins/marketplace.json"),
    join(dir, "README.md"),
    join(dir, "plugin-specs.json"),
  ].map((path) => [relative(dir, path), readFileSync(path).toString("base64")]),
);

const run = (dir, script, args = []) => spawnSync("bun", [script, ...args], { cwd: dir, encoding: "utf8" });

test("a late template error leaves every published file and plugin spec intact", () => {
  const dir = fixture();
  try {
    const before = snapshot(dir);
    const skill = join(dir, "template/asks/skills/report/SKILL.md");
    writeFileSync(skill, `${readFileSync(skill, "utf8")}\n{{BOGUS}}\n`);
    const result = run(dir, "scripts/add-plugin.ts", ["--kind", "asks", "--name", "asks", "--title", "asks.world", "--url", "https://asks.world/v1/mcp", "--version", "3.5.2"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /unknown placeholder \{\{BOGUS\}\}/);
    assert.deepEqual(snapshot(dir), before);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("unknown template sections fail before regeneration publishes anything", () => {
  const dir = fixture();
  try {
    const before = snapshot(dir);
    const skill = join(dir, "template/asks/skills/help/SKILL.md");
    writeFileSync(skill, `${readFileSync(skill, "utf8")}\n{{#FUTURE}}future mode{{/FUTURE}}\n`);
    const result = run(dir, "scripts/regenerate.ts");
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /unknown section \{\{#FUTURE\}\}/);
    assert.deepEqual(snapshot(dir), before);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("check mode detects edits to generated endpoints without rewriting them", () => {
  const dir = fixture();
  try {
    const path = join(dir, "plugins/asks/.mcp.json");
    writeFileSync(path, readFileSync(path, "utf8").replace("https://asks.world/v1/mcp", "https://different.example/v1/mcp"));
    const before = snapshot(dir);
    const result = run(dir, "scripts/regenerate.ts", ["--check"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /changed plugins\/asks\/\.mcp\.json/);
    assert.deepEqual(snapshot(dir), before);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("add-plugin publishes its explicit spec and matching manifests together", () => {
  const dir = fixture();
  try {
    const result = run(dir, "scripts/add-plugin.ts", ["--kind", "asks", "--name", "asks", "--title", "asks.world", "--url", "https://asks.world/v1/mcp", "--version", "3.5.3"]);
    assert.equal(result.status, 0, result.stderr);
    const spec = JSON.parse(readFileSync(join(dir, "plugin-specs.json"), "utf8")).plugins.find((plugin) => plugin.name === "asks");
    assert.equal(spec.version, "3.5.3");
    assert.equal(JSON.parse(readFileSync(join(dir, "plugins/asks/plugin.json"), "utf8")).version, "3.5.3");
    assert.equal(run(dir, "scripts/regenerate.ts", ["--check"]).status, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
