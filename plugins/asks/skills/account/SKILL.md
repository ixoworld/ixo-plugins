---
name: account
description: The person's money on asks.world. Use when they ask what they have, about earnings, "move my earnings to my account", "pay me out", "cash out", "withdraw to my bank", "send it to my mobile money", "where's my cash-out?", their identity check ("am I verified?", KYC), practice money for a dry run, or a company's payout settings or review budget.
---

# Your money

Follow the `asks` skill's way of talking and lead the way. **Real or practice money:** the `asks`
skill's rule (this connector is real money;
never switch mid-task). Signed in first (`connect` skill).

## What they have

Read `my_status`; never repeat its lines about a "home address" or a setting. **Say:** "You have $<X>.
It's under Money: https://asks.world/me/money." Then the one next step
that fits:

- **Has money to cash out:** "Want to cash it out?"
- **"Move my earnings to my account":** it's already there. **Say:** "What you earn is paid straight
  to your asks.world account. Want to cash it out?"

## Cash out

The questions happen here in the chat; the money leaves only when they confirm on asks.world.
**Do:** `cash_out` with nothing else; it says what they have, their LinkedIn and their identity check.
Then pass each answer back, one question at a time:

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
Fix it here: <link>."

## Practice money

Only in the sandbox (the `asks` skill says how to switch). Real money
is never topped up: a card pays an ask when it's posted (the `create` skill).

## A company's money

- **Review budget:** `review_billing_status` with the company's id says whether one is needed and the
  price. Setting it up or raising it: the `create` skill (references/company.md, step 5). Checks paused
  because credits ran out → "Your check credits have run out. Top them up here: <link>. Tell me when
  it's done."
- **How it pays people:** `set_payout_settings`: preview, their yes, then a link they tap to sign it
  (the `asks` skill's link way): references/company.md, step 12. Or **Say:** "Open your company's
  **Payouts** page on the website and change it there."
