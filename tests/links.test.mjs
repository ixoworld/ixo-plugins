// Every relative link in the asks skills points at a file that exists, and every create reference is
// reachable from the create skill's table (so no reference is orphaned or mistyped).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

const root = join(import.meta.dirname, "..");
const mdFiles = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? mdFiles(p) : p.endsWith(".md") ? [p] : [];
  });

for (const base of ["template/asks/skills", "plugins/asks/skills"]) {
  test(`${base}: relative links resolve`, () => {
    const broken = [];
    for (const file of mdFiles(join(root, base))) {
      for (const [, target] of readFileSync(file, "utf8").matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g)) {
        if (/^[a-z]+:/i.test(target)) continue;
        if (!existsSync(join(dirname(file), target))) broken.push(`${file.slice(root.length + 1)} → ${target}`);
      }
    }
    assert.deepEqual(broken, []);
  });
}

test("create: every reference is linked from the skill", () => {
  const dir = join(root, "template/asks/skills/create");
  const skill = readFileSync(join(dir, "SKILL.md"), "utf8");
  const missing = readdirSync(join(dir, "references")).filter((f) => !skill.includes(`(references/${f})`));
  assert.deepEqual(missing, []);
});
