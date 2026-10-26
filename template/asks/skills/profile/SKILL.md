---
name: profile
description: The person's public page on asks.world (name, what they do, rate, links) so people can find and invite them, and getting it checked by IXO. Use when they say "make my page", "make my specialist page", "update my profile", "take my page down", "get checked" or "get verified".
---

# Your public page

Follow the `asks` skill's way of talking. **Network:** the `asks` skill's rule. Every tool call passes `network`: `mainnet` for real money,
`testnet` for a dry run with play money. If the person hasn't said, **Ask** once: "Real money, or a dry
run with play money?" Never switch mid-task. A page is per network: their real page is on
`mainnet`; a dry run makes a test page. Connected first (`connect` skill; for a specialist, `reviews:
true`).

## Make or change it

**Do:** `my_page` first. Ask one at a time, reusing what they already said: their name; a one-line
headline; their experience; what they do well (for a specialist, the kinds of apps or agents they
review); languages; a rate (optional); links that show their work; when they're available; a short
@name; "May people invite you by your @name?" Build it **only from what they tell or paste you**: you
cannot read LinkedIn or any signed-in site, so never say you did.
**Do:** `set_my_page` without `confirm` (it previews). **Say:** "Here's your page: <name>, <headline>.
Publish it?" On yes, again with `confirm: true`, and give them its link.
**Take it down:** `remove_my_page`, preview, then `confirm: true` on their yes.

## Get checked by IXO

Offer once the page is live: "Want IXO to check your experience? If it checks out, your page shows
**Checked by IXO**." It means IXO checked their experience: not a background or identity check, no
higher ranking, no set time. What they send goes only to IXO, never on the page.
On yes, one at a time: "In one line, what should IXO check?" · "Tell me about your experience, or paste
your CV." (50–3000 characters, their words) · "Your LinkedIn link? (optional)" (https linkedin.com only)
· "Any other public links that show your work? Up to five." (never ID documents or signed-in pages).
**Do:** `list_verification_services` to find IXO's offer, then `ask_for_check` with IXO as `provider`,
`statement`, `cv`, `linkedin`, `evidence`, without `confirm`. **Say:** "Here's what goes to IXO: <one
line>, your experience, <links>. Only IXO sees it. Send it?" On yes, with `confirm: true`. **Say:**
"Sent. IXO will review it; I'll tell you when it changes." Where it stands later: the `manage` skill.

## Other providers' checks (credentials)

IXO is not the only one. Other providers check specific claims and sign their own credential; the
person picks the provider, what is checked and what they share (a listing is not an endorsement).
**Say:** "You can see who else can check you at https://pro.asks.world/expert/verifications" (a dry
run: https://pro.test.asks.world/expert/verifications). `list_verification_services` lists the same
offers; asking one is `ask_for_check` with that provider, the same preview and yes as above. Anyone
can check a signed file (who signed it, who it's about, whether it's real) at
https://asks.world/expert/credentials (a dry run: https://test.asks.world/expert/credentials). Never
send documents or pay a fee without their yes.
