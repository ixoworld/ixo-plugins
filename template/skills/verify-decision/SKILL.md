---
name: verify-decision
description: Use when the user wants to check that a decision from the {{TITLE}} oracle is genuine — read the decision and verify its signed receipt, by claim id or from a receipt (JWS) they already hold.
---

# Verify a decision

## Read it

Call `get_decision` with the `claimId`. The record has the status, the engine's decision (verdict,
reasons, checks), any pending review tasks, and `payment`. It never returns the claim's answers.

## Verify the receipt

Call `verify_receipt`:

- with the `claimId` — the oracle fetches the claim's receipt; or
- with a `jws` (and optionally its `cid`) the user already has — how a third party checks it
  independently, without trusting the oracle that served it.

It checks the signature and that the issuer is the decision engine. Report `valid: true/false` and
the reason when false. A receipt is a signed credential; `cid` is its content id (the proof an oracle
puts on chain when it acts).

## Say exactly what is proven

- **The receipt verifies** = this decision was signed by the engine, unaltered. Nothing more.
- It does **not** prove the claim's facts are true beyond what the engine checked, that anyone may act
  on it (the user's own rules decide that), or that money moved (only `payment` says that; the
  evaluation fee is not a payout).
- If verification fails, say so plainly and do not present the decision as genuine.
