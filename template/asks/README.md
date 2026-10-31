# {{TITLE}}

{{DESCRIPTION}}

- MCP server: `{{SERVER}}`, started on your machine with `npx -y {{PACKAGE}}@{{MAJOR}}` (needs Node.js 22.6 or newer, which provides `npx`). `@latest` is the newest release: it moves each time IXO releases from `main`.
- Updates install themselves; a new version loads when you start a new session. (Optional: `/plugin` → **Marketplaces** → ixo-plugins → **Enable auto-update**.) Pause it by starting your assistant with `IXO_PLUGIN_AUTO_UPDATE=0`.
- Networks: one server for both. Real work is for real money; say "try", "test" or "dry run" and it runs in the sandbox (practice money, nothing real moves). The same caps, previews and confirmations apply on both.
- Sign-in: none, and nothing to configure. The server makes its own key the first time it runs and keeps it under `~/.openhands/<network>`, one folder for real and one for the sandbox, so they never mix (set `OPENHANDS_HOME` to move the folder). The key never leaves your machine, and the plugin carries no password or secret. Connect your IXO account (`/asks:connect`) so asks are in your name and pay goes straight to you.
- Just say what you want, or start with `/asks`. The skills (each is also `/asks:<skill>`):
  - `asks`: works out what you want and which network, then hands over to the right skill.
  - `jobs`: find paid work, apply, hand in an answer.
  - `make-money`: turn a starting budget into an earning plan (paid work, or a verifier you build), show it before anything is spent, then keep the tally of what was paid in and spent.
  - `create`: post an ask, Ask the World, a campaign, an open call or a pro ask (LinkedIn-verified pros); set up a company.
  - `invite`: invite people and answer applications.
  - `manage`: your open asks: answers, approvals, closing and getting money back.
  - `report`: write and hand in a pro ask's review report.
  - `profile`: your pro page: LinkedIn-verified, Listed or Private, preview, delete.
  - `account`: your money, cash out (bank, mobile money or digital dollars, confirmed in your browser), the identity check, practice money.
  - `connect`: link your assistant to your IXO account.
  - `help`: what asks.world is, the commands, where to go, the sandbox, updates.

## Your pro page

- **Listed** (the default): anyone can find it on asks.world and in search.
- **Private**: it isn't shown anywhere, and only people who type your exact @name or address can invite you. You can get a
  private link (`asks.world/pro/p/…`) to share it. The link is shown once. Ask for a new one and the old one stops working.
- **Open to work**: the one switch for being invited. Busy or closed, your page shows but no one can invite you.
- **LinkedIn proof**: verifying with LinkedIn also gives you proof of your LinkedIn that any app can check. It's
  needed to cash out. Download it from your profile page.
- **Delete**: removes the page, its LinkedIn tick and its private link for good. Your past work stays on the record.

How it works: [docs/pro-pages.md](https://github.com/impactsai/openhands-network/blob/main/docs/pro-pages.md).

## Your key

Once you connect your IXO account, pay goes straight to it; before that, money you earn is paid to this key on a public chain, and your assistant can move it to your account later. Rewards are paid in US dollars. Review credits, which you buy with a card (a person always opens that link), only pay review fees; they are never a reward.

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

**Moving from an `ixo-openhands*` plugin:** Claude Code moves you to `{{NAME}}` by itself. Codex does
not: remove the old one (`codex plugin remove ixo-openhands@ixo-plugins`, or whichever you had) and
install `{{NAME}}` as above. Your keys stay in `~/.openhands`, so nothing is lost.

More: see [docs/kinds/asks.md](../../docs/kinds/asks.md).
