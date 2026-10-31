import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';

const root = new URL('../template/', import.meta.url).pathname;
const markdown = readdirSync(root, { recursive: true }).filter((f) => f.endsWith('.md'));
test('every relative link in the templates resolves', () => {
  const broken = [];
  for (const file of markdown)
    for (const [, target] of readFileSync(join(root, file), 'utf8').matchAll(/\]\(([^)\s]+)\)/g))
      if (!/^(https?:|mailto:|#)/.test(target) && !existsSync(join(root, dirname(file), target.split('#')[0])))
        broken.push(`${file} → ${target}`);
  assert.deepEqual(broken, []);
});
