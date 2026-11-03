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

// `/v1/mcp/me`, not `/v1/mcp`: the same server, but it answers 401 without a token, which is what makes
// Claude Code, Codex, claude.ai and ChatGPT open the sign-in. Plain `/v1/mcp` is read-only and never asks.
const PLUGINS = {
  asks: "https://asks.world/v1/mcp/me",
  "asks-testnet": "https://test.asks.world/v1/mcp/me",
};
const SKILLS = ["account", "asks", "connect", "create", "help", "invite", "jobs", "manage", "profile", "report"];

for (const [name, url] of Object.entries(PLUGINS)) {
  test(`${name}: points at the hosted connector ${url}`, () => {
    assert.deepEqual(json("plugins", name, ".mcp.json"), { mcpServers: { [name]: { type: "http", url } } });
    assert.deepEqual(json("plugins", name, "mcp.json").mcpServers, { [name]: { type: "streamable-http", url } });
  });

  test(`${name}: no hooks, the same skills as the template`, () => {
    assert.equal(existsSync(join(root, "plugins", name, "hooks")), false);
    assert.deepEqual(readdirSync(join(root, "plugins", name, "skills")).sort(), SKILLS);
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

test("the asks plugins never send people to the read-only /v1/mcp, which never asks them to sign in", () => {
  const bare = /https:\/\/(test\.)?asks\.world\/v1\/mcp(?!\/me)/;
  const found = [];
  for (const base of ["template/asks", "plugins/asks", "plugins/asks-testnet"]) {
    for (const file of files(join(root, base))) {
      readFileSync(file, "utf8").split("\n").forEach((line, i) => {
        if (bare.test(line)) found.push(`${file.slice(root.length + 1)}:${i + 1}`);
      });
    }
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
