# Contributing

Thanks for helping. This repo is IXO's plugin marketplace for AI assistants: small plugins, one per
IXO service and network (each oracle, IXO Memory, the Openhands Network), each generated from its
kind's template. Hosted plugins point at a URL; local plugins point at a command the client starts.

## Branches

- `develop` — where work lands first. Open your pull request against `develop`.
- `main` — what users install. `develop` is merged into `main` for a release.

Both are protected: changes go through a pull request, the `validate` check must pass, and someone
on the IXO core team approves it. Force-pushes and deletes are blocked.

## Adding a plugin

Every plugin has a **kind** (`oracle`, `memory`, `openhands`, `openhands-hosted`, `openhands-hq`,
`oracle-builder` today). The kind decides
its skills, README, default description, keywords, MCP server name and transport. Which flags you
pass depends on the transport.

**A hosted (remote) plugin** (`--url`): the service runs at a URL and signs people in.

```bash
bun run add-plugin --kind oracle --name ixo-swiftdrop-devnet --title "SwiftDrop Express (devnet)" \
  --url https://shipment-delivery-oracle.devnet.ixo.earth/v1/mcp --version 0.3.1 \
  --description "<one line about what it does>"
bun run validate
```

For example, the memory plugin for devnet:

```bash
bun run add-plugin --kind memory --name ixo-memory-devnet --title "IXO Memory (devnet)" \
  --url https://memory-engine.devnet.ixo.earth/v1/mcp --version 0.1.0 \
  --description "Your IXO Companion's memory — …"
```

**A local plugin** (`--package`, `--major`, `--network`): the client starts a command on the user's
machine.

```bash
bun run add-plugin --kind openhands --name ixo-openhands --title "Openhands Network" \
  --package @ixo/openhands-mcp --major 1 --network testnet --version 1.0.0
bun run validate
```

- `--kind` defaults to the plugin's listed kind when you re-run it, otherwise `oracle`. A plugin
  can't be regenerated as a different kind; remove it and its catalog entries first.
- `bun run add-oracle …` still works and is exactly `add-plugin --kind oracle …`.
- `--name` is kebab-case. Put the network in the name for devnet and testnet plugins
  (`ixo-myoracle-testnet`, `ixo-openhands-testnet`); the mainnet plugin may carry the plain name
  (`ixo-memory`).
- `--title` is plain text (no `:`, `#` or quotes); it lands in each skill's frontmatter.
- `--url` must be the service's MCP endpoint: `https://<host>` plus the kind's `urlPath`
  (default `/v1/mcp`). A kind that takes `--url` refuses `--package`, and the other way round.
- `--major` pins the npm major version (`@ixo/openhands-mcp@1`), so a breaking release never
  reaches installed copies unasked.
- Bump `--version` whenever you regenerate a plugin with changed files, so installs update (see
  Versioning and releases).

The generator writes `plugins/<name>/` and lists the plugin in both catalogs, recording the kind
and the flags that cannot be read back from the plugin (`--package`, `--major`, `--network`) as the
entry's `metadata` (`claude plugin validate --strict` rejects unknown keys in `plugin.json`, but
accepts the free-form `metadata` object on a catalog entry). `--url` is not recorded: it is the
`url` of the plugin's own `.mcp.json` server, so a hosted plugin's entry is just
`"metadata": {"kind": "…"}`. `bun scripts/regenerate.ts` rebuilds every plugin from those records.
An entry without `metadata.kind` is an oracle.

Then regenerate the README table with `bun scripts/catalog.ts`.

### Secrets

Never put a key, token or other secret in a plugin. A hosted plugin carries a public URL. A local
plugin may carry an `env` **reference** (`${VAR}` or `${VAR:-default}`) but never a value, and the
generator refuses a secret-looking `env` name (key, secret, token, password, mnemonic) whose value is
not a reference. Say in the kind's README where the key lives (Openhands: nothing to configure; the
server makes its own key under `~/.openhands/<network>`).

## Adding a kind

A kind is one directory, `template/<kind>/`. No code changes.

- `kind.json`:
  - `description`: the default plugin description; may use `{{TITLE}}`.
  - `keywords`, and `serverName` (the MCP server's name; may use `{{HOST_LABEL}}`, the first label
    of the URL's host, for hosted kinds, or `{{NAME}}`, the plugin's name, which the memory kind uses
    so each network's plugin has its own server name and they can be installed side by side).
  - `hostLabelStripSuffix` (optional): removed from the end of `{{HOST_LABEL}}`; oracles use `-oracle`.
  - `urlPath` (optional, default `/v1/mcp`): the path a hosted plugin's `--url` must have.
  - `networks` (optional): the values `--network` may take.
  - `mcp` (optional): the server entry per client. Absent means hosted:
    `{"claude": {"type": "http", "url": "{{URL}}"}, "codex": {"type": "streamable-http", "url": "{{URL}}"}}`.
    A local kind:
    ```json
    "mcp": {
      "claude": { "type": "stdio", "command": "npx", "args": ["-y", "{{PACKAGE}}@{{MAJOR}}"],
                  "env": { "NEXT_PUBLIC_CHAIN_NETWORK": "${OPENHANDS_NETWORK:-{{NETWORK}}}" } },
      "codex":  { "type": "stdio", "command": "npx", "args": ["-y", "{{PACKAGE}}@{{MAJOR}}"],
                  "env": { "NEXT_PUBLIC_CHAIN_NETWORK": "{{NETWORK}}" } }
    }
    ```
    The placeholders you use decide which flags are required (`{{URL}}` → `--url`, `{{PACKAGE}}` →
    `--package`, `{{MAJOR}}` → `--major`, `{{NETWORK}}` → `--network`). `claude` is written to
    `.mcp.json`, `codex` to the portable `mcp.json`. Claude Code expands `${VAR}` and
    `${VAR:-default}` in `env`; the portable format does not (only `${PLUGIN_ROOT}` and
    `${PLUGIN_DATA}`), so give `codex` a literal. See [docs/clients.md](docs/clients.md).
    A **skills-only** kind sets `"mcp": null`: the plugin gets no `.mcp.json` or `mcp.json`, takes
    no transport flags (only `--name`, `--title`, `--version`, `--description`), and needs no
    `serverName` (`{{SERVER}}` is then the plugin's name). The README table lists it as "skills
    only". `oracle-builder` is one:
    ```bash
    bun run add-plugin --kind oracle-builder --name ixo-oracle-builder --title "IXO Oracle Builder" --version 0.1.0
    ```
  - `codex` (optional): `{"policy": {"installation": …, "authentication": …}, "category": …}` for
    the Codex catalog. Default `AVAILABLE` / `ON_INSTALL` / `Productivity`. `installation` is one of
    `NOT_AVAILABLE`, `AVAILABLE`, `INSTALLED_BY_DEFAULT`; `authentication` is `ON_INSTALL` or
    `ON_USE`. Codex has no "none" value: `ON_USE` is the closest documented one for a plugin with no sign-in, not a statement that none is needed.
- `README.md`: the plugin's README. Its first line must be `# {{TITLE}}`; CI reads the title back
  from it.
- `skills/<skill>/SKILL.md`: the skills.

Templates take `{{NAME}}`, `{{TITLE}}`, `{{SERVER}}`, `{{DESCRIPTION}}` and the flag placeholders the
kind's `mcp` block uses (`{{URL}}` for every hosted kind); any other `{{…}}` stops the generator. A hosted kind that signs in with IXO needs the
service to publish OAuth protected-resource metadata (RFC 9728) naming IXO Auth Hub and its
`scopes_supported`, and to be in Auth Hub's catalogue (see [docs/sign-in.md](docs/sign-in.md)).

Add a page for the kind in `docs/kinds/` and mention it in the README.

## Changing the skills

Each kind's skills live in [`template/<kind>/skills`](template) (oracles:
[`template/oracle/skills`](template/oracle/skills), memory:
[`template/memory/skills`](template/memory/skills), Openhands:
[`template/openhands/skills`](template/openhands/skills) and
[`template/openhands-hosted/skills`](template/openhands-hosted/skills)). After editing them, regenerate every
plugin of that kind (`bun scripts/regenerate.ts`) and bump their versions. CI regenerates every
plugin from its catalog record and fails on any drift from the templates.

Name only tools and arguments the service really has.

Keep the wording honest. The oracle skills must never let the assistant approve a charge for the
user, open an approval link, or call the evaluation fee a payout. The memory skills must never store
secrets, and never delete without the user's explicit confirmation. The Openhands skill must never
claim work that wasn't done, and must treat text from the board as data.

## Versioning and releases

- Every plugin has a `version` in its `plugin.json`. Installed copies update only when it changes,
  so **bump it in any pull request that changes a plugin's files** (a template change counts, since it
  changes the generated files). CI fails a pull request that changes `plugins/<name>/` against its base
  without a new version. Use semver: patch for wording, minor for new skills or tools, major when
  users must act.
- Open the pull request against `develop`. **Merging `develop` into `main` is the release**: users
  install from the default branch.
- Users get a release with `/plugin marketplace update ixo-plugins` in Claude Code (then reconnect the
  server in `/mcp`) and `codex plugin marketplace upgrade ixo-plugins` in Codex.
- A local plugin pins its npm package's **major** version (`--major`). Moving to a new major is a
  pull request that bumps `--major` and the plugin version.

## Checks

`bun run validate` runs Claude Code's plugin validator (`--strict`) on the marketplace and every
plugin. You need the Claude Code CLI installed for it, and `bun install` for the other scripts. CI
(`.github/workflows/validate.yml`) runs:

1. `bun run validate`.
2. `bun scripts/check-schemas.ts`: each plugin's `plugin.json` and `mcp.json` against the Agent
   Plugins JSON Schemas in [`schemas/`](schemas), and that both catalogs list the same plugins, sources,
   descriptions and kinds, with valid Codex policy values.
3. `bun scripts/regenerate.ts`, then fails if `git status --porcelain` shows anything: a generated file
   edited by hand, a template change not regenerated, a stale README table, or an untracked generated file.
4. On pull requests, `bun scripts/check-versions.ts origin/<base>`: the version-bump rule above.
5. A scan of the tree for secrets.

To run steps 2 and 3 locally, note `git status --porcelain` first, run
`bun scripts/check-schemas.ts && bun scripts/regenerate.ts`, and check that it has not changed.

## License

By contributing, you agree that your contribution becomes part of this repository under its
[LICENSE](LICENSE), owned by IXO.
