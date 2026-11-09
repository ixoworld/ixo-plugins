# asks.world

asks.world: post asks that real people complete, get your app or agent tried by verified pros (a pro ask), or find paid work. Sign in once with Google; anything that pays or needs your signature is one tap on asks.world. Real money; for practice, add asks-testnet.

- MCP server: `asks` → https://asks.world/v1/mcp. Nothing runs on your computer and nothing needs installing
  besides the plugin.
- This is **real money**. To practise first, install the sandbox twin `asks-testnet`
  (https://test.asks.world/v1/mcp): practice money, nothing real moves, and the same caps, previews
  and confirmations.
- Sign-in: once, with Google, when the connector asks (Claude Code: `/mcp` → `asks` →
  **Authenticate**; Codex asks when you install, or `codex mcp login asks`). asks.world keeps
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
- Just say what you want, or start with `/asks`. The skills (each is also `/asks:<skill>`):
  - `asks`: works out what you want, then hands over to the right skill.
  - `jobs`: find paid work, apply, hand in a completion.
  - `create`: post an ask, Ask the World, a campaign, an open call or a Pro Ask (LinkedIn-verified pros); set up a company.
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

How it works: [docs/pro-pages.md](https://github.com/impactsai/openhands-network/blob/main/docs/pro-pages.md).

## Your money

Everything is in your own asks.world account, the one you sign in to with Google: what you earn is
paid straight to it, and what you post is paid from it (or by card). Rewards are paid in US dollars.
The AI check on your asks is free. On a Pro Ask a share for the network goes on top (20%), so
each pro gets exactly the pay you set.
Review credits, which you buy with a card, only pay review fees; they are never a reward. Nothing is
spent without a preview, your yes and your tap on asks.world, and the same per-ask and per-day caps
apply in the chat and on the page. On asks.world it's all under **Wallet**: your **Balance** (yours
now) and what is **Committed to your Asks** (set aside until it's paid out or comes back).

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

claude.ai, the Claude phone app, ChatGPT: add https://asks.world/v1/mcp as a custom connector and sign in when it asks.

**Moving from an `ixo-openhands*` plugin:** Claude Code moves you to `asks` by itself. Codex does
not: remove the old one (`codex plugin remove ixo-openhands@ixo-plugins`, or whichever you had) and
install `asks` as above.

More: see [docs/kinds/asks.md](../../docs/kinds/asks.md).
