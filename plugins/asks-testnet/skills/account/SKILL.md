---
name: account
description: The person's money on asks.world. Use when they ask what they have, about earnings, "move my earnings to my account", "pay me out", "cash out", "withdraw to my bank", "send it to my mobile money", "where's my cash-out?", their identity check ("am I verified?", KYC), practice money for a dry run, a company's payout settings or review budget, or the emails asks.world sends them ("stop emails", "stop the hourly summary", "only email me about reports waiting for me", "which emails do I get?").
---

# Your money

Follow the `asks` skill's way of talking and lead the way. **Real or practice money:** the `asks`
skill's rule (this connector is practice money;
never switch mid-task). Signed in first (`connect` skill).

## What they have

Read `my_status`; never repeat its lines about a "home address" or a setting. **Say:** "You have $<X>.
It's under Money: https://test.asks.world/me/money." Then the one next step
that fits:

- **Has money to cash out:** "Want to cash it out?"
- **"Move my earnings to my account":** it's already there. **Say:** "What you earn is paid straight
  to your asks.world account. Want to cash it out?"

## Cash out

Practice money can't be cashed out. **Say:** "Practice money can't be cashed out; it's only
for trying things. Cashing out real money works the same way with asks.world's main connector." and stop.

## Practice money

`top_up` (10, 25 or 100) returns a link. **Say:** "Open this to get $<X> of practice money
and tap to confirm. Tell me when it's done." Never open it to confirm for them. Then `my_status` to see
it arrived.

## Emails

`email_settings` with nothing lists the emails asks.world sends them, each on or off, with when it's
sent. To change: `kinds` with each one's key set to `false` (stop) or `true` (back on), or `all`.
Keys: `invited` (invited to a pro ask), `ok-waiting` (a report waits for their OK), `ok-reminder`
(still waiting 3 days later), `full` (their pro ask is filled), `target-reached` (they have the
reports they wanted), `digest` (the hourly summary).

- "Stop the hourly summary" → `kinds: { digest: false }`.
- "Stop all emails" → `all: false`; "turn emails back on" → `all: true`.
- "Only email me about X" → read the list first, then `false` for every other kind and `true` for X.

It's reversible and spends nothing: do it on their word, no confirm. **Say** what changed in one line
("Done: the hourly summary is off. The other emails stay on.") and where to change it later:
https://test.asks.world/me/settings#emails, or "Stop these emails" at the
foot of any email. Notifications on asks.world and on their phone don't change.

## A company's money

- **Review budget:** `review_billing_status` with the company's id says whether one is needed and the
  price. Setting it up or raising it: the `create` skill (references/company.md, "Review budget"). Checks paused
  because credits ran out → "Your check credits have run out. Top them up here: <link>. Tell me when
  it's done."
- **How it pays people:** `set_payout_settings`: preview, their yes, then a link they tap to sign it
  (the `asks` skill's link way; the verifier list replaces the old one): references/company.md, "How it pays people". Or **Say:** "Open your company's
  **Payouts** page on the website and change it there."
