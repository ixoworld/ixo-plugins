## What changes

<!-- One or two sentences. -->

## Checklist

- [ ] `bun run validate` passes
- [ ] Updated `plugin-specs.json` for changed versions or plugin inputs, regenerated outputs with `bun scripts/regenerate.ts`, and checked them with `bun scripts/regenerate.ts --check`
- [ ] Bumped `version` for every plugin whose files changed (CI checks this)
- [ ] No keys, tokens or other secrets anywhere (a local plugin's `env` holds `${VAR}` references only)
- [ ] The skills still follow the kind's rules: oracles never approve, open approval links or call the fee a payout; memory never stores secrets or deletes without a yes; asks.world never claims work it did not do or taps a link for the person
- [ ] New kind or plugin: documented under `docs/` and in the README
