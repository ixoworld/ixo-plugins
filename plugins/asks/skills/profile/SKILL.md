---
name: profile
description: The person's public page on asks.world (name, what they do, rate, links) so people can find and invite them, and getting it checked by IXO. Use when they say "make my page", "make my specialist page", "update my profile", "take my page down", "get checked" or "get verified".
---

# Your public page

Follow the `asks` skill's way of talking. **Every tool call passes `network`:** `mainnet` for their real
page; `testnet` if they're trying it out (say once: a test page, play money). Connected first
(`connect` skill; for a specialist, `reviews: true`).

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
