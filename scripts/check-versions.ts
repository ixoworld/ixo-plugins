#!/usr/bin/env bun
/**
 * Version-bump check, for pull requests: a plugin whose files changed against the base branch must
 * carry a different `version` in its plugin.json, or installed copies never update.
 *
 *   bun scripts/check-versions.ts origin/develop
 *
 * Compares against the merge base. A plugin that is new, or removed, needs no bump.
 */
import { join } from "node:path";

const base = process.argv[2];
if (!base) {
  console.error("usage: bun scripts/check-versions.ts <base-ref>   (e.g. origin/develop)");
  process.exit(64);
}
const root = join(import.meta.dir, "..");
const git = (...args: string[]) => {
  const r = Bun.spawnSync(["git", "-C", root, ...args], { stdout: "pipe", stderr: "pipe" });
  return { ok: r.exitCode === 0, out: r.stdout.toString(), err: r.stderr.toString() };
};

const changed = git("diff", "--name-only", `${base}...HEAD`, "--", "plugins/");
if (!changed.ok) {
  console.error(`git diff against ${base} failed: ${changed.err.trim()}`);
  process.exit(1);
}
const names = [...new Set(changed.out.split("\n").filter(Boolean).map((f) => f.split("/")[1]))];
const versionOf = (json: string) => JSON.parse(json).version as string;
const problems: string[] = [];
for (const name of names) {
  const before = git("show", `${base}:plugins/${name}/plugin.json`);
  const head = Bun.file(join(root, "plugins", name, "plugin.json"));
  if (!before.ok || !(await head.exists())) continue; // new or removed
  const v0 = versionOf(before.out);
  const v1 = versionOf(await head.text());
  if (v0 === v1) problems.push(`plugins/${name} changed but its version is still ${v1}: bump it in plugin.json (re-run add-plugin with --version)`);
}
if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join("\n"));
  process.exit(1);
}
console.log(`✓ ${names.length} changed plugin(s), all with a new version`);
