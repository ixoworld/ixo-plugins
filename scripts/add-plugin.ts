#!/usr/bin/env bun
/**
 * Add (or refresh) one plugin: `plugins/<name>/` built from `template/<kind>/`, listed in both
 * marketplace catalogs (Claude Code's `.claude-plugin/marketplace.json`, Codex's
 * `.agents/plugins/marketplace.json`). Re-running with the same name rebuilds it in place.
 *
 *   # a hosted (remote) plugin: the MCP server lives at a URL
 *   bun run add-plugin --kind oracle --name ixo-swiftdrop-devnet --title "SwiftDrop Express (devnet)" \
 *     --url https://shipment-delivery-oracle.devnet.ixo.earth/v1/mcp \
 *     --description "Proof of delivery for SwiftDrop couriers — devnet"
 *   # a local plugin: the client starts the MCP server as a command
 *   bun run add-plugin --kind asks --name asks --title "asks.world" \
 *     --package @ixo/asks-mcp --major latest
 *
 * A KIND is a directory `template/<kind>/` holding everything kind-specific — no code per kind:
 *   - `kind.json`: `description` (default plugin description), `keywords`, `serverName` (the MCP
 *     server's name; may use {{HOST_LABEL}}, the URL host's first label, or {{NAME}}, the plugin's
 *     name) and optionally `hostLabelStripSuffix` (removed from the end of {{HOST_LABEL}}), and the
 *     transport:
 *       - `mcp` `{ claude: <entry>, codex: <entry> }`: the server entry written to `.mcp.json`
 *         (Claude Code) and `mcp.json` (portable Agent Plugins / Codex). Absent = the hosted
 *         default: `{type: http, url}` / `{type: streamable-http, url}`. The placeholders used in it
 *         decide which flags are required: {{URL}} → --url, {{PACKAGE}} → --package,
 *         {{MAJOR}} → --major, {{NETWORK}} → --network. `null` = a skills-only kind: no MCP
 *         server, no `.mcp.json` / `mcp.json`, no transport flags (`serverName` is then optional).
 *       - `urlPath` (default `/v1/mcp`): the path a hosted plugin's --url must have.
 *       - `networks` (optional): the values --network may take.
 *       - `codex` `{ policy: {installation, authentication}, category }`: the Codex catalog fields
 *         (default AVAILABLE / ON_INSTALL / Productivity).
 *   - `README.md`: the plugin README; its first line must be `# {{TITLE}}` (CI reads the title back
 *     from it).
 *   - `skills/`: the plugin's skills.
 *   - `hooks/` (optional): copied as is (`hooks/hooks.json` and the scripts it runs).
 * Text templates may wrap text in {{#PINNED}}…{{/PINNED}} (kept only with --pinned true) or {{^PINNED}}…{{/PINNED}} (kept only without it),
 * and likewise {{#TESTNET}}…{{/TESTNET}} / {{^TESTNET}}…{{/TESTNET}} (testnet: --network testnet, or a --url whose host has a `test.` or `testnet.` label).
 * Text templates take {{NAME}} (the plugin's name), {{TITLE}}, {{SERVER}}, {{DESCRIPTION}} and the placeholders above that the kind's
 * `mcp` block uses; any other `{{…}}` fails.
 *
 * The kind is recorded in both catalogs as the plugin entry's `metadata.kind` (`claude plugin
 * validate --strict` rejects unknown keys in plugin.json and at the top of a catalog entry, but
 * accepts the free-form `metadata` object). An entry without one is an oracle (the original kind).
 *
 * One plugin per service on purpose: each service is its own sign-in (an IXO token only ever works
 * at the one service it was issued for), and a plugin's MCP server list is fixed at install time.
 * Nothing secret is ever written: a hosted plugin carries a URL (the user signs in with IXO); a local
 * plugin carries a command and env REFERENCES (a kind's `env` may not hold a secret-looking value
 * unless it is a `${VAR}` reference). What each plugin was generated from is recorded so
 * `scripts/regenerate.ts` can rebuild it: the catalog entry's `metadata` carries `kind` plus the
 * flags that cannot be read back from the plugin itself (--package, --major, --network); --url is
 * not recorded, because it is the `url` of the plugin's own `.mcp.json` server (so an oracle or
 * memory entry stays `metadata: { kind }`, exactly as those kinds always wrote it).
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { parseArgs } from "node:util";

const root = join(import.meta.dir, "..");
const templates = join(root, "template");
const DEFAULT_KIND = "oracle";

type McpEntry = Record<string, unknown>;
/** The generation flags a kind's `mcp` block can ask for; each is a {{PLACEHOLDER}} too. */
const PARAMS = ["url", "package", "major", "network"] as const;
type Param = (typeof PARAMS)[number];
/** Optional flags any kind takes, recorded in the catalog like the others: --server overrides the kind's
 *  serverName; --pinned true writes the literal (codex) entry to `.mcp.json` too, so no ${VAR} can change
 *  the version or network (the "always testnet, always @dev" test plugins). */
const OPTIONAL = ["server", "pinned"] as const;

const DEFAULT_MCP = {
  claude: { type: "http", url: "{{URL}}" },
  codex: { type: "streamable-http", url: "{{URL}}" },
};
const DEFAULT_CODEX = { policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" }, category: "Productivity" };
// Values the Codex marketplace accepts (codex-rs app-server-protocol: PluginInstallPolicy, PluginAuthPolicy).
const INSTALLATION = ["NOT_AVAILABLE", "AVAILABLE", "INSTALLED_BY_DEFAULT"];
const AUTHENTICATION = ["ON_INSTALL", "ON_USE"];
const SECRETISH = /key|secret|token|password|mnemonic|credential/i;

type Kind = {
  name: string;
  description: string;
  keywords: string[];
  serverName?: string;
  hostLabelStripSuffix?: string;
  urlPath: string;
  networks?: string[];
  /** null: a skills-only kind (no MCP server, no transport flags). */
  mcp: { claude: McpEntry; codex: McpEntry } | null;
  codex: { policy: { installation: string; authentication: string }; category: string };
  /** Which of the generation flags this kind's `mcp` block needs. */
  needs: Param[];
  readme: string;
  skillsDir: string;
};

/** Every directory under template/ with a kind.json. */
export const listKinds = (): string[] =>
  readdirSync(templates)
    .filter((d) => existsSync(join(templates, d, "kind.json")))
    .sort();

/** Load and check one kind; a broken template is an error, never a silent default. */
export const loadKind = (name: string): Kind => {
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
  const obj = (v: unknown, where: string): Record<string, unknown> => {
    if (typeof v !== "object" || v === null || Array.isArray(v)) throw new Error(`${file}: ${where} must be an object`);
    return v as Record<string, unknown>;
  };
  // Transport: the hosted default unless the kind says otherwise; `null` = skills only.
  const skillsOnly = raw.mcp === null;
  const mcpRaw = raw.mcp === undefined ? DEFAULT_MCP : skillsOnly ? null : obj(raw.mcp, '"mcp"');
  const checkEntry = (e: Record<string, unknown>, where: string, types: string[]) => {
    if (typeof e.type !== "string" || !types.includes(e.type)) {
      throw new Error(`${file}: "${where}.type" must be one of ${types.join(", ")}`);
    }
    if (e.type === "stdio") {
      if (typeof e.command !== "string" || !e.command) throw new Error(`${file}: "${where}.command" is required for stdio`);
      if (e.args !== undefined && !(Array.isArray(e.args) && e.args.every((a) => typeof a === "string"))) {
        throw new Error(`${file}: "${where}.args" must be an array of strings`);
      }
      const env = e.env === undefined ? {} : obj(e.env, `"${where}.env"`);
      for (const [k, v] of Object.entries(env)) {
        if (typeof v !== "string") throw new Error(`${file}: "${where}.env.${k}" must be a string`);
        // Only references to a secret may ever be written, never a value.
        if (SECRETISH.test(k) && !/^\$\{[A-Za-z_][A-Za-z0-9_]*(:-[^}]*)?\}$/.test(v)) {
          throw new Error(`${file}: "${where}.env.${k}" looks like a secret: use a \${VAR} reference, never a value`);
        }
      }
    } else if (typeof e.url !== "string" || !e.url) {
      throw new Error(`${file}: "${where}.url" is required for ${e.type}`);
    }
  };
  let mcp: Kind["mcp"] = null;
  if (mcpRaw) {
    mcp = { claude: obj(mcpRaw.claude, '"mcp.claude"'), codex: obj(mcpRaw.codex, '"mcp.codex"') };
    checkEntry(mcp.claude, "mcp.claude", ["stdio", "http", "sse"]);
    checkEntry(mcp.codex, "mcp.codex", ["stdio", "streamable-http", "sse"]);
  }
  const used = new Set(
    [...JSON.stringify(mcp ?? []).matchAll(/\{\{([A-Z_]+)\}\}/g)].map((m) => m[1].toLowerCase()),
  );
  const unknown = [...used].filter((u) => !(PARAMS as readonly string[]).includes(u));
  if (unknown.length) throw new Error(`${file}: unknown placeholder {{${unknown[0].toUpperCase()}}} in "mcp"`);
  const needs = PARAMS.filter((p) => used.has(p));

  const codexRaw = raw.codex === undefined ? DEFAULT_CODEX : obj(raw.codex, '"codex"');
  const policy = obj(codexRaw.policy, '"codex.policy"');
  if (typeof policy.installation !== "string" || !INSTALLATION.includes(policy.installation)) {
    throw new Error(`${file}: "codex.policy.installation" must be one of ${INSTALLATION.join(", ")}`);
  }
  if (typeof policy.authentication !== "string" || !AUTHENTICATION.includes(policy.authentication)) {
    throw new Error(`${file}: "codex.policy.authentication" must be one of ${AUTHENTICATION.join(", ")}`);
  }
  if (typeof codexRaw.category !== "string" || !codexRaw.category) {
    throw new Error(`${file}: "codex.category" must be a non-empty string`);
  }
  const urlPath = raw.urlPath === undefined ? "/v1/mcp" : str("urlPath")!;
  if (!urlPath.startsWith("/")) throw new Error(`${file}: "urlPath" must start with "/"`);
  const networks = raw.networks;
  if (networks !== undefined && !(Array.isArray(networks) && networks.every((n) => typeof n === "string" && n))) {
    throw new Error(`${file}: "networks" must be an array of non-empty strings`);
  }
  return {
    name,
    urlPath,
    networks: networks as string[] | undefined,
    mcp,
    codex: {
      policy: { installation: policy.installation, authentication: policy.authentication },
      category: codexRaw.category,
    },
    needs,
    description: str("description")!,
    keywords,
    serverName: str("serverName", skillsOnly),
    hostLabelStripSuffix: str("hostLabelStripSuffix", true),
    readme,
    skillsDir,
  };
};

/**
 * What a listed plugin was generated from: its kind and every flag the kind takes. `kind` and the
 * non-URL flags come from the catalog entry's `metadata`; --url (never recorded there) is read back
 * from the plugin's own `.mcp.json`, whose one server carries it. Used by regenerate.ts and catalog.ts.
 */
export const pluginInputs = (
  name: string,
  metadata: Record<string, unknown> = {},
): { kind: string; flags: Record<string, string> } => {
  const { kind = DEFAULT_KIND, ...rest } = metadata;
  const flags: Record<string, string> = {};
  for (const p of [...PARAMS, ...OPTIONAL]) if (typeof rest[p] === "string") flags[p] = rest[p] as string;
  if (loadKind(String(kind)).needs.includes("url") && flags.url === undefined) {
    const path = join(root, "plugins", name, ".mcp.json");
    const servers = Object.values((JSON.parse(readFileSync(path, "utf8")).mcpServers ?? {}) as Record<string, McpEntry>);
    if (servers.length !== 1 || typeof servers[0].url !== "string") {
      throw new Error(`${path}: expected exactly one MCP server with a "url" (the plugin's --url)`);
    }
    flags.url = servers[0].url;
  }
  return { kind: String(kind), flags };
};

/** Replace the known placeholders in one pass (so a value is never itself expanded). */
const render = (text: string, vars: Record<string, string>, where: string) => {
  // {{#FLAG}}…{{/FLAG}} stays only when vars.FLAG is set, {{^FLAG}}…{{/FLAG}} only when not (FLAG: PINNED, TESTNET; no nesting).
  const kept = text.replace(/\{\{([#^])(PINNED|TESTNET)\}\}([\s\S]*?)\{\{\/\2\}\}/g, (_m, k: string, flag: string, body: string) =>
    (k === "#") === Boolean(vars[flag]) ? body : "",
  );
  const out = kept.replace(/\{\{([A-Z_]+)\}\}/g, (m, key: string) => vars[key] ?? m);
  const left = out.match(/\{\{[A-Z_]+\}\}/);
  if (left) throw new Error(`${where}: unknown placeholder ${left[0]}`);
  return out;
};

/** Render every string in a JSON value (the kind's `mcp` entries) — keys are never templated. */
const renderDeep = (value: unknown, vars: Record<string, string>, where: string): unknown => {
  if (typeof value === "string") return render(value, vars, where);
  if (Array.isArray(value)) return value.map((v) => renderDeep(v, vars, where));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, renderDeep(v, vars, where)]));
  }
  return value;
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
  const flags = "(--url https://<host><path> | --package <npm-name> --major <n> --network <name>, as the kind needs)";
  const usage = opts.fixedKind
    ? `usage: ${command} --name <plugin-name> --title <title> ${flags} [--server <name>] [--pinned true] [--description <text>] [--version x.y.z]`
    : `usage: ${command} [--kind <${kinds.join("|")}>] --name <plugin-name> --title <title> ${flags} [--server <name>] [--pinned true] [--description <text>] [--version x.y.z]`;

  let values: Record<string, string | undefined>;
  try {
    ({ values } = parseArgs({
      args: argv,
      options: {
        ...(opts.fixedKind ? {} : { kind: { type: "string" as const } }),
        name: { type: "string" },
        title: { type: "string" },
        url: { type: "string" },
        package: { type: "string" },
        major: { type: "string" },
        network: { type: "string" },
        server: { type: "string" },
        pinned: { type: "string" },
        description: { type: "string" },
        version: { type: "string" },
      },
    }));
  } catch (err) {
    return usageError((err as Error).message, usage);
  }

  const { name, title } = values;
  if (!name || !title) return usageError("", usage);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) {
    return usageError("--name must be kebab-case (a-z, 0-9, -), at most 64 characters", usage);
  }
  // The title lands in each skill's YAML frontmatter: keep it to plain text.
  if (/[:#"\n\r]/.test(title) || title.length > 80) {
    return usageError('--title must be plain text (no ":", "#", quotes or newlines), at most 80 characters', usage);
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

  // The flags this kind's transport needs are required; the others are refused, not ignored.
  const given: Partial<Record<Param, string>> = {};
  for (const p of PARAMS) if (values[p] !== undefined) given[p] = values[p];
  for (const p of PARAMS) {
    if (kind.needs.includes(p) && !given[p]) return usageError(`kind "${kind.name}" needs --${p}`, usage);
    if (!kind.needs.includes(p) && given[p]) return usageError(`kind "${kind.name}" does not take --${p}`, usage);
  }
  let mcpUrl: URL | undefined;
  if (given.url !== undefined) {
    try {
      mcpUrl = new URL(given.url);
    } catch {
      return usageError(`--url must be a URL: https://<host>${kind.urlPath}`, usage);
    }
    if (mcpUrl.protocol !== "https:" || mcpUrl.pathname !== kind.urlPath || mcpUrl.search || mcpUrl.hash) {
      return usageError(`--url must be the service's MCP endpoint for kind "${kind.name}": https://<host>${kind.urlPath}`, usage);
    }
  }
  if (given.package !== undefined && !/^(@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(given.package)) {
    return usageError("--package must be an npm package name, e.g. @scope/name", usage);
  }
  // A major number, or an npm dist-tag such as dev (the newest build).
  if (given.major !== undefined && !/^(0|[1-9]\d*|[a-z][a-z0-9-]*)$/.test(given.major)) {
    return usageError("--major must be a major version number (e.g. 1) or an npm dist-tag (e.g. dev)", usage);
  }
  const optional: Partial<Record<(typeof OPTIONAL)[number], string>> = {};
  for (const o of OPTIONAL) if (values[o] !== undefined) optional[o] = values[o];
  if (optional.pinned !== undefined && optional.pinned !== "true") return usageError("--pinned must be true", usage);
  if (optional.server !== undefined && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(optional.server)) {
    return usageError("--server must be kebab-case", usage);
  }
  if (optional.pinned && !kind.mcp) return usageError(`kind "${kind.name}" has no MCP server to pin`, usage);
  if (given.network !== undefined) {
    if (!/^[a-z][a-z0-9-]*$/.test(given.network)) return usageError("--network must be lowercase, e.g. mainnet", usage);
    if (kind.networks && !kind.networks.includes(given.network)) {
      return usageError(`--network must be one of: ${kind.networks.join(", ")}`, usage);
    }
  }

  const version = values.version ?? "0.1.0";
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    return usageError("--version must be x.y.z (bump it when the skills change, so installs update)", usage);
  }

  // The MCP server's name comes from the kind. For oracles: `ixo-<the host's first label, minus
  // "-oracle">` — the same name the IXO Decision Console shows for that oracle
  // (e.g. shipment-delivery-oracle.… → ixo-shipment-delivery).
  // A kind with a fixed serverName (e.g. local kinds) has no host to take a label from.
  // {{NAME}} gives one plugin per network its own server name (ixo-memory-devnet, ixo-memory…),
  // so two networks of the same kind can be installed side by side.
  const serverVars: Record<string, string> = { NAME: name };
  if (mcpUrl) {
    let hostLabel = mcpUrl.hostname.split(".")[0];
    if (kind.hostLabelStripSuffix && hostLabel.endsWith(kind.hostLabelStripSuffix)) {
      hostLabel = hostLabel.slice(0, -kind.hostLabelStripSuffix.length);
    }
    serverVars.HOST_LABEL = hostLabel;
  }
  // A skills-only kind has no server: {{SERVER}} is then the plugin's name.
  const server = optional.server ?? (kind.serverName
    ? render(kind.serverName, serverVars, `template/${kind.name}/kind.json serverName`)
    : name);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(server)) {
    throw new Error(`MCP server name "${server}" (from template/${kind.name}/kind.json) must be kebab-case`);
  }

  // Placeholders available to the templates: the flags this kind takes, plus the title and server.
  const flagVars = Object.fromEntries(Object.entries(given).map(([k, v]) => [k.toUpperCase(), v as string]));
  // A re-run keeps what is already published unless told otherwise.
  const description =
    values.description ??
    listed?.description ??
    render(kind.description, { NAME: name, TITLE: title, SERVER: server, ...flagVars }, `template/${kind.name}/kind.json description`);
  // Play-money plugins hand people only to other play-money plugins ({{#TESTNET}}).
  const testnet = given.network === "testnet" || /(^|\.)test(net)?\./.test(mcpUrl?.host ?? "");
  const vars = { NAME: name, TITLE: title, SERVER: server, DESCRIPTION: description, PINNED: optional.pinned ?? "", TESTNET: testnet ? "true" : "", ...flagVars };

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
  // Hooks are copied verbatim: hook commands and their scripts are not text templates.
  const hooks = join(kind.skillsDir, "..", "hooks");
  if (existsSync(hooks)) cpSync(hooks, join(out, "hooks"), { recursive: true });

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
  const mcpWhere = `template/${kind.name}/kind.json mcp`;
  if (kind.mcp) write(join(out, ".mcp.json"), { mcpServers: { [server]: renderDeep(optional.pinned ? kind.mcp.codex : kind.mcp.claude, vars, mcpWhere) } });
  write(join(out, "plugin.json"), {
    $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
    ...meta,
  });
  if (kind.mcp) {
    write(join(out, "mcp.json"), {
      $schema: "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
      mcpServers: { [server]: renderDeep(kind.mcp.codex, vars, mcpWhere) },
    });
  }
  write(join(out, "README.md"), render(kind.readme, vars, `template/${kind.name}/README.md`));

  // Both catalogs: Claude Code's, and Codex's native one (Codex also reads Claude Code's).
  const { url: _url, ...rest } = given;
  const recorded = { ...rest, ...optional };
  const catalog =(path: string, base: Record<string, unknown>, extra: Record<string, unknown> = {}) => {
    const doc: { plugins: Entry[] } & Record<string, unknown> = readJson(path) ?? { ...base, plugins: [] };
    const previous = doc.plugins.find((p) => p.name === name);
    const entry: Entry = {
      name,
      source: `./plugins/${name}`,
      description,
      // Keep any other metadata someone added by hand; the kind is ours.
      // `kind` + the flags that cannot be read back from the plugin (not --url: regenerate.ts reads
      // it from .mcp.json): scripts/regenerate.ts rebuilds the plugin from these.
      metadata: { ...previous?.metadata, kind: kind.name, ...recorded },
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
      description: "IXO's plugins for AI assistants: signed decisions on claims, your IXO memory, and asks.world.",
    },
  });
  catalog(
    codexCatalog,
    { name: "ixo-plugins", interface: { displayName: "IXO" } },
    { policy: kind.codex.policy, category: kind.codex.category },
  );

  const target = !kind.mcp ? "skills only" : `${given.url ?? `${given.package}@${given.major}${given.network ? ` (${given.network})` : ""}`} (server "${server}")`;
  console.log(`✓ plugins/${name} (${kind.name}) → ${target}`);
}

if (import.meta.main) main(process.argv.slice(2));
