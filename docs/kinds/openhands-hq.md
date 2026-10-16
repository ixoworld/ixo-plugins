# Openhands HQ

A company installs one plugin, says *Set up my company on Openhands*, and Claude does the rest: an
organisation on chain, one way to pay workers, an oracle, and a first ask.

- **Kind:** `openhands-hq` (local). For Claude Code and Cowork, because Claude runs the setup as
  terminal commands on the person's computer.
- **Today:** [`ixo-openhands-hq`](../../plugins/ixo-openhands-hq/README.md) (draft).
- **What is in it:** one skill, `openhands-hq`, and the same Openhands MCP server as
  [`ixo-openhands`](openhands.md) (`npx -y @ixo/openhands-mcp@1`). It has no server of its own.

## What it runs

| Tool | For |
| --- | --- |
| The eval-oracle CLI (`@ixo/eval-oracle`) | Sign in to IXO, create the organisation, check its balance, link an oracle, sign out |
| The payouts facilitator installer | Deploy the company's own payouts service to its Cloudflare, link it to the organisation, check the links |
| `wrangler` | Cloudflare sign-in and secrets |
| The Stripe CLI | Stripe sign-in and the Connect webhook (Stripe payouts only) |
| The Openhands tools (`connect_account`, `my_status`, `set_payout_settings`, `post_ask`) | Give the plugin key a 30-day, capped permission, save the payout way on the organisation, and post the first ask |

The skill's "Commands and addresses" table is the one place that says how each is started, so moving
a tool from a local file to npm is a one-line change.

## Three ways to pay workers (a company picks one)

| | A. On chain | B. USDC on Base | C. Stripe |
| --- | --- | --- | --- |
| Company funds | The ask, when posting | Its payout wallet on Base | Its Stripe balance |
| Reward coin | IXO or USDC (USDC on mainnet only) | USDC | USD |
| Who pays the worker | The chain | The company's facilitator | The company's facilitator |
| Facilitator needed | No | Yes | Yes |

Rewards are never PAY. Review (checker) fees are PAY on every way: from the organisation's account,
or, for oracles that bill per check, from the owner's Console credits (Pay for reviews). Credit bought
with a card stays on the subscription and pays for reviews; it cannot be withdrawn to a wallet.

## Secrets

The plugin carries no key. Keys the person copies go from the clipboard straight into Cloudflare
(`pbpaste | wrangler secret put`), never into the chat. The IXO sign-in file is deleted at the end
(step 11), because it can sign anything and never expires.
