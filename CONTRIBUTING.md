# Contributing

Thanks for helping. This repo is IXO's plugin marketplace for AI assistants — small plugins, one per
IXO service (each oracle, and IXO Memory per network), each built from its kind's template.

## Branches

- `develop` — where work lands first. Open your pull request against `develop`.
- `main` — what users install. `develop` is merged into `main` for a release.

Both are protected: changes go through a pull request, the `validate` check must pass, and someone
on the IXO core team approves it. Force-pushes and deletes are blocked.

## Adding a plugin

Every plugin has a **kind**: `oracle` or `memory` today. The kind decides its skills, README, default
description, keywords and MCP server name.

```bash
bun run add-plugin --kind <oracle|memory> --name <plugin-name> --title "<Title>" \
  --url https://<host>/v1/mcp --description "<one line about what it does>"
bun run validate
```

For example, the memory plugin:

```bash
bun run add-plugin --kind memory --name ixo-memory-devnet --title "IXO Memory (devnet)" \
  --url https://memory-engine.devnet.ixo.earth/v1/mcp --version 0.1.0 \
  --description "Your IXO Companion's memory — …"
```

- `--kind` defaults to the plugin's listed kind when you re-run it, otherwise `oracle`. A plugin
  can't be regenerated as a different kind; remove it and its catalog entries first.
- `bun run add-oracle …` still works and is exactly `add-plugin --kind oracle …`.
- `--name` is kebab-case. Put the network in the name for devnet and testnet plugins
  (`ixo-myoracle-testnet`); the mainnet plugin may carry the plain name (`ixo-memory`).
- `--title` is plain text (no `:`, `#` or quotes); it lands in each skill's frontmatter.
- `--url` must be the service's MCP endpoint (`https://…/v1/mcp`) and the service must use IXO
  sign-in.
- Bump `--version` whenever you regenerate a plugin with changed skills, so installs update.

The generator writes `plugins/<name>/` and lists the plugin in both catalogs, recording its kind as
the entry's `metadata.kind` (`claude plugin validate --strict` rejects unknown keys in
`plugin.json`, but accepts the free-form `metadata` object on a catalog entry). An entry without
`metadata.kind` is an oracle.

Never put a key, token or other secret in a plugin. A plugin only ever carries a public URL.

## Adding a kind

A kind is one directory, `template/<kind>/` — no code changes:

- `kind.json`: `description` (the default plugin description; may use `{{TITLE}}`), `keywords`,
  `serverName` (the MCP server's name; may use `{{HOST_LABEL}}`, the first label of the URL's host,
  or `{{NAME}}`, the plugin's name, which the memory kind uses so each network's plugin has its own
  server name) and, optionally, `hostLabelStripSuffix` (removed from the end of `{{HOST_LABEL}}`; oracles use
  `-oracle`).
- `README.md`: the plugin's README. Its first line must be `# {{TITLE}}` — CI reads the title back
  from it.
- `skills/<skill>/SKILL.md`: the skills.

Templates take `{{TITLE}}`, `{{URL}}`, `{{SERVER}}` and `{{DESCRIPTION}}`; any other `{{…}}` stops
the generator. The service behind a new kind must publish OAuth protected-resource metadata
(RFC 9728) naming IXO Auth Hub and its `scopes_supported`, and be in Auth Hub's catalogue.

## Changing the skills

Each kind's skills live in [`template/<kind>/skills`](template) (oracles:
[`template/oracle/skills`](template/oracle/skills), memory:
[`template/memory/skills`](template/memory/skills)). After editing them, regenerate every plugin of
that kind and bump their versions. CI regenerates every plugin with its recorded kind and fails on
any drift from the templates.

Name only tools and arguments the service really has.

Keep the wording honest. The oracle skills must never let the assistant approve a charge for the
user, open an approval link, or call the evaluation fee a payout. The memory skills must never store
secrets, and never delete without the user's explicit confirmation.

## Checks

`bun run validate` runs Claude Code's plugin validator (`--strict`) on the marketplace and every
plugin. You need the Claude Code CLI installed for it. CI also regenerates every plugin and fails on
drift, and scans the tree for secrets.

## License

By contributing, you agree that your contribution becomes part of this repository under its
[LICENSE](LICENSE), owned by IXO.
