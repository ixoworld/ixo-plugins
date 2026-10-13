#!/usr/bin/env bun
/**
 * Structural checks CI runs beside `claude plugin validate --strict`:
 *
 *   1. Each plugin's `plugin.json` and `mcp.json` validate against the Agent Plugins 1.0.0 JSON
 *      Schemas vendored in `schemas/` (https://agent-plugins.org/schemas/1.0.0/{plugin,mcp}.schema.json;
 *      vendored so CI does not depend on that site being up. Re-fetch them when the spec version moves).
 *   2. The two catalogs list the same plugins with the same source, description and metadata, and
 *      every entry points at a plugin directory whose name matches.
 *   3. The Codex catalog's policy values are ones Codex accepts. (There is no published JSON Schema
 *      for either catalog: Claude Code's is checked by `claude plugin validate`; Codex's enums come
 *      from codex-rs `PluginInstallPolicy` / `PluginAuthPolicy`.)
 *   4. A plugin's Claude Code files (`.claude-plugin/plugin.json`, `.mcp.json`) agree with its
 *      portable ones (`plugin.json`, `mcp.json`): same manifest, same servers.
 */
import Ajv2020 from "ajv/dist/2020.js";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const readJson = (...p: string[]) => JSON.parse(readFileSync(join(root, ...p), "utf8"));
const problems: string[] = [];
const bad = (msg: string) => problems.push(msg);

const ajv = new Ajv2020({ allErrors: true, strict: false });
const validators = {
  "plugin.json": ajv.compile(readJson("schemas", "plugin.schema.json")),
  "mcp.json": ajv.compile(readJson("schemas", "mcp.schema.json")),
};

type Entry = { name: string; source: string; description: string; metadata?: Record<string, unknown>; policy?: Record<string, string>; category?: string };
const claude = readJson(".claude-plugin", "marketplace.json") as { plugins: Entry[] };
const codex = readJson(".agents", "plugins", "marketplace.json") as { plugins: Entry[] };

// 2. same plugins in both catalogs
const byName = (c: { plugins: Entry[] }) => new Map(c.plugins.map((p) => [p.name, p]));
const c1 = byName(claude);
const c2 = byName(codex);
if (c1.size !== claude.plugins.length) bad("Claude catalog lists a plugin name twice");
if (c2.size !== codex.plugins.length) bad("Codex catalog lists a plugin name twice");
for (const [name, a] of c1) {
  const b = c2.get(name);
  if (!b) {
    bad(`${name} is in the Claude catalog but not the Codex one`);
    continue;
  }
  for (const key of ["source", "description", "metadata"] as const) {
    if (!isDeepStrictEqual(a[key], b[key])) bad(`${name}: "${key}" differs between the two catalogs`);
  }
  if (a.policy || a.category) bad(`${name}: policy/category belong in the Codex catalog only`);
  // 3. Codex fields
  if (!["NOT_AVAILABLE", "AVAILABLE", "INSTALLED_BY_DEFAULT"].includes(b.policy?.installation ?? "")) bad(`${name}: Codex policy.installation is missing or unknown`);
  if (!["ON_INSTALL", "ON_USE"].includes(b.policy?.authentication ?? "")) bad(`${name}: Codex policy.authentication is missing or unknown`);
  if (!b.category) bad(`${name}: Codex category is missing`);
  if (a.source !== `./plugins/${name}`) bad(`${name}: source must be ./plugins/${name}`);
  if (typeof a.metadata?.kind !== "string") bad(`${name}: metadata.kind is missing`);
}
for (const name of c2.keys()) if (!c1.has(name)) bad(`${name} is in the Codex catalog but not the Claude one`);

// 1 + 4. each plugin directory
const dirs = readdirSync(join(root, "plugins")).filter((d) => statSync(join(root, "plugins", d)).isDirectory());
for (const d of dirs) {
  if (!c1.has(d)) bad(`plugins/${d} is not in the catalogs`);
  for (const [file, validate] of Object.entries(validators)) {
    const path = join("plugins", d, file);
    if (!existsSync(join(root, path))) {
      bad(`${path} is missing`);
      continue;
    }
    if (!validate(readJson(path))) {
      for (const e of validate.errors ?? []) bad(`${path}${e.instancePath} ${e.message}`);
    }
  }
  if (existsSync(join(root, "plugins", d, "plugin.json")) && existsSync(join(root, "plugins", d, ".claude-plugin", "plugin.json"))) {
    const { $schema: _s, ...portable } = readJson("plugins", d, "plugin.json");
    if (!isDeepStrictEqual(portable, readJson("plugins", d, ".claude-plugin", "plugin.json"))) bad(`plugins/${d}: plugin.json and .claude-plugin/plugin.json disagree`);
    if (portable.name !== d) bad(`plugins/${d}: plugin.json name is "${portable.name}"`);
  }
  if (existsSync(join(root, "plugins", d, "mcp.json")) && existsSync(join(root, "plugins", d, ".mcp.json"))) {
    const a = Object.keys(readJson("plugins", d, ".mcp.json").mcpServers ?? {});
    const b = Object.keys(readJson("plugins", d, "mcp.json").mcpServers ?? {});
    if (!isDeepStrictEqual(a, b)) bad(`plugins/${d}: .mcp.json and mcp.json name different servers`);
  }
}
for (const name of c1.keys()) if (!dirs.includes(name)) bad(`${name} is listed but plugins/${name} does not exist`);

if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join("\n"));
  process.exit(1);
}
console.log(`✓ ${dirs.length} plugins: schemas valid, catalogs agree`);
