#!/usr/bin/env bun
/**
 * Rebuild every plugin from its kind template, exactly as `bun run add-plugin` made it, then
 * rewrite the README plugin table. CI runs this on a clean checkout and fails if the tree is
 * then dirty (`git status --porcelain`), so a hand edit to a generated file, a stale template or
 * a forgotten regeneration all fail the same way.
 *
 * The inputs for each plugin come from the repo itself:
 *   - kind and the flags it takes: the Claude catalog entry's `metadata` (kind; package, major,
 *     network), and --url read back from the plugin's own `.mcp.json` (see pluginInputs in add-plugin.ts);
 *   - title: the first line of the plugin's README; version: its plugin.json;
 *   - description: the catalog entry (a re-run keeps what is published).
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { pluginInputs } from "./add-plugin.ts";

const root = join(import.meta.dir, "..");
const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8"));

type Entry = { name: string; metadata?: Record<string, unknown> };
const catalog = readJson(join(root, ".claude-plugin", "marketplace.json")) as { plugins: Entry[] };

const dirs = readdirSync(join(root, "plugins")).filter((d) => statSync(join(root, "plugins", d)).isDirectory());
const listed = catalog.plugins.map((p) => p.name);
const problems: string[] = [];
for (const d of dirs) if (!listed.includes(d)) problems.push(`plugins/${d} is not listed in .claude-plugin/marketplace.json`);
for (const n of listed) if (!dirs.includes(n)) problems.push(`${n} is listed in the catalog but plugins/${n} does not exist`);
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

for (const { name, metadata = {} } of catalog.plugins) {
  const dir = join(root, "plugins", name);
  const readme = join(dir, "README.md");
  if (!existsSync(readme)) {
    console.error(`plugins/${name}/README.md is missing`);
    process.exit(1);
  }
  const title = readFileSync(readme, "utf8").split("\n")[0].replace(/^# /, "");
  const version = readJson(join(dir, ".claude-plugin", "plugin.json")).version as string;
  const { kind, flags } = pluginInputs(name, metadata);
  const args = ["--kind", kind, "--name", name, "--title", title, "--version", version];
  for (const [flag, value] of Object.entries(flags)) args.push(`--${flag}`, value);
  const run = Bun.spawnSync(["bun", join(root, "scripts", "add-plugin.ts"), ...args], { stdout: "ignore", stderr: "inherit" });
  if (run.exitCode !== 0) {
    console.error(`regenerating ${name} failed (exit ${run.exitCode}): bun scripts/add-plugin.ts ${args.join(" ")}`);
    process.exit(1);
  }
}

const table = Bun.spawnSync(["bun", join(root, "scripts", "catalog.ts")], { stdout: "inherit", stderr: "inherit" });
process.exit(table.exitCode ?? 1);
