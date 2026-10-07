# Contributing

Thanks for helping. This repo is IXO's plugin marketplace for AI assistants — mostly one small
plugin per IXO oracle, all built from the same skills.

## Branches

- `develop` — where work lands first. Open your pull request against `develop`.
- `main` — what users install. `develop` is merged into `main` for a release.

Both are protected: changes go through a pull request, the `validate` check must pass, and someone
on the IXO core team approves it. Force-pushes and deletes are blocked.

## Adding an oracle

```bash
bun run add-oracle --name <plugin-name> --title "<Your oracle>" \
  --url https://<your oracle>/v1/mcp --description "<one line about what it decides>"
bun run validate
```

- `--name` is kebab-case, for example `ixo-myoracle-mainnet`. Put the network in the name.
- `--url` must be the oracle's MCP endpoint (`https://…/v1/mcp`) and the oracle must use IXO
  sign-in.
- Bump `--version` whenever you regenerate a plugin with changed skills, so installs update.

Never put a key, token or other secret in a plugin. A plugin only ever carries a public URL.

## Changing the skills

The skills live in [`template/skills`](template/skills). After editing them, regenerate every
plugin (CI fails if a plugin drifts from the template) and bump their versions.

Keep the wording honest. The skills must never let the assistant approve a charge for the user, open
an approval link, or call the evaluation fee a payout.

## Checks

`bun run validate` runs Claude Code's plugin validator on both marketplaces and every plugin. You
need the Claude Code CLI installed for it.

## License

By contributing, you agree that your contribution becomes part of this repository under its
[LICENSE](LICENSE), owned by IXO.
