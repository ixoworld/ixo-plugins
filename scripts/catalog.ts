#!/usr/bin/env bun
/** Refresh or check only the README table, using the same explicit plugin specs as regeneration. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadSpecs, renderAll, root } from "./plugin-generation.ts";

try {
  const expected = renderAll(loadSpecs()).get("README.md");
  if (!expected) throw new Error("README.md was not rendered");
  const path = join(root, "README.md");
  const current = readFileSync(path);
  if (process.argv.includes("--check")) {
    if (!current.equals(expected)) throw new Error("README.md plugin table is out of date: run bun scripts/catalog.ts");
  } else if (!current.equals(expected)) writeFileSync(path, expected);
  console.log("✓ README plugin table");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
