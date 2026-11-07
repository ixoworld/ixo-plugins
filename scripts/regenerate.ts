#!/usr/bin/env bun
/** Render every plugin from plugin-specs.json; --check compares every generated file without writing. */
import { compareGenerated, loadSpecs, publishGenerated, renderAll } from "./plugin-generation.ts";

const mode = process.argv[2];
if (mode && mode !== "--check") {
  console.error("usage: bun scripts/regenerate.ts [--check]");
  process.exit(64);
}

try {
  const expected = renderAll(loadSpecs());
  if (mode === "--check") {
    const differences = compareGenerated(expected);
    if (differences.length) {
      console.error(`Generated files differ from plugin-specs.json:\n${differences.map((path) => `  ${path}`).join("\n")}`);
      process.exitCode = 1;
    } else console.log(`✓ ${expected.size} generated files match plugin-specs.json`);
  } else {
    publishGenerated(expected);
    console.log(`✓ published ${expected.size} generated files`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
