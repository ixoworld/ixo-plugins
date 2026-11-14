# Run a verifier

For a developer whose customers need the same check again and again ("was this parcel delivered?",
"does this file meet these rules?"). Find one kind of check and one paying customer before building.

**Building it** is the `ixo-oracle-builder` plugin's job: hand off to its `oracle-builder` skill. Not
installed → Claude Code `/plugin install ixo-oracle-builder@ixo-plugins`, Codex
`codex plugin add ixo-oracle-builder@ixo-plugins`, then a new session. It builds with practice money
first and asks before every signed step. This skill does only the money.

**The money:**

- Each check it runs earns its fee, whether the work passes or fails. Never pass or fail work to earn more.
- **Per check:** the fee − what one check costs to run (AI usage, data, a person's review).
- **One-off costs:** building, hosting and launch. **Checks to cover them** = one-off costs ÷ (fee −
  cost per check), rounded up. Until then it's a loss, and with no customer the one-off costs are lost.
- Built, tested or listed is not earning. Its fees go to the verifier's own account, not to the
  person's `check_verdict`: count a fee only once it has arrived there.
