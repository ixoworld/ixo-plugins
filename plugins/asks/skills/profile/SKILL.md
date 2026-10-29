---
name: profile
description: The person's pro page on asks.world (name, what they do, rate, links), public or private, verified with their LinkedIn, so people can find and invite them to pro asks. Use when they say "make my page", "make my pro page", "make my specialist page", "update my profile", "make my page private", "share my private page", "delete my page", "take my page down", "get verified", "verify me" or "connect LinkedIn".
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
LinkedIn login finish?" and check again on their word. Verified → **Say:** "You also got proof of
your LinkedIn that any app can check; it'll be needed to cash out later." Then carry on below with
the name, headline, LinkedIn link and suggested @name it returns. A refusal (for example that LinkedIn account
already verifies another account, or it isn't set up yet) → say it in the tool's plain words and stop.

## Make or change the page

Pre-fill from LinkedIn and what they already said; never ask for what you have. **Say:** "From LinkedIn
I have <name>, <headline>. A few things LinkedIn doesn't say:" then **Ask** one at a time:
1. What work do you take? (for a pro, the kinds of apps or agents they review)
2. Your rate? (optional)
3. When are you available?
4. One line about you. Offer: "Shall I write one from your headline?"
5. Ask once, plainly: "Do you want your page public so people can find you, or private (only people
   you share it with can invite you)?" Public is the default (`listed` left out or `true`); private is
   `listed: false`. If they pick private, offer the link in one line: "Want a private link to share it?"
   (yes → `share_link: "create"` with the same `set_my_page` call).

Use the suggested @name unless they want another. Build it only from LinkedIn and their words; you
cannot read LinkedIn or any signed-in site yourself, so never say you did.
**Do:** `set_my_page` without `confirm` (it previews). **Say:** "Here's your page: <name>, <headline>,
<what they take>, <rate>, <public or private>. Publish it?" On yes, again with `confirm: true`. A private
page: say "Your page is private: it isn't shown on asks.world, and only people who type your @name or
address can invite you. Preview it at https://asks.world/pro/profile/preview (only you can see
it), or ask me for your private link." If a link came back, give it in the tool's words, once (it can't be shown again;
`share_link: "replace"` makes a new one and switches the old one off). A public page: **Say:** "You're verified and
listed: <link>. Here's what happens next: builders can find you and invite you to pro asks, and I'll tell
you when an invitation comes in. Want me to look for open work now?" (yes → the `jobs` skill).
**Delete the page:** `remove_my_page` previews what goes (the page, its LinkedIn tick, its private link;
it can't be undone, and their past work stays on the record). **Ask:** "Delete your page? This can't be
undone." Then `confirm: true` only on their yes.

**A Zone's own staff:** `set_marketplace_page` writes the Zone's page on asks.world/pro (deck line,
story). It previews the page as text; show it, and publish with `confirm: true` only on their yes. Only
an approved Zone's account can.
