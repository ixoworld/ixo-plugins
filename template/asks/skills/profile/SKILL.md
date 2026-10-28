---
name: profile
description: The person's public page on asks.world (name, what they do, rate, links) so people can find and invite them, and getting verified by a marketplace such as IXO. Use when they say "make my page", "make my pro page", "make my specialist page", "update my profile", "take my page down", "get checked" or "get verified".
---

# Your pro page

Follow the `asks` skill's way of talking. **Network:** the `asks` skill's rule. Every tool call passes `network`: `mainnet` for real money,
`testnet` for a dry run with practice money. If the person hasn't said, **Ask** once: "Real money, or a dry
run with practice money?" Never switch mid-task. A page is per network: their real page is on
`mainnet`; a dry run makes a test page. Connected first (`connect` skill; for a pro, `reviews:
true`).

## Make or change it

**Do:** `my_page` first. Ask one at a time, reusing what they already said: their name; a one-line
headline; their experience; what they do well (for a pro, the kinds of apps or agents they
review); languages; a rate (optional); links that show their work; when they're available; a short
@name; "May people invite you by your @name?" Build it **only from what they tell or paste you**: you
cannot read LinkedIn or any signed-in site, so never say you did.
**Do:** `set_my_page` without `confirm` (it previews). **Say:** "Here's your page: <name>, <headline>.
Publish it?" On yes, again with `confirm: true`, and give them its link.
**Take it down:** `remove_my_page`, preview, then `confirm: true` on their yes.

**A marketplace's own staff:** `set_marketplace_page` writes the marketplace's page on pro.asks.world
(deck line, story, how it verifies). It previews the page as text; show it, and publish with
`confirm: true` only on their yes. Only an approved marketplace's account can.

## Get verified by a marketplace

A marketplace verifies pros and stands behind them; builders invite the pros of the marketplace they
choose. IXO is the first. Offer once the page is live: "Want IXO to verify your experience? If it checks
out, your page shows **Verified by IXO** with the date." It means IXO checked their experience: not a
background or identity check, no higher ranking, no set time. What they send goes only to IXO, never on
the page.
On yes, one at a time: "In one line, what should IXO check?" · "Tell me about your experience, or paste
your CV." (50–3000 characters, their words) · "Your LinkedIn link? (optional)" (https linkedin.com only)
· "Any other public links that show your work? Up to five." (never ID documents or signed-in pages).
**Do:** `list_marketplaces` to find IXO and the account to ask, then `ask_for_check` with that account as `provider`,
`statement`, `cv`, `linkedin`, `evidence`, without `confirm`. **Say:** "Here's what goes to IXO: <one
line>, your experience, <links>. Only IXO sees it. Send it?" On yes, with `confirm: true`. **Say:**
"Sent. IXO will review it; I'll tell you when it changes." Where it stands later: the `manage` skill.

## Other marketplaces

IXO is not the only one. Each marketplace checks what it is asked to and signs its own dated statement;
the person picks the marketplace, what is checked and what they share (a listing is not an
endorsement). **Say:** "You can see who else can verify you at https://pro.asks.world/pro/marketplaces"
(in the sandbox: https://pro.test.asks.world/pro/marketplaces). `list_marketplaces` lists the same ones;
asking one is `ask_for_check` with its account, the same preview and yes as above. Anyone can check a
signed file (who signed it, who it's about, whether it's real) at https://pro.asks.world/pro/credentials
(in the sandbox: https://pro.test.asks.world/pro/credentials). Never send documents or pay a fee without
their yes.
