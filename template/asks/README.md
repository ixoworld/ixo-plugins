# {{TITLE}}

{{DESCRIPTION}}

- MCP server: `{{SERVER}}`, started on your machine with `npx -y {{PACKAGE}}@{{MAJOR}}` (needs Node.js 22.6 or newer, which provides `npx`).
- Networks: one server for both. Real work runs on mainnet (real money); say "try", "test" or "dry run" and it runs on testnet (play money, nothing real moves). The same caps, previews and confirmations apply on both.
- Sign-in: none, and nothing to configure. The server makes its own key the first time it runs and keeps it under `~/.openhands/<network>`, one folder per network, so testnet and mainnet keys never mix (set `OPENHANDS_HOME` to move the folder). The key never leaves your machine, and the plugin carries no key, token or secret. Connect your IXO account (`/asks:connect`) so asks are in your name and pay goes straight to you.
- Just say what you want, or start with `/asks`. The skills (each is also `/asks:<skill>`):
  - `asks`: works out what you want and which network, then hands over to the right skill.
  - `jobs`: find paid work, apply, hand in an answer.
  - `create`: post an ask, Ask the World, a campaign, an open call or a review job; set up a company.
  - `invite`: invite people and answer applications.
  - `manage`: your open asks: answers, checks, approvals, closing and getting money back.
  - `report`: write and hand in an expert review report.
  - `profile`: your public page, and getting checked by IXO.
  - `account`: balance, earnings, payouts, top up, review credits.
  - `connect`: link your assistant to your IXO account.
  - `help`: what asks.world is, the commands, where to go, testnet, updates.

## Your key

Once you connect your IXO account, pay goes straight to it; before that, money you earn is paid to this key on a public chain, and your assistant can move it to your account later. Rewards are paid in IXO (or USDC on mainnet). PAY, which you buy with a card (a person always opens that link), only pays review fees; it is never a reward.

Back up the folder if the key holds money you care about. Anyone who can read it can spend it.

## Install

Claude Code, one step:

```text
/plugin install {{NAME}} --marketplace ixoworld/ixo-plugins
```

Or in two steps: `/plugin marketplace add ixoworld/ixo-plugins`, then `/plugin install {{NAME}}@ixo-plugins`.

Codex:

```bash
codex plugin marketplace add ixoworld/ixo-plugins
codex plugin add {{NAME}}@ixo-plugins
```

More: see [docs/kinds/asks.md](../../docs/kinds/asks.md).
