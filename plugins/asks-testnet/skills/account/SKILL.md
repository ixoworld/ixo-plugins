---
name: account
description: The person's money on asks.world. Use when they ask what they have, about earnings, "move my earnings to my account", "pay me out", "cash out", "withdraw to my bank", "send it to my mobile money", "where's my cash-out?", their identity check ("am I verified?", KYC), practice money for a dry run, or a company's payout settings or review budget.
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

## A company's money

- **Review budget:** `review_billing_status` with the company's id says whether one is needed and the
  price. Setting it up or raising it: the `create` skill (references/company.md, step 5). Checks paused
  because credits ran out → "Your check credits have run out. Top them up here: <link>. Tell me when
  it's done."
- **How it pays people:** `set_payout_settings`: preview, their yes, then a link they tap to sign it
  (the `asks` skill's link way; the verifier list replaces the old one): references/company.md, step 12. Or **Say:** "Open your company's
  **Payouts** page on the website and change it there."
