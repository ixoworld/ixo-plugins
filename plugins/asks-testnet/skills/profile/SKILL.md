---
name: profile
description: The person's pro page on asks.world (name, what they do, rate, links), listed or private, verified with their LinkedIn, so people can find and invite them to pro asks. Use when they say "make my page", "make my pro page", "make my specialist page", "update my profile", "make my page private", "share my private page", "delete my page", "take my page down", "get verified", "verify me" or "connect LinkedIn".
---

# Your pro page

Follow the `asks` skill's way of talking and lead the way. **Real or practice money:** the `asks`
skill's rule. This is the sandbox: a page made here is a test page; their real page is on
the real-money connector. Signed in first (`connect` skill). Everything here happens in the chat and nothing
here spends; LinkedIn is the one link they open, to log in there.

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
LinkedIn login finish?" and check again on their word. Verified → **Say:** "You're verified. That's also
what lets you cash out." Then carry on below with
the name, headline, LinkedIn link and suggested @name it returns. A refusal (for example that LinkedIn account
already verifies another account, or it isn't set up yet) → say it in the tool's plain words and stop.

## Make or change the page

Pre-fill from LinkedIn and what they already said; never ask for what you have. **Say:** "From LinkedIn
I have <name>, <headline>. A few things LinkedIn doesn't say:" then **Ask** one at a time:
1. What work do you take? (for a pro, the kinds of apps or agents they review)
2. Your rate? (optional)
3. "Open to work now?" It's the one switch for being invited; otherwise the page shows but nobody can
   invite them.
4. One line about you. Offer: "Shall I write one from your headline?"
5. Ask once, plainly: "Listed, so people can find you, or Private (only people you share it with can
   invite you)?" Listed is the default (`listed` left out or `true`); Private is `listed: false`. If they pick private, offer the link in one line: "Want a private link to share it?"
   (yes → `share_link: "create"` with the same `set_my_page` call).

Then **Ask** the rest one at a time, each skippable ("skip" moves on):
6. A profile photo? (`avatar`)
7. A cover banner, wide, about 3:1? (`banner`)
8. Where are you, and your time zone? (`location`, `timezone`)
9. Your skills? (`skills`) And languages you work in? (`languages`)
10. Experience: offer "Shall I draft it from your headline and what you told me?" (`experience`)
11. Pictures of your work? (`pictures`) Other links? (`links`)

For pictures **Say:** "Paste a link to the picture (one that starts with https), or skip it and add
pictures from your phone on your page's edit form after: https://test.asks.world/me/page/edit."
PNG, JPG or WebP, up to 5 MB. Never ask for a file on their computer.

Use the suggested @name unless they want another. Build it only from LinkedIn and their words; you
cannot read LinkedIn or any signed-in site yourself, so never say you did.
**Do:** `set_my_page` without `confirm` (it previews). **Say:** "Here's your page: <name>, <headline>,
<what they take>, <rate>, <open to work or not>, <Listed or Private>, and whatever else they added. Publish it?" On yes, again with `confirm: true`. A Private
page: **Say:** "Your page is private: only people you share it with can find you. See it as they will:
https://test.asks.world/me/page/preview." If a private link (`asks.world/pro/p/…`) came back, give it once:
it can't be shown again (`share_link: "replace"` makes a new one and switches the old one off). A Listed page: **Say:** "You're live: <link>.
Builders can now invite you, and I'll tell you when they do. Want me to look for work now?" (yes → `jobs`).

**Delete the page:** `remove_my_page` previews what goes (the page, its LinkedIn tick, its private link;
it can't be undone, and their past work stays on the record). **Ask:** "Delete your page? This can't be
undone." Then `confirm: true` only on their yes.

**Say:** "Tell me anytime what to change." Change it here: `set_my_page` with the change, preview, confirm.
Only if they ask for a form, or to add pictures from their phone: https://test.asks.world/me/page/edit.
