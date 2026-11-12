// node --test tests/*.test.mjs — the asks plugins use asks.world's hosted connector: one plugin per
// network, no local server, no hooks, and skills with nothing left of the local package.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const json = (...p) => JSON.parse(readFileSync(join(root, ...p), "utf8"));
const files = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : [p];
  });

// `/v1/mcp` answers 401 without a token, which is what makes Claude Code, Codex, claude.ai and ChatGPT open the sign-in.
const PLUGINS = {
  asks: "https://asks.world/v1/mcp",
  "asks-testnet": "https://test.asks.world/v1/mcp",
};
const SKILLS = ["account", "asks", "connect", "create", "help", "investor-demo", "invite", "jobs", "manage", "profile", "report"];

for (const [name, url] of Object.entries(PLUGINS)) {
  test(`${name}: points at the hosted connector ${url}`, () => {
    assert.deepEqual(json("plugins", name, ".mcp.json"), { mcpServers: { [name]: { type: "http", url } } });
    assert.deepEqual(json("plugins", name, "mcp.json").mcpServers, { [name]: { type: "streamable-http", url } });
  });

  test(`${name}: no hooks, the same skills as the template`, () => {
    assert.equal(existsSync(join(root, "plugins", name, "hooks")), false);
    const dir = join(root, "plugins", name, "skills");
    assert.deepEqual(readdirSync(dir).filter((f) => statSync(join(dir, f)).isDirectory()).sort(), SKILLS);
  });

  // QiForge's asks oracle reads the skill names from this file on raw.githubusercontent.com (GitHub's API
  // rate-limits Cloudflare): add a new skill's folder name to template/asks/skills/index.json too.
  test(`${name}: skills/index.json lists every skill folder`, () => {
    assert.deepEqual(json("plugins", name, "skills", "index.json"), SKILLS);
  });

  test(`${name}: listed in both catalogs as kind asks`, () => {
    for (const catalog of [[".claude-plugin", "marketplace.json"], [".agents", "plugins", "marketplace.json"]]) {
      const entry = json(...catalog).plugins.find((p) => p.name === name);
      assert.ok(entry, `${name} missing from ${catalog.join("/")}`);
      assert.deepEqual(entry.metadata, { kind: "asks" });
    }
  });
}

test("template: no hooks and no local transport", () => {
  assert.equal(existsSync(join(root, "template", "asks", "hooks")), false);
  assert.equal(json("template", "asks", "kind.json").mcp, undefined);
});

// What only the local package had: its own key, the connect link, sweeping, config help, files on disk.
const LOCAL_ONLY = [
  /connect_account/, /get_connect_link/, /plain_key/, /sweep_earnings/, /get_config_help/,
  /reviews: true/, /\.openhands\b/, /@ixo\/asks-mcp/, /IXO_PLUGIN_AUTO_UPDATE/, /CLAUDE_CODE_REMOTE/,
  /`network`/, /full paths?\b/, /path on this computer/,
];
for (const base of ["template/asks", "plugins/asks", "plugins/asks-testnet"]) {
  test(`${base}: nothing left of the local package`, () => {
    const found = [];
    for (const file of files(join(root, base)).filter((f) => f.endsWith(".md"))) {
      readFileSync(file, "utf8").split("\n").forEach((line, i) => {
        for (const re of LOCAL_ONLY) if (re.test(line)) found.push(`${file.slice(root.length + 1)}:${i + 1} ${re}`);
      });
    }
    assert.deepEqual(found, []);
  });
}

test("the asks plugins never send people to a /v1/mcp/me address, or tell them about one, since it no longer exists", () => {
  // The old address itself, and text that set `/v1/mcp` against it ("without `/me`").
  const old = [/https:\/\/(test\.)?asks\.world\/v1\/mcp\/me\b/, /\/v1\/mcp\/me\b/, /without `\/me`/];
  const found = [];
  const bases = ["template/asks", "plugins/asks", "plugins/asks-testnet"];
  const loose = ["README.md", "CONTRIBUTING.md", "docs", "scripts"].map((p) => join(root, p));
  const scanned = [...bases.flatMap((b) => files(join(root, b))), ...loose.flatMap((p) => (statSync(p).isDirectory() ? files(p) : [p]))];
  for (const file of scanned) {
    readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      for (const re of old) if (re.test(line)) found.push(`${file.slice(root.length + 1)}:${i + 1} ${re}`);
    });
  }
  assert.deepEqual(found, []);
});

test("each plugin sends people to its own site's pages", () => {
  const pages = /https:\/\/(test\.)?asks\.world\/(me|pros)\b/g;
  for (const [name, wantTest] of [["asks", false], ["asks-testnet", true]]) {
    for (const file of files(join(root, "plugins", name, "skills"))) {
      for (const m of readFileSync(file, "utf8").matchAll(pages)) {
        assert.equal(Boolean(m[1]), wantTest, `${file.slice(root.length + 1)}: ${m[0]}`);
      }
    }
  }
});

test('investor journey is discoverable through both plugins and hosted asks_help references', () => {
  for (const name of ['asks', 'asks-testnet']) {
    const dir = join(root, 'plugins', name, 'skills', 'investor-demo');
    const skill = readFileSync(join(dir, 'SKILL.md'), 'utf8');
    const references = [...new Set([...skill.matchAll(/references\/([a-z0-9-]+)\.md/g)].map(m => m[1]))];
    assert.deepEqual(references, ['connection', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7']);
    for (const reference of references) assert.ok(readFileSync(join(dir, 'references', reference + '.md'), 'utf8').length);
    assert.ok(json('plugins', name, 'skills', 'index.json').includes('investor-demo'));
    assert.match(skill, /topic: "investor-demo"/);
    assert.match(skill, /Do not send the person to paste stage files/);
    assert.match(skill, /Do not restart Step 1/);
    assert.match(readFileSync(join(dir, 'references/step-2.md'), 'utf8'), /For youth livelihoods, prioritise/);
    assert.match(readFileSync(join(dir, 'references/step-3.md'), 'utf8'), /`post_call` WITHOUT confirmation/);
    assert.match(readFileSync(join(dir, 'references/step-4.md'), 'utf8'), /`link_status` then `read_ask`/);
    assert.match(readFileSync(join(dir, 'references/step-5.md'), 'utf8'), /Do not fabricate testimony/);
    assert.match(readFileSync(join(dir, 'references/step-6.md'), 'utf8'), /Report paid only from positive product evidence/);
    if (name === 'asks') {
      assert.match(skill, /Do not run the rehearsal here/);
      for (const ref of references) assert.match(readFileSync(join(dir, 'references', ref + '.md'), 'utf8'), /Do not execute the rehearsal here/);
    } else assert.match(skill, /practice-money connector at https:\/\/test\.asks\.world\/v1\/mcp/);
  }
});
