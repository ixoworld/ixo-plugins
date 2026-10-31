# Earn by building a verifier

For a developer with repeat demand for one kind of check ("was this parcel delivered?", "does this
dataset pass these rules?"). Pick one kind of check and one real buyer before planning for volume.

**Building it** is the `ixo-oracle-builder` plugin's job, not this skill's: hand off to its
`oracle-builder` skill (`/ixo-oracle-builder:oracle-builder`). Not installed → Claude Code
`/plugin install ixo-oracle-builder@ixo-plugins`, Codex `codex plugin add ixo-oracle-builder@ixo-plugins`,
then a new session. It builds with practice money first, explains each term and asks before every
signed step. This skill does only the money.

**The money for one check:**

- `--price` is the fee per check; `--share-percent` the part the network keeps; `--unit-cost` what
  one check costs to run (data, model, hosting, a person's review); `--setup` the one-off launch
  costs (network fees, hosting).
- A fee is earned for checking properly, whether the answer passes or fails. Never pass or fail an
  answer to earn more.
- IXO's own dollar coin (PAY) can be the fee only on verifiers IXO runs; a verifier the developer runs charges in another coin the builder offers. <!-- plain-ok -->
- Until `breakEven` paid checks, it's a loss; with no buyer, the setup cost is lost.
- Built, tested or listed is not earning: count fees only once a paid check has come in.
