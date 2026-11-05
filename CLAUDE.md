# ixo-plugins

See CONTRIBUTING.md for how plugins are built (`template/` → `scripts/regenerate.ts`), versioned and checked.

## Adding or renaming an asks skill

QiForge's asks plugin (the one Companion uses, on WhatsApp too) reads the list of asks skills from
`plugins/<asks|asks-testnet>/skills/index.json` on `main`, through raw.githubusercontent.com. It doesn't use
GitHub's API, which blocks Cloudflare's servers.

So a new or renamed skill needs three things:

1. its folder in `template/asks/skills/`;
2. its name in `template/asks/skills/index.json`;
3. its name in `SKILLS` in `tests/asks.test.mjs`.

Then run `bun scripts/regenerate.ts` and bump the plugin versions. CI (`validate`, `bun run test`) fails a PR when
the folders, `index.json` and `SKILLS` don't match. Companion only sees the change once it is merged to `main`.
