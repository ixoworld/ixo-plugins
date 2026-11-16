# ixo-plugins

See CONTRIBUTING.md for how plugins are built (`plugin-specs.json` + `template/` → `scripts/regenerate.ts`), versioned and checked.

## Adding or renaming an asks skill

QiForge's asks plugin (the one Companion uses, on WhatsApp too) reads the list of asks skills from
`plugins/<asks|asks-testnet>/skills/index.json` on `main`, through raw.githubusercontent.com. It doesn't use
GitHub's API, which blocks Cloudflare's servers.

So a new or renamed skill needs three things:

1. its folder in `template/asks/skills/`;
2. its name in `template/asks/skills/index.json`;
3. its name in `SKILLS` in `tests/asks.test.mjs`.

Then bump the versions in `plugin-specs.json` and run `bun scripts/regenerate.ts`. CI (`validate`, `bun run test`) fails a PR when
the folders, `index.json` and `SKILLS` don't match. Companion only sees the change once it is merged to `main`.

## Keep the skills true

After every asks.world change or release, read every `asks` skill against what the product does now (the connector's
tool texts in `impactsai/openhands-network` `services/openhands-mcp/src/`, and the site). Fix anything wrong or
misleading in one PR: describe what exists now, never "it was X, now it's Y". Agents repeat the skills as fact.
