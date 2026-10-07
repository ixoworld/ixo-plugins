#!/usr/bin/env bun
/**
 * Add (or refresh) one oracle's plugin: `plugins/<name>/` built from `template/`, listed in both
 * marketplace catalogs (Claude Code's `.claude-plugin/marketplace.json`, Codex's
 * `.agents/plugins/marketplace.json`). Re-running with the same name rebuilds it in place.
 *
 *   bun run add-oracle --name ixo-swiftdrop-devnet --title "SwiftDrop Express (devnet)" \
 *     --url https://shipment-delivery-oracle.devnet.ixo.earth/v1/mcp \
 *     --description "Proof of delivery for SwiftDrop couriers — devnet"
 *
 * One plugin per oracle on purpose: each oracle is its own sign-in (an IXO token only ever works at
 * the one oracle it was issued for), and a plugin's MCP server list is fixed at install time.
 * Nothing secret is ever written: the package carries a URL; the user signs in with IXO.
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    name: { type: "string" },
    title: { type: "string" },
    url: { type: "string" },
    description: { type: "string" },
  },
});
const { name, title, url } = values;
if (!name || !title || !url) {
  console.error("usage: bun run add-oracle --name <plugin-name> --title <oracle title> --url https://<oracle>/v1/mcp [--description <text>]");
  process.exit(64);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) {
  console.error("--name must be kebab-case (a-z, 0-9, -), at most 64 characters");
  process.exit(64);
}
const mcp = new URL(url);
if (mcp.protocol !== "https:" || mcp.pathname !== "/v1/mcp" || mcp.search || mcp.hash) {
  console.error("--url must be an oracle's MCP endpoint: https://<oracle host>/v1/mcp");
  process.exit(64);
}
const description =
  values.description ??
  `Submit claims to the ${title} oracle, follow the decision and verify its signed receipt.`;
// The MCP server's name: `ixo-<the host's first label, minus "-oracle">` — the same name the IXO
// Decision Console shows for this oracle (e.g. shipment-delivery-oracle.… → ixo-shipment-delivery).
const server = `ixo-${mcp.hostname.split(".")[0].replace(/-oracle$/, "")}`;

const root = join(import.meta.dir, "..");
const out = join(root, "plugins", name);
const write = (path: string, data: unknown) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, typeof data === "string" ? data : `${JSON.stringify(data, null, 2)}\n`);
};

rmSync(out, { recursive: true, force: true });
// Skills: the shared template, with the oracle filled in.
const fill = (text: string) =>
  text.replaceAll("{{TITLE}}", title).replaceAll("{{URL}}", url).replaceAll("{{SERVER}}", server);
const copySkills = (from: string, to: string) => {
  for (const entry of readdirSync(from)) {
    const src = join(from, entry);
    const dst = join(to, entry);
    if (statSync(src).isDirectory()) copySkills(src, dst);
    else write(dst, fill(readFileSync(src, "utf8")));
  }
};
copySkills(join(root, "template", "skills"), join(out, "skills"));

const meta = {
  name,
  version: "0.1.0",
  description,
  author: { name: "IXO", url: "https://ixo.world" },
  homepage: `https://github.com/ixoworld/ixo-plugins/tree/main/plugins/${name}`,
  repository: "https://github.com/ixoworld/ixo-plugins",
  keywords: ["ixo", "decisions", "claims", "verification", "mcp"],
};
// Claude Code reads .claude-plugin/plugin.json + .mcp.json; Codex reads those too, and prefers the
// portable Agent Plugins pair (plugin.json + mcp.json) when present.
write(join(out, ".claude-plugin", "plugin.json"), meta);
write(join(out, ".mcp.json"), { mcpServers: { [server]: { type: "http", url } } });
write(join(out, "plugin.json"), {
  $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  ...meta,
});
write(join(out, "mcp.json"), {
  $schema: "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  mcpServers: { [server]: { type: "streamable-http", url } },
});
write(
  join(out, "README.md"),
  `# ${title}\n\n${description}\n\n- MCP server: \`${server}\` → ${url}\n- Sign-in: IXO (no API key). Every charge needs your approval on IXO.\n- Skills: \`submit-claim\`, \`verify-decision\`, \`can-we-pay\` (never pays).\n\nInstall: see the [repository README](../../README.md).\n`,
);

// Both catalogs: Claude Code's, and Codex's native one (Codex also reads Claude Code's).
const entry = { name, source: `./plugins/${name}`, description };
const catalog = (path: string, base: Record<string, unknown>, extra: Record<string, unknown> = {}) => {
  let doc: { plugins: Record<string, unknown>[] } & Record<string, unknown>;
  try {
    doc = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    doc = { ...base, plugins: [] };
  }
  doc.plugins = [...doc.plugins.filter((p) => p.name !== name), { ...entry, ...extra }].sort((a, b) =>
    String(a.name).localeCompare(String(b.name)),
  );
  write(path, doc);
};
catalog(join(root, ".claude-plugin", "marketplace.json"), {
  name: "ixo-plugins",
  owner: { name: "IXO", url: "https://ixo.world" },
  metadata: { description: "IXO's plugins for AI assistants: independent, signed decisions on claims." },
});
catalog(
  join(root, ".agents", "plugins", "marketplace.json"),
  { name: "ixo-plugins", interface: { displayName: "IXO" } },
  { policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" }, category: "Productivity" },
);

console.log(`✓ plugins/${name} → ${url} (server "${server}")`);
