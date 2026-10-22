# Openhands HQ

A company installs one plugin, says *Set up my company on Openhands*, and Claude does the rest: the
company on Openhands, one way to pay workers, a reviewer for answers, and a first task.

- **Kind:** `openhands-hq` (local). For Claude Code and Cowork, because Claude runs the setup as
  terminal commands on the person's computer.
- **Today:** [`ixo-openhands-hq`](../../plugins/ixo-openhands-hq/README.md) and
  [`ixo-openhands-hq-test`](../../plugins/ixo-openhands-hq-test/README.md) (testnet).
- **What is in it:** two skills, `openhands-hq` (setup) and `openhands-everyday` (everything after),
  and the same Openhands tools as [`ixo-openhands`](openhands.md) (`npx -y @ixo/openhands-mcp@1`).
- **Network:** mainnet (real money) by default. The easy way to try it with play money is
  `ixo-openhands-hq-test`: always testnet, nothing to set, the newest build (`@dev`); its worker side is
  `ixo-openhands-test`. Play IXO is free from the testnet faucet, https://faucet.testnet.ixo.earth.
  Or start Claude Code with `OPENHANDS_NETWORK=testnet`; every setup step then runs on testnet.

## What it uses

| Tool | For |
| --- | --- |
| `@ixo/decision-oracle` (npm) | Sign in to IXO, create the company, add money to its account, link a reviewer, set the review budget |
| `@ixo/payouts-facilitator` (npm) | Deploy the company's own payouts service to its Cloudflare (USDC on Base or Stripe only) |
| `wrangler` | Cloudflare sign-in and secrets |
| The Stripe CLI | Stripe sign-in (Stripe payouts only) |
| The Openhands tools | Connect to the person's account, save how the company pays, post and close tasks |

## Three ways to pay workers (a company picks one)

| | A. On chain | B. USDC on Base | C. Stripe |
| --- | --- | --- | --- |
| Company funds | Its account on Openhands | Its payout wallet on Base | Its Stripe balance |
| Reward coin | IXO | USDC on Base | USD |
| Payouts service needed | No | Yes | Yes |

Rewards are never PAY. Reviews are paid in PAY from the owner's review credits, through a review
budget the owner approves once.

## Secrets

The plugin carries no key. Keys the person copies go from the clipboard straight into Cloudflare,
never into the chat. If the setup signs the person in to IXO, it offers to remove that sign-in when
it's done.
