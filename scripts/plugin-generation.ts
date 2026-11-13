import {
  existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, relative } from "node:path";

export const root = join(import.meta.dir, "..");
const PARAMS = ["url", "package", "major", "network"] as const;
type Param = (typeof PARAMS)[number];
type McpEntry = Record<string, unknown>;

export type PluginSpec = {
  name: string;
  kind: string;
  title: string;
  version: string;
  description: string;
  url?: string;
  package?: string;
  major?: string;
  network?: string;
  server?: string;
  pinned?: boolean;
};

export type SpecDocument = {
  renames: Record<string, string | null>;
  plugins: PluginSpec[];
};

export type Kind = {
  name: string;
  description: string;
  keywords: string[];
  serverName?: string;
  hostLabelStripSuffix?: string;
  urlPath: string;
  networks?: string[];
  mcp: { claude: McpEntry; codex: McpEntry } | null;
  codex: { policy: { installation: string; authentication: string }; category: string };
  codexInterface: Record<string, unknown> | null;
  /** Extra .claude-plugin/plugin.json fields the Claude plugin directory lists (supportUrl, privacyPolicyUrl,
   * termsOfServiceUrl, license). Claude-only: the portable plugin.json schema allows no extra keys. */
  listing: Record<string, string>;
  needs: Param[];
  readme: string;
  skillsDir: string;
};

const DEFAULT_MCP = {
  claude: { type: "http", url: "{{URL}}" },
  codex: { type: "streamable-http", url: "{{URL}}" },
};
const DEFAULT_CODEX = { policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" }, category: "Productivity" };
const INSTALLATION = ["NOT_AVAILABLE", "AVAILABLE", "INSTALLED_BY_DEFAULT"];
const AUTHENTICATION = ["ON_INSTALL", "ON_USE"];
const SECRETISH = /key|secret|token|password|mnemonic|credential/i;
const SPEC_KEYS = new Set(["name", "kind", "title", "version", "description", ...PARAMS, "server", "pinned"]);
const START = "<!-- plugins:start -->";
const END = "<!-- plugins:end -->";

const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;
const object = (value: unknown, where: string): Record<string, unknown> => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${where} must be an object`);
  return value as Record<string, unknown>;
};
const string = (value: unknown, where: string): string => {
  if (typeof value !== "string" || !value) throw new Error(`${where} must be a non-empty string`);
  return value;
};

export const listKinds = (): string[] =>
  readdirSync(join(root, "template"))
    .filter((name) => existsSync(join(root, "template", name, "kind.json")))
    .sort();

export const loadKind = (name: string): Kind => {
  const dir = join(root, "template", name);
  const file = join(dir, "kind.json");
  const raw = object(JSON.parse(readFileSync(file, "utf8")), file);
  const field = (key: string, optional = false): string | undefined =>
    raw[key] === undefined && optional ? undefined : string(raw[key], `${file}: ${key}`);
  const keywords = raw.keywords;
  if (!Array.isArray(keywords) || !keywords.every((word) => typeof word === "string" && word)) {
    throw new Error(`${file}: keywords must be an array of non-empty strings`);
  }
  const readmePath = join(dir, "README.md");
  const skillsDir = join(dir, "skills");
  if (!existsSync(readmePath) || !existsSync(skillsDir) || !statSync(skillsDir).isDirectory()) {
    throw new Error(`${dir} needs README.md and skills/`);
  }
  const readme = readFileSync(readmePath, "utf8");
  if (readme.split("\n")[0] !== "# {{TITLE}}") throw new Error(`${readmePath} must start with # {{TITLE}}`);

  const mcpRaw = raw.mcp === undefined ? DEFAULT_MCP : raw.mcp;
  let mcp: Kind["mcp"] = null;
  if (mcpRaw !== null) {
    const entries = object(mcpRaw, `${file}: mcp`);
    mcp = {
      claude: object(entries.claude, `${file}: mcp.claude`),
      codex: object(entries.codex, `${file}: mcp.codex`),
    };
    const checkEntry = (entry: McpEntry, where: string, types: string[]) => {
      if (!types.includes(String(entry.type))) throw new Error(`${file}: ${where}.type must be one of ${types.join(", ")}`);
      if (entry.type === "stdio") {
        string(entry.command, `${file}: ${where}.command`);
        if (entry.args !== undefined && !(Array.isArray(entry.args) && entry.args.every((arg) => typeof arg === "string"))) {
          throw new Error(`${file}: ${where}.args must be an array of strings`);
        }
        const env = entry.env === undefined ? {} : object(entry.env, `${file}: ${where}.env`);
        for (const [key, value] of Object.entries(env)) {
          if (typeof value !== "string") throw new Error(`${file}: ${where}.env.${key} must be a string`);
          if (SECRETISH.test(key) && !/^\$\{[A-Za-z_][A-Za-z0-9_]*(:-[^}]*)?\}$/.test(value)) {
            throw new Error(`${file}: ${where}.env.${key} looks like a secret: use a \${VAR} reference`);
          }
        }
      } else string(entry.url, `${file}: ${where}.url`);
    };
    checkEntry(mcp.claude, "mcp.claude", ["stdio", "http", "sse"]);
    checkEntry(mcp.codex, "mcp.codex", ["stdio", "streamable-http", "sse"]);
  }
  const used = new Set([...JSON.stringify(mcp ?? []).matchAll(/\{\{([A-Z_]+)\}\}/g)].map((match) => match[1].toLowerCase()));
  for (const key of used) if (!(PARAMS as readonly string[]).includes(key)) throw new Error(`${file}: unknown MCP placeholder {{${key.toUpperCase()}}}`);

  const codexRaw = raw.codex === undefined ? DEFAULT_CODEX : object(raw.codex, `${file}: codex`);
  const policy = object(codexRaw.policy, `${file}: codex.policy`);
  if (!INSTALLATION.includes(String(policy.installation)) || !AUTHENTICATION.includes(String(policy.authentication))) {
    throw new Error(`${file}: invalid Codex policy`);
  }
  const networks = raw.networks;
  if (networks !== undefined && !(Array.isArray(networks) && networks.every((n) => typeof n === "string" && n))) {
    throw new Error(`${file}: networks must be an array of non-empty strings`);
  }
  const urlPath = raw.urlPath === undefined ? "/v1/mcp" : string(raw.urlPath, `${file}: urlPath`);
  if (!urlPath.startsWith("/")) throw new Error(`${file}: urlPath must start with /`);
  return {
    name, description: field("description")!, keywords, serverName: field("serverName", mcp === null),
    hostLabelStripSuffix: field("hostLabelStripSuffix", true), urlPath, networks: networks as string[] | undefined,
    mcp, codex: { policy: { installation: String(policy.installation), authentication: String(policy.authentication) }, category: string(codexRaw.category, `${file}: codex.category`) },
    codexInterface: codexRaw.interface === undefined ? null : object(codexRaw.interface, `${file}: codex.interface`),
    listing: Object.fromEntries(Object.entries(raw.listing === undefined ? {} : object(raw.listing, `${file}: listing`)).map(([key, value]) => [key, string(value, `${file}: listing.${key}`)])),
    needs: PARAMS.filter((param) => used.has(param)), readme, skillsDir,
  };
};

export const loadSpecs = (): SpecDocument => {
  const file = join(root, "plugin-specs.json");
  const raw = object(JSON.parse(readFileSync(file, "utf8")), file);
  const renames = object(raw.renames, `${file}: renames`);
  for (const [name, target] of Object.entries(renames)) {
    if (target !== null && typeof target !== "string") throw new Error(`${file}: renames.${name} must be a string or null`);
  }
  if (!Array.isArray(raw.plugins)) throw new Error(`${file}: plugins must be an array`);
  return { renames: renames as Record<string, string | null>, plugins: raw.plugins as PluginSpec[] };
};

export const serializeSpecs = (specs: SpecDocument): string => json(specs);

/** Parse the small template language before any output is published. Sections cannot nest. */
export const render = (input: string, vars: Record<string, string>, where: string): string => {
  const token = /\{\{([^{}]*)\}\}/g;
  let result = "";
  let cursor = 0;
  let section: { flag: string; keep: boolean } | null = null;
  for (const match of input.matchAll(token)) {
    const index = match.index ?? 0;
    const literal = input.slice(cursor, index);
    if (literal.includes("{{") || literal.includes("}}")) throw new Error(`${where}: malformed template marker`);
    if (!section || section.keep) result += literal;
    const directive = match[1];
    if (/^[#^]/.test(directive)) {
      const flag = directive.slice(1);
      if (!(["PINNED", "TESTNET"].includes(flag))) throw new Error(`${where}: unknown section ${match[0]}`);
      if (section) throw new Error(`${where}: nested sections are not supported`);
      section = { flag, keep: (directive[0] === "#") === Boolean(vars[flag]) };
    } else if (directive.startsWith("/")) {
      if (!section || section.flag !== directive.slice(1)) throw new Error(`${where}: unmatched section ${match[0]}`);
      section = null;
    } else {
      if (!/^[A-Z_]+$/.test(directive) || !(directive in vars)) throw new Error(`${where}: unknown placeholder ${match[0]}`);
      if (!section || section.keep) result += vars[directive];
    }
    cursor = index + match[0].length;
  }
  const tail = input.slice(cursor);
  if (tail.includes("{{") || tail.includes("}}")) throw new Error(`${where}: malformed template marker`);
  if (section) throw new Error(`${where}: unclosed section {{#${section.flag}}}`);
  return result + tail;
};

const renderDeep = (value: unknown, vars: Record<string, string>, where: string): unknown => {
  if (typeof value === "string") return render(value, vars, where);
  if (Array.isArray(value)) return value.map((item) => renderDeep(item, vars, where));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, renderDeep(item, vars, where)]));
  }
  return value;
};

const validateSpec = (spec: PluginSpec): { kind: Kind; vars: Record<string, string>; server: string } => {
  const label = `plugin-specs.json: ${spec.name ?? "<unnamed>"}`;
  for (const key of Object.keys(object(spec, label))) if (!SPEC_KEYS.has(key)) throw new Error(`${label}: unknown field ${key}`);
  const name = string(spec.name, `${label}.name`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) throw new Error(`${label}: name must be kebab-case, at most 64 characters`);
  const kind = loadKind(string(spec.kind, `${label}.kind`));
  if (/[:#"\n\r]/.test(string(spec.title, `${label}.title`)) || spec.title.length > 80) throw new Error(`${label}: title must be plain text, at most 80 characters`);
  if (!/^\d+\.\d+\.\d+$/.test(string(spec.version, `${label}.version`))) throw new Error(`${label}: version must be x.y.z`);
  string(spec.description, `${label}.description`);
  for (const param of PARAMS) {
    const value = spec[param];
    if (kind.needs.includes(param)) string(value, `${label}.${param}`);
    else if (value !== undefined) throw new Error(`${label}: kind ${kind.name} does not take ${param}`);
  }
  let mcpUrl: URL | undefined;
  if (spec.url) {
    mcpUrl = new URL(spec.url);
    if (mcpUrl.protocol !== "https:" || mcpUrl.pathname !== kind.urlPath || mcpUrl.search || mcpUrl.hash || mcpUrl.username || mcpUrl.password) {
      throw new Error(`${label}: url must be an HTTPS endpoint ending in ${kind.urlPath}, without credentials or query`);
    }
  }
  if (spec.package && !/^(@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(spec.package)) throw new Error(`${label}: invalid npm package`);
  if (spec.major && !/^(0|[1-9]\d*|[a-z][a-z0-9-]*)$/.test(spec.major)) throw new Error(`${label}: invalid major version or dist-tag`);
  if (spec.network && (!/^[a-z][a-z0-9-]*$/.test(spec.network) || (kind.networks && !kind.networks.includes(spec.network)))) {
    throw new Error(`${label}: invalid network`);
  }
  if (spec.server && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(spec.server)) throw new Error(`${label}: server must be kebab-case`);
  if (spec.pinned !== undefined && (spec.pinned !== true || !kind.mcp)) throw new Error(`${label}: pinned is only valid as true for an MCP kind`);
  const hostLabel = mcpUrl?.hostname.split(".")[0] ?? "";
  const strip = kind.hostLabelStripSuffix;
  const serverVars = { NAME: name, HOST_LABEL: strip && hostLabel.endsWith(strip) ? hostLabel.slice(0, -strip.length) : hostLabel };
  const server = spec.server ?? (kind.serverName ? render(kind.serverName, serverVars, `${label}: serverName`) : name);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(server)) throw new Error(`${label}: rendered server must be kebab-case`);
  const flags = Object.fromEntries(PARAMS.filter((param) => spec[param] !== undefined).map((param) => [param.toUpperCase(), spec[param] as string]));
  const testnet = spec.network === "testnet" || /(^|\.)test(net)?\./.test(mcpUrl?.host ?? "");
  const vars = { NAME: name, TITLE: spec.title, SERVER: server, DESCRIPTION: spec.description, PINNED: spec.pinned ? "true" : "", TESTNET: testnet ? "true" : "", ...flags };
  return { kind, vars, server };
};

/** A complete, side-effect-free snapshot of every generated file. */
export const renderAll = (specs: SpecDocument): Map<string, Buffer> => {
  const outputs = new Map<string, Buffer>();
  const add = (path: string, value: string | Buffer | object) => {
    outputs.set(path, Buffer.isBuffer(value) ? value : Buffer.from(typeof value === "string" ? value : json(value)));
  };
  const seen = new Set<string>();
  const claudeEntries: object[] = [];
  const codexEntries: object[] = [];
  for (const spec of [...specs.plugins].sort((a, b) => a.name.localeCompare(b.name))) {
    if (seen.has(spec.name)) throw new Error(`plugin-specs.json: duplicate plugin ${spec.name}`);
    seen.add(spec.name);
    const { kind, vars, server } = validateSpec(spec);
    const base = `plugins/${spec.name}`;
    const write = (path: string, value: string | Buffer | object) => add(`${base}/${path}`, value);
    const copy = (from: string, to: string, templated: boolean) => {
      for (const entry of readdirSync(from)) {
        const src = join(from, entry);
        const dst = `${to}/${entry}`;
        if (statSync(src).isDirectory()) copy(src, dst, templated);
        else write(dst, templated ? render(readFileSync(src, "utf8"), vars, src) : readFileSync(src));
      }
    };
    copy(kind.skillsDir, "skills", true);
    for (const dir of ["hooks", "assets"]) {
      const path = join(root, "template", kind.name, dir);
      if (existsSync(path)) copy(path, dir, false);
    }
    const meta = {
      name: spec.name, version: spec.version, description: spec.description,
      author: { name: "IXO", url: "https://ixo.world" },
      homepage: `https://github.com/ixoworld/ixo-plugins/tree/main/plugins/${spec.name}`,
      repository: "https://github.com/ixoworld/ixo-plugins", keywords: kind.keywords,
    };
    write(".claude-plugin/plugin.json", { ...meta, ...kind.listing });
    const mcpWhere = `template/${kind.name}/kind.json mcp`;
    if (kind.mcp) write(".mcp.json", { mcpServers: { [server]: renderDeep(spec.pinned ? kind.mcp.codex : kind.mcp.claude, vars, mcpWhere) } });
    write("plugin.json", {
      $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json", ...meta,
      ...(kind.codexInterface ? { extensions: { "com.openai": { interface: renderDeep(kind.codexInterface, vars, `template/${kind.name}/kind.json codex.interface`) } } } : {}),
    });
    if (kind.mcp) write("mcp.json", {
      $schema: "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
      mcpServers: { [server]: renderDeep(kind.mcp.codex, vars, mcpWhere) },
    });
    write("README.md", render(kind.readme, vars, `template/${kind.name}/README.md`));
    const metadata = {
      kind: kind.name,
      ...Object.fromEntries(["package", "major", "network", "server"].filter((key) => spec[key as keyof PluginSpec] !== undefined).map((key) => [key, spec[key as keyof PluginSpec]])),
      ...(spec.pinned ? { pinned: "true" } : {}),
    };
    const entry = { name: spec.name, source: `./plugins/${spec.name}`, description: spec.description, metadata };
    claudeEntries.push(entry);
    codexEntries.push({ ...entry, policy: kind.codex.policy, category: kind.codex.category });
  }
  add(".claude-plugin/marketplace.json", {
    name: "ixo-plugins", owner: { name: "IXO", url: "https://ixo.world" },
    metadata: { description: "IXO's plugins for AI assistants: signed decisions on claims, your IXO memory, and asks.world." },
    plugins: claudeEntries, renames: specs.renames,
  });
  add(".agents/plugins/marketplace.json", { name: "ixo-plugins", interface: { displayName: "IXO" }, plugins: codexEntries });
  const readmePath = join(root, "README.md");
  const readme = readFileSync(readmePath, "utf8");
  const start = readme.indexOf(START);
  const end = readme.indexOf(END);
  if (start < 0 || end < start) throw new Error(`README.md needs ${START} and ${END}`);
  const cell = (value: string) => value.replace(/\|/g, "\\|").replace(/\n/g, " ");
  const rows = ["| Plugin | Kind | Runs | What it does |", "| --- | --- | --- | --- |"];
  for (const spec of [...specs.plugins].sort((a, b) => a.name.localeCompare(b.name))) {
    const runs = spec.url ? `hosted, ${new URL(spec.url).host}`
      : spec.package ? `local, \`npx ${spec.package}@${spec.major}\`${spec.network ? ` (${spec.network})` : ""}`
      : loadKind(spec.kind).mcp ? "" : "skills only";
    rows.push(`| [\`${spec.name}\`](plugins/${spec.name}/README.md) | ${cell(spec.kind)} | ${cell(runs)} | ${cell(spec.description)} |`);
  }
  add("README.md", `${readme.slice(0, start + START.length)}\n${rows.join("\n")}\n${readme.slice(end)}`);
  return outputs;
};

const walkFiles = (dir: string): string[] => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walkFiles(path) : [relative(root, path)];
  });
};

export const compareGenerated = (expected: Map<string, Buffer>): string[] => {
  const differences: string[] = [];
  const actual = new Set([...walkFiles(join(root, "plugins")), ".claude-plugin/marketplace.json", ".agents/plugins/marketplace.json", "README.md"]);
  for (const [path, bytes] of expected) {
    const file = join(root, path);
    if (!existsSync(file)) differences.push(`missing ${path}`);
    else if (!readFileSync(file).equals(bytes)) differences.push(`changed ${path}`);
    actual.delete(path);
  }
  for (const path of actual) if (existsSync(join(root, path))) differences.push(`extra ${path}`);
  return differences.sort();
};

/** Stage the complete snapshot, then swap targets with rollback on a publish error. */
export const publishGenerated = (outputs: Map<string, Buffer>): void => {
  // A full plugins/ swap may prune old generated files, but never remove a person's untracked file.
  if (existsSync(join(root, ".git"))) {
    const tracked = spawnSync("git", ["-C", root, "ls-files", "-z", "--", "plugins/"], { encoding: "utf8" });
    if (tracked.status !== 0) throw new Error(`Cannot list tracked plugins: ${tracked.stderr}`);
    const known = new Set(tracked.stdout.split("\0").filter(Boolean));
    const unrelated = walkFiles(join(root, "plugins")).filter((path) => !outputs.has(path) && !known.has(path));
    if (unrelated.length) throw new Error(`Untracked files would be removed from plugins/: ${unrelated.join(", ")}`);
  }
  const stage = mkdtempSync(join(root, ".plugin-stage-"));
  const backup = mkdtempSync(join(root, ".plugin-backup-"));
  const targets = ["plugins", ".claude-plugin/marketplace.json", ".agents/plugins/marketplace.json", "README.md"];
  if (outputs.has("plugin-specs.json")) targets.push("plugin-specs.json");
  const moved: Array<{ path: string; hadOld: boolean; installed: boolean }> = [];
  let preserveBackup = false;
  try {
    for (const [path, bytes] of outputs) {
      const file = join(stage, path);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, bytes);
    }
    for (const path of targets) {
      const destination = join(root, path);
      const saved = join(backup, path);
      const hadOld = existsSync(destination);
      if (hadOld) {
        mkdirSync(dirname(saved), { recursive: true });
        renameSync(destination, saved);
      }
      const move = { path, hadOld, installed: false };
      moved.push(move);
      mkdirSync(dirname(destination), { recursive: true });
      renameSync(join(stage, path), destination);
      move.installed = true;
    }
  } catch (error) {
    let rollbackError: unknown;
    for (const { path, hadOld, installed } of moved.reverse()) {
      try {
        if (installed) rmSync(join(root, path), { recursive: true, force: true });
        if (hadOld) renameSync(join(backup, path), join(root, path));
      } catch (failure) {
        rollbackError ??= failure;
      }
    }
    if (rollbackError) {
      preserveBackup = true;
      throw new Error(`Publish failed and rollback was incomplete. Previous files remain in ${backup}. Original error: ${error}; rollback error: ${rollbackError}`);
    }
    throw error;
  } finally {
    rmSync(stage, { recursive: true, force: true });
    if (!preserveBackup) rmSync(backup, { recursive: true, force: true });
  }
};
