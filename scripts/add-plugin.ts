#!/usr/bin/env bun
/**
 * Add (or refresh) one plugin: `plugins/<name>/` built from `template/<kind>/`, listed in both
 * marketplace catalogs (Claude Code's `.claude-plugin/marketplace.json`, Codex's
 * `.agents/plugins/marketplace.json`). Re-running with the same name rebuilds it in place.
 *
 *   bun run add-plugin --kind oracle --name ixo-swiftdrop-devnet --title "SwiftDrop Express (devnet)" \
 *     --url https://shipment-delivery-oracle.devnet.ixo.earth/v1/mcp \
 *     --description "Proof of delivery for SwiftDrop couriers — devnet"
 *
 * A KIND is a directory `template/<kind>/` holding everything kind-specific — no code per kind:
 *   - `kind.json`: `description` (default plugin description), `keywords`, `serverName` (the MCP
 *     server's name; may use {{HOST_LABEL}}, the URL host's first label, or {{NAME}}, the plugin's
 *     name) and optionally `hostLabelStripSuffix` (removed from the end of {{HOST_LABEL}}).
 *   - `README.md`: the plugin README; its first line must be `# {{TITLE}}` (CI reads the title back
 *     from it).
 *   - `skills/`: the plugin's skills.
 * Text templates take {{TITLE}}, {{URL}}, {{SERVER}} and {{DESCRIPTION}}; any other `{{…}}` fails.
 *
 * The kind is recorded in both catalogs as the plugin entry's `metadata.kind` (`claude plugin
 * validate --strict` rejects unknown keys in plugin.json and at the top of a catalog entry, but
 * accepts the free-form `metadata` object). An entry without one is an oracle (the original kind).
 *
 * One plugin per service on purpose: each service is its own sign-in (an IXO token only ever works
 * at the one service it was issued for), and a plugin's MCP server list is fixed at install time.
 * Nothing secret is ever written: the package carries a URL; the user signs in with IXO.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { parseArgs } from "node:util";

const root = join(import.meta.dir, "..");
const templates = join(root, "template");
const DEFAULT_KIND = "oracle";

type Kind = {
  name: string;
  description: string;
  keywords: string[];
  serverName: string;
  hostLabelStripSuffix?: string;
  readme: string;
  skillsDir: string;
};

/** Every directory under template/ with a kind.json. */
export const listKinds = (): string[] =>
  readdirSync(templates)
    .filter((d) => existsSync(join(templates, d, "kind.json")))
    .sort();

/** Load and check one kind; a broken template is an error, never a silent default. */
const loadKind = (name: string): Kind => {
  const dir = join(templates, name);
  const file = join(dir, "kind.json");
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(readFileSync(file, "utf8"));
  } catch (err) {
    throw new Error(`${file} is not valid JSON: ${err}`);
  }
  const str = (key: string, optional = false) => {
    const v = raw[key];
    if (v === undefined && optional) return undefined;
    if (typeof v !== "string" || !v) throw new Error(`${file}: "${key}" must be a non-empty string`);
    return v;
  };
  const keywords = raw.keywords;
  if (!Array.isArray(keywords) || !keywords.every((k) => typeof k === "string" && k)) {
    throw new Error(`${file}: "keywords" must be an array of non-empty strings`);
  }
  const readmePath = join(dir, "README.md");
  const skillsDir = join(dir, "skills");
  if (!existsSync(readmePath)) throw new Error(`template/${name} has no README.md`);
  if (!existsSync(skillsDir) || !statSync(skillsDir).isDirectory()) {
    throw new Error(`template/${name} has no skills/ directory`);
  }
  const readme = readFileSync(readmePath, "utf8");
  if (readme.split("\n")[0] !== "# {{TITLE}}") {
    throw new Error(`template/${name}/README.md must start with the line "# {{TITLE}}"`);
  }
  return {
    name,
    description: str("description")!,
    keywords,
    serverName: str("serverName")!,
    hostLabelStripSuffix: str("hostLabelStripSuffix", true),
    readme,
    skillsDir,
  };
};

/** Replace the known placeholders in one pass (so a value is never itself expanded). */
const render = (text: string, vars: Record<string, string>, where: string) => {
  const out = text.replace(/\{\{([A-Z_]+)\}\}/g, (m, key: string) => vars[key] ?? m);
  const left = out.match(/\{\{[A-Z_]+\}\}/);
  if (left) throw new Error(`${where}: unknown placeholder ${left[0]}`);
  return out;
};

const usageError = (msg: string, usage: string): never => {
  console.error(msg ? `${msg}\n${usage}` : usage);
  process.exit(64);
};

export type MainOptions = {
  /** Set by a fixed-kind wrapper (add-oracle): the kind is not a flag then. */
  fixedKind?: string;
  /** The command shown in the usage line. */
  command?: string;
};

export function main(argv: string[], opts: MainOptions = {}): void {
  const command = opts.command ?? "bun run add-plugin";
  const kinds = listKinds();
  const usage = opts.fixedKind
    ? `usage: ${command} --name <plugin-name> --title <title> --url https://<host>/v1/mcp [--description <text>] [--version x.y.z]`
    : `usage: ${command} [--kind <${kinds.join("|")}>] --name <plugin-name> --title <title> --url https://<host>/v1/mcp [--description <text>] [--version x.y.z]`;

  let values: Record<string, string | undefined>;
  try {
    ({ values } = parseArgs({
      args: argv,
      options: {
        ...(opts.fixedKind ? {} : { kind: { type: "string" as const } }),
        name: { type: "string" },
        title: { type: "string" },
        url: { type: "string" },
        description: { type: "string" },
        version: { type: "string" },
      },
    }));
  } catch (err) {
    return usageError((err as Error).message, usage);
  }

  const { name, title, url } = values;
  if (!name || !title || !url) return usageError("", usage);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) {
    return usageError("--name must be kebab-case (a-z, 0-9, -), at most 64 characters", usage);
  }
  // The title lands in each skill's YAML frontmatter: keep it to plain text.
  if (/[:#"\n\r]/.test(title) || title.length > 80) {
    return usageError('--title must be plain text (no ":", "#", quotes or newlines), at most 80 characters', usage);
  }
  let mcp: URL;
  try {
    mcp = new URL(url);
  } catch {
    return usageError("--url must be a URL: https://<host>/v1/mcp", usage);
  }
  if (mcp.protocol !== "https:" || mcp.pathname !== "/v1/mcp" || mcp.search || mcp.hash) {
    return usageError("--url must be the service's MCP endpoint: https://<host>/v1/mcp", usage);
  }

  const claudeCatalog = join(root, ".claude-plugin", "marketplace.json");
  const codexCatalog = join(root, ".agents", "plugins", "marketplace.json");
  /** A catalog file, or null when it doesn't exist yet — never a silently emptied one. */
  const readJson = (path: string) => {
    try {
      return JSON.parse(readFileSync(path, "utf8"));
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw new Error(`${path} is not valid JSON — fix it before adding a plugin: ${err}`);
    }
  };
  type Entry = { name: string; description?: string; metadata?: Record<string, unknown> } & Record<string, unknown>;
  const listed: Entry | undefined = readJson(claudeCatalog)?.plugins?.find((p: Entry) => p.name === name);
  // Entries written before kinds existed carry no kind: they are oracles.
  const listedKind = listed ? String(listed.metadata?.kind ?? DEFAULT_KIND) : undefined;

  const kindName = opts.fixedKind ?? values.kind ?? listedKind ?? DEFAULT_KIND;
  if (!kinds.includes(kindName)) {
    return usageError(`--kind must be one of: ${kinds.join(", ")} (a kind is a template/<kind>/ directory with a kind.json)`, usage);
  }
  // Re-generating a plugin as another kind would silently swap its skills and server: refuse.
  if (listedKind && listedKind !== kindName) {
    return usageError(
      `plugins/${name} is listed as kind "${listedKind}", not "${kindName}". Use --kind ${listedKind}, or remove the plugin and its catalog entries first.`,
      usage,
    );
  }
  const kind = loadKind(kindName);

  const version = values.version ?? "0.1.0";
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    return usageError("--version must be x.y.z (bump it when the skills change, so installs update)", usage);
  }

  // The MCP server's name comes from the kind. For oracles: `ixo-<the host's first label, minus
  // "-oracle">` — the same name the IXO Decision Console shows for that oracle
  // (e.g. shipment-delivery-oracle.… → ixo-shipment-delivery).
  let hostLabel = mcp.hostname.split(".")[0];
  if (kind.hostLabelStripSuffix && hostLabel.endsWith(kind.hostLabelStripSuffix)) {
    hostLabel = hostLabel.slice(0, -kind.hostLabelStripSuffix.length);
  }
  // {{NAME}} gives one plugin per network its own server name (ixo-memory-devnet, ixo-memory…),
  // so two networks of the same kind can be installed side by side.
  const server = render(
    kind.serverName,
    { HOST_LABEL: hostLabel, NAME: name },
    `template/${kind.name}/kind.json serverName`,
  );
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(server)) {
    throw new Error(`MCP server name "${server}" (from template/${kind.name}/kind.json) must be kebab-case`);
  }

  // A re-run keeps what is already published unless told otherwise.
  const description =
    values.description ??
    listed?.description ??
    render(kind.description, { TITLE: title, URL: url, SERVER: server }, `template/${kind.name}/kind.json description`);
  const vars = { TITLE: title, URL: url, SERVER: server, DESCRIPTION: description };

  const out = join(root, "plugins", name);
  const write = (path: string, data: unknown) => {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, typeof data === "string" ? data : `${JSON.stringify(data, null, 2)}\n`);
  };

  rmSync(out, { recursive: true, force: true });
  // Skills: the kind's template, filled in.
  const copySkills = (from: string, to: string) => {
    for (const entry of readdirSync(from)) {
      const src = join(from, entry);
      const dst = join(to, entry);
      if (statSync(src).isDirectory()) copySkills(src, dst);
      else write(dst, render(readFileSync(src, "utf8"), vars, src));
    }
  };
  copySkills(kind.skillsDir, join(out, "skills"));

  const meta = {
    name,
    version,
    description,
    author: { name: "IXO", url: "https://ixo.world" },
    homepage: `https://github.com/ixoworld/ixo-plugins/tree/main/plugins/${name}`,
    repository: "https://github.com/ixoworld/ixo-plugins",
    keywords: kind.keywords,
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
  write(join(out, "README.md"), render(kind.readme, vars, `template/${kind.name}/README.md`));

  // Both catalogs: Claude Code's, and Codex's native one (Codex also reads Claude Code's).
  const catalog = (path: string, base: Record<string, unknown>, extra: Record<string, unknown> = {}) => {
    const doc: { plugins: Entry[] } & Record<string, unknown> = readJson(path) ?? { ...base, plugins: [] };
    const previous = doc.plugins.find((p) => p.name === name);
    const entry: Entry = {
      name,
      source: `./plugins/${name}`,
      description,
      // Keep any other metadata someone added by hand; the kind is ours.
      metadata: { ...previous?.metadata, kind: kind.name },
      ...extra,
    };
    doc.plugins = [...doc.plugins.filter((p) => p.name !== name), entry].sort((a, b) =>
      String(a.name).localeCompare(String(b.name)),
    );
    write(path, doc);
  };
  catalog(claudeCatalog, {
    name: "ixo-plugins",
    owner: { name: "IXO", url: "https://ixo.world" },
    metadata: {
      description: "IXO's plugins for AI assistants: independent, signed decisions on claims, and your IXO memory.",
    },
  });
  catalog(
    codexCatalog,
    { name: "ixo-plugins", interface: { displayName: "IXO" } },
    { policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" }, category: "Productivity" },
  );

  console.log(`✓ plugins/${name} (${kind.name}) → ${url} (server "${server}")`);
}

if (import.meta.main) main(process.argv.slice(2));
