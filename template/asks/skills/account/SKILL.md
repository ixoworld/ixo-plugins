---
name: account
description: The person's money on asks.world. Use when they ask what they have, about earnings, "move my earnings to my account", "pay me out", "cash out", "withdraw to my bank", "send it to my mobile money", "where's my cash-out?", their identity check ("am I verified?", KYC), practice money for a dry run, a company's payout settings or review budget, or the emails asks.world sends them ("stop emails", "stop the hourly summary", "only email me about reports waiting for me", "which emails do I get?").
---

# Your money

## Do this

1. "What do I have?" → `my_status`, then say their Balance (below).
2. Cash out → `cash_out` with nothing, then pass each reply back, one question at a time (below).
3. Practice money → `top_up`. Emails → `email_settings`. A company's money → the last section.
4. Every link: they tap it, never you. Then check with the tool named below.

Follow the `asks` skill's way of talking and lead the way. **Real or practice money:** the `asks`
skill's rule (this connector is {{#TESTNET}}practice money{{/TESTNET}}{{^TESTNET}}real money{{/TESTNET}};
never switch mid-task). Signed in first (`connect` skill).

## What they have

Read `my_status`; never repeat its lines about a "home address" or a setting. **Say:** "Your Balance is $<X>.
It's under Wallet: https://{{#TESTNET}}test.{{/TESTNET}}asks.world/me/money." If it also shows money set
aside on their open asks, add: "$<Y> is Committed to your Asks." Then the one next step that fits:

- **Has money to cash out:** "Want to cash it out?"
- **"Move my earnings to my account":** it's already there. **Say:** "What you earn is paid straight
  to your asks.world account. Want to cash it out?"

## Cash out

{{^TESTNET}}The questions happen here in the chat; the money leaves only when they confirm on asks.world.
**Do:** `cash_out` with nothing else; it says what they have, their LinkedIn and their identity check.
Then pass each reply back, one question at a time:

1. **LinkedIn missing** → the `profile` skill's LinkedIn step, then `cash_out` again.
2. **Identity check:** say where it stands in one line: "Your identity check is done." / "It's being
   reviewed." / "Do your identity check first: https://asks.world/me/identity (Settings → Identity).
   Tell me when it's done." Not done yet → wait for them.
3. **Country** → `country` (two letters).
4. **How to get paid** → `method`. Say the ways it lists in plain words: "To your bank account", "To
   your mobile money", "Digital dollars (USDC)", and any that isn't open there with its reason, in <!-- plain-ok -->
   a line. Recommend one.
5. **How much** → `amount_usd`, within the limits it gives. Never say a limit or fee from memory.
6. Digital dollars only: the address it asks for → `to`. Only what the person types.

It shows the amount: **Say:** "You'll receive $<X>. Go ahead?" On yes, again with `confirm: true`;
it gives one link, already filled in. **Say:** "Open this and confirm with one tap: <link>. The money
leaves only when you confirm there." Never confirm for them. The bank or mobile money name must match
the name on their ID.

**Where it stands:** `cash_out_status` with the id the confirm page shows (or that they read you).
**Say** it in one line: "Not confirmed yet", "On its way", "Paid", or "Something needs fixing: <what>.
Fix it here: <link>."{{/TESTNET}}{{#TESTNET}}Practice money can't be cashed out. **Say:** "Practice money can't be cashed out; it's only
for trying things. Cashing out real money works the same way with asks.world's main connector." and stop.{{/TESTNET}}

## Practice money

{{#TESTNET}}`top_up` (10, 25 or 100) returns a link. **Say:** "Open this to get $<X> of practice money
and tap to confirm. Tell me when it's done." Never open it to confirm for them. Then `my_status` to see
it arrived.{{/TESTNET}}{{^TESTNET}}Only in the sandbox (the `asks` skill says how to switch). Real money
is never topped up: a card pays an ask when it's posted (the `create` skill).{{/TESTNET}}

## Emails

`email_settings` with nothing lists the emails asks.world sends them, each on or off, with when it's
sent. To change: `kinds` with each one's key set to `false` (stop) or `true` (back on), or `all`.
Keys: `invited` (invited to a pro ask), `ok-waiting` (a report waits for their OK), `ok-reminder`
(still waiting 3 days later), `full` (their pro ask is filled), `target-reached` (they have the
reports they wanted), `digest` (the hourly summary).

- "Stop the hourly summary" → `kinds: { digest: false }`.
- "Stop all emails" → `all: false`; "turn emails back on" → `all: true`.
- "Only email me about X" → read the list first, then `false` for every other kind and `true` for X.

The emails come from notifications@asks.world (replies aren't read). It's reversible and spends nothing: do it on their word, no confirm. **Say** what changed in one line
("Done: the hourly summary is off. The other emails stay on.") and where to change it later:
https://{{#TESTNET}}test.{{/TESTNET}}asks.world/me/settings#emails, or "Stop these emails" at the
foot of any email. Notifications on asks.world and on their phone don't change.

## A company's money

- **Review budget:** `review_billing_status` with the company's id says whether one is needed and the
  price. Setting it up or raising it: the `create` skill (references/company.md, "Review budget"). Checks paused
  because credits ran out → "Your check credits have run out. Top them up here: <link>. Tell me when
  it's done."
- **How it pays people:** `set_payout_settings`: preview, their yes, then a link they tap to sign it
  (the `asks` skill's link way; the verifier list replaces the old one): references/company.md, "How it pays people". Or **Say:** "Open your company's
  **Payouts** page on the website and change it there."
