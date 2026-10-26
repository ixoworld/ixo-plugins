## What changes

<!-- One or two sentences. -->

## Checklist

- [ ] `bun run validate` passes
- [ ] Regenerated every affected plugin after changing `template/` (`bun scripts/regenerate.ts` for all, or `bun run add-plugin` / `add-oracle` for one), and `bun scripts/catalog.ts` shows no README drift
- [ ] Bumped `version` for every plugin whose files changed (CI checks this)
- [ ] No keys, tokens or other secrets anywhere (a local plugin's `env` holds `${VAR}` references only)
- [ ] The skills still follow the kind's rules: oracles never approve, open approval links or call the fee a payout; memory never stores secrets or deletes without a yes; asks.world never claims work it did not do
- [ ] New kind or plugin: documented under `docs/` and in the README
