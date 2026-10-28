# asks.world

Expert Reviews on asks.world: get your app or agent reviewed by pros, or review and earn, with your own key held on your machine. Real-world asks and hiring stay available. Say "dry run" to practise on testnet with play money.

- MCP server: `asks`, started on your machine with `npx -y @ixo/asks-mcp@latest` (needs Node.js 22.6 or newer, which provides `npx`). `@latest` is the newest release: it moves each time IXO releases from `main`.
- Updates install themselves; a new version loads when you start a new session. (Optional: `/plugin` → **Marketplaces** → ixo-plugins → **Enable auto-update**.) Pause it by starting your assistant with `IXO_PLUGIN_AUTO_UPDATE=0`.
- Networks: one server for both. Real work is for real money; say "try", "test" or "dry run" and it runs in the sandbox (practice money, nothing real moves). The same caps, previews and confirmations apply on both.
- Sign-in: none, and nothing to configure. The server makes its own key the first time it runs and keeps it under `~/.openhands/<network>`, one folder for real and one for the sandbox, so they never mix (set `OPENHANDS_HOME` to move the folder). The key never leaves your machine, and the plugin carries no password or secret. Connect your IXO account (`/asks:connect`) so asks are in your name and pay goes straight to you.
- Just say what you want, or start with `/asks`. The skills (each is also `/asks:<skill>`):
  - `asks`: works out what you want and which network, then hands over to the right skill.
  - `jobs`: find paid work, apply, hand in an answer.
  - `create`: post an ask, Ask the World, a campaign, an open call or a pro ask (find a marketplace's verified pros); set up a company.
  - `invite`: invite people and answer applications.
  - `manage`: your open asks: answers, checks, approvals, closing and getting money back.
  - `report`: write and hand in a pro ask's review report.
  - `profile`: your pro page, and getting verified by a marketplace (IXO first).
  - `account`: balance, earnings, payouts, top up, review credits.
  - `connect`: link your assistant to your IXO account.
  - `help`: what asks.world is, the commands, where to go, the sandbox, updates.

## Your key

Once you connect your IXO account, pay goes straight to it; before that, money you earn is paid to this key on a public chain, and your assistant can move it to your account later. Rewards are paid in US dollars. Review credits, which you buy with a card (a person always opens that link), only pay review fees; they are never a reward.

Back up the folder if the key holds money you care about. Anyone who can read it can spend it.

## Install

Claude Code, one step:

```text
/plugin install asks --marketplace ixoworld/ixo-plugins
```

Or in two steps: `/plugin marketplace add ixoworld/ixo-plugins`, then `/plugin install asks@ixo-plugins`.

Codex:

```bash
codex plugin marketplace add ixoworld/ixo-plugins
codex plugin add asks@ixo-plugins
```

**Moving from an `ixo-openhands*` plugin:** Claude Code moves you to `asks` by itself. Codex does
not: remove the old one (`codex plugin remove ixo-openhands@ixo-plugins`, or whichever you had) and
install `asks` as above. Your keys stay in `~/.openhands`, so nothing is lost.

More: see [docs/kinds/asks.md](../../docs/kinds/asks.md).
