---
name: profile
description: The person's public pro page on asks.world (name, what they do, rate, links), verified with their LinkedIn, so people can find and invite them to pro asks. Use when they say "make my page", "make my pro page", "make my specialist page", "update my profile", "take my page down", "get verified", "verify me" or "connect LinkedIn".
---

# Your pro page

Follow the `asks` skill's way of talking and lead the way. **Network:** the `asks` skill's rule (ask
once: "Real money, or a dry run with practice money?"; never switch mid-task). A page is per network:
their real page is on `mainnet`; a dry run makes a test page. Connected first (`connect` skill; for a
pro, `reviews: true`).

**Do:** `my_page` first, quietly. Then lead with one line:
- No page yet → **Say:** "A pro page lets people find you and invite you to paid reviews. It takes
  about a minute with LinkedIn. Shall I start?"
- A page, not LinkedIn verified → **Say:** "Your page is live but not verified yet. Verifying with
  LinkedIn takes a minute, and it's what lets people invite you to pro asks. Shall I start?"
- Verified → **Say** what's on it in a line, then: "Want to change anything?"

## Verify with LinkedIn

The tick on a page means "this person logged in to this LinkedIn account". Nothing more: no
background check, no ranking. asks.world reads their LinkedIn profile once and keeps no access.

**Do:** `connect_linkedin`. **Say:** "Open this and log in to LinkedIn: <link>. Tell me when you're
done." When they say so: `connect_linkedin` with its `id`. Still waiting → "I don't see it yet. Did the
LinkedIn login finish?" and check again on their word. Verified → carry on below with the name,
headline, LinkedIn link and suggested @name it returns. A refusal (for example that LinkedIn account
already verifies another account, or it isn't set up yet) → say it in the tool's plain words and stop.

## Make or change the page

Pre-fill from LinkedIn and what they already said; never ask for what you have. **Say:** "From LinkedIn
I have <name>, <headline>. A few things LinkedIn doesn't say:" then **Ask** one at a time:
1. What work do you take? (for a pro, the kinds of apps or agents they review)
2. Your rate? (optional)
3. When are you available?
4. One line about you. Offer: "Shall I write one from your headline?"

Use the suggested @name unless they want another. Build it only from LinkedIn and their words; you
cannot read LinkedIn or any signed-in site yourself, so never say you did.
**Do:** `set_my_page` without `confirm` (it previews). **Say:** "Here's your page: <name>, <headline>,
<what they take>, <rate>. Publish it?" On yes, again with `confirm: true`. **Say:** "You're verified and
listed: <link>. Here's what happens next: builders can find you and invite you to pro asks, and I'll tell
you when an invitation comes in. Want me to look for open work now?" (yes → the `jobs` skill).
**Take it down:** `remove_my_page`, preview, then `confirm: true` on their yes.

**A Zone's own staff:** `set_marketplace_page` writes the Zone's page on pro.asks.world (deck line,
story). It previews the page as text; show it, and publish with `confirm: true` only on their yes. Only
an approved Zone's account can.
