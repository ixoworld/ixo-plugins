# {{TITLE}}

{{DESCRIPTION}}

- MCP server: `{{SERVER}}` → {{URL}}. Nothing runs on your computer and nothing needs installing
  besides the plugin.
{{#TESTNET}}- This is the **sandbox**: practice money, nothing real moves. The same caps, previews and
  confirmations as real money. For real money, install `asks` (https://asks.world/v1/mcp).
{{/TESTNET}}{{^TESTNET}}- This is **real money**. To practise first, install the sandbox twin `asks-testnet`
  (https://test.asks.world/v1/mcp): practice money, nothing real moves, and the same caps, previews
  and confirmations.
{{/TESTNET}}- Sign-in: once, with Google, when the connector asks (Claude Code: `/mcp` → `{{SERVER}}` →
  **Authenticate**; Codex asks when you install, or `codex mcp login {{SERVER}}`). asks.world keeps
  no password or key of yours. This address asks you to sign in before
  anything else.
- Two ways things happen:
  - **In the chat:** reading asks, invitations (accept or decline), applying, inviting pros and
    replying to applications, messages, your pro page, LinkedIn, your notifications and emails,
    cash-out quotes and where a cash-out stands. Also handing in work, once you've left "Let my
    assistant send my completions for me" ticked the first time you send one: after that the
    assistant sends your completions itself and tells you "Sent". Turn it off any time in Settings,
    Agents. A private ask or work done at a place still goes through the link.
  - **One tap on asks.world:** anything that moves money or needs your own signature: posting an ask,
    a Pro Ask, a campaign or a plan, closing one, approving a report, confirming a cash-out, practice
    money, a company's payout settings, and your first completion. The assistant shows the total first
    and waits for your yes, then gives you a link. The page shows the same thing in plain words; one
    tap and it's done.
  - **Screenshots and photos:** in ChatGPT, attach them in the chat. In Claude and other apps that
    show an **Add screenshots** box, add them there. Claude Code and Codex upload the ones you point
    to. Anywhere else, add them on the page the link opens, from your phone or computer.
- The same in Claude Code, Codex, claude.ai, the Claude phone app and ChatGPT: in the web and phone
  apps, add the URL above as a custom connector instead of the plugin.
- Just say what you want, or start with `/{{NAME}}`. The skills (each is also `/{{NAME}}:<skill>`):
  - `asks`: works out what you want, then hands over to the right skill.
  - `jobs`: find paid work, apply, hand in a completion.
  - `make-money`: make money with your AI, and keep count of what it really made.
  - `create`: post an ask, Ask the World, a campaign, an open call, a Pro Ask (LinkedIn-verified pros) or an Alpha ask (market research with a sourced report); set up a company.
  - `invite`: invite people and reply to applications.
  - `manage`: your open asks: completions, approvals, closing and getting money back.
  - `report`: write and hand in a Pro Ask's review report.
  - `profile`: your pro page: LinkedIn-verified, Listed or Private, preview, delete.
  - `account`: your money, cash out (bank, mobile money or digital dollars, confirmed on asks.world), the identity check, practice money.
  - `connect`: sign in, see who you're signed in as, sign out.
  - `help`: what asks.world is, the commands, where to go, the sandbox.

## Your pro page

- **Listed** (the default): anyone can find it on asks.world and in search.
- **Private**: it isn't shown anywhere, and only people who type your exact @name or address can invite you. You can get a
  private link (`asks.world/pro/p/…`) to share it. The link is shown once. Ask for a new one and the old one stops working.
- **Open to work**: the one switch for being invited. Busy or closed, your page shows but no one can invite you.
- **LinkedIn proof**: verifying with LinkedIn also gives you proof of your LinkedIn that any app can check. It's
  needed to cash out. Download it from My Profile.
- **Delete**: removes the page, its LinkedIn tick and its private link for good. Your past work stays on the record.

How it works: [asks.world/how](https://asks.world/how).

## Your money

The Asker funds the reward and the Decision Oracle Fee in the Ask contract in advance. When someone
takes an Ask, the contract reserves the reward for them. Approval sends the full reward to their wallet.

Checkout shows the reward, fees and total. {{#TESTNET}}Use the practice payment options it offers.{{/TESTNET}}{{^TESTNET}}Use the card or USDC on Base options it offers.{{/TESTNET}}
Review the quote and confirm on asks.world. {{^TESTNET}}You can request a withdrawal when the reward
reaches your Wallet. The withdrawal quote shows what you will receive and any fees. Asks shows
approximate amounts in your local currency or the currency you choose in Settings.{{/TESTNET}}{{#TESTNET}}Practice money stays in the sandbox.{{/TESTNET}}

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

claude.ai, the Claude phone app, ChatGPT: add {{URL}} as a custom connector and sign in when it asks.

**Moving from an `ixo-openhands*` plugin:** Claude Code moves you to `asks` by itself. Codex does
not: remove the old one (`codex plugin remove ixo-openhands@ixo-plugins`, or whichever you had) and
install `{{NAME}}` as above.

More: see [docs/kinds/asks.md](../../docs/kinds/asks.md).
