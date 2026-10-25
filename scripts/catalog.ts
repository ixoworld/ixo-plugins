#!/usr/bin/env bun
/**
 * Write the README's plugin table from the Claude Code catalog, between the
 * `<!-- plugins:start -->` and `<!-- plugins:end -->` markers. The README table is generated:
 * edit the catalog (via `bun run add-plugin`), not the table. `--check` only reports drift.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadKind, pluginInputs } from "./add-plugin.ts";

const root = join(import.meta.dir, "..");
const START = "<!-- plugins:start -->";
const END = "<!-- plugins:end -->";

type Entry = { name: string; description: string; metadata?: Record<string, string> };
const catalog = JSON.parse(readFileSync(join(root, ".claude-plugin", "marketplace.json"), "utf8")) as {
  name: string;
  plugins: Entry[];
};

const cell = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
const runs = (p: Entry) => {
  const m = pluginInputs(p.name, p.metadata).flags;
  if (m.url) return `hosted, ${new URL(m.url).host}`;
  if (m.package) return `local, \`npx ${m.package}@${m.major}\` (${m.network})`;
  if (existsSync(join(root, "plugins", p.name, "hooks", "hooks.json"))) return "local, session hook";
  return loadKind(String(p.metadata?.kind ?? "oracle")).mcp ? "" : "skills only";
};

const rows = [
  "| Plugin | Kind | Runs | What it does |",
  "| --- | --- | --- | --- |",
  ...catalog.plugins.map((p) =>
    `| [\`${p.name}\`](plugins/${p.name}/README.md) | ${cell(p.metadata?.kind ?? "oracle")} | ${cell(runs(p))} | ${cell(p.description)} |`,
  ),
];

const readmePath = join(root, "README.md");
const readme = readFileSync(readmePath, "utf8");
const a = readme.indexOf(START);
const b = readme.indexOf(END);
if (a === -1 || b === -1 || b < a) {
  console.error(`README.md needs ${START} and ${END} markers (in that order)`);
  process.exit(1);
}
const next = `${readme.slice(0, a + START.length)}\n${rows.join("\n")}\n${readme.slice(b)}`;
if (process.argv.includes("--check")) {
  if (next !== readme) {
    console.error("README.md plugin table is out of date: run `bun scripts/catalog.ts`");
    process.exit(1);
  }
} else if (next !== readme) {
  writeFileSync(readmePath, next);
}
console.log(`✓ README plugin table (${catalog.plugins.length} plugins)`);
