---
name: account
description: The person's money on asks.world. Use when they ask what they have, about earnings, "move my earnings to my account", "pay me out", "cash out", "withdraw to my bank", "send it to my mobile money", "where's my cash-out?", their identity check ("am I verified?", KYC), practice money for a dry run, or a company's payout settings or review budget.
---

# Your money

Follow the `asks` skill's way of talking and lead the way. **Network:** the `asks` skill's rule (ask
once: "Real money, or a dry run with practice money?"; never switch mid-task). Asked about their money
in general: `my_status` on `mainnet` and on `testnet`, said apart ("real money" / "practice money").

## What they have

Read `my_status`; never repeat its lines about a "home address" or a setting. **Say:** "You have $<X>.
It's under Money: https://asks.world/me/money." Then the one next step that fits:

- **Not connected:** "Connect your account so pay goes straight to you. Shall I?" (`connect` skill)
- **Money left on this computer from before:** "$<X> from before is still with me on this computer.
  Shall I move it to your account?" On yes: `sweep_earnings` (it only ever sends to their own connected
  account). **Say:** "Done: $<X> moved to your account." Nowhere to send → the `connect` skill first.
- **Has money to cash out:** "Want to cash it out?"
- **Is it paying off, or should it go back in?** → the `make-money` skill.
- The spending limit they set is used up → `get_connect_link`. **Say:** "You've used the spending limit
  you set. Open this link to set a new one: <link>."

## Cash out

Real money only. **Do:** `cash_out` with only `network`; it says what they have, their LinkedIn and
their identity check. Then pass each answer back, one question at a time:

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
it gives one link. **Say:** "Open this and confirm with one tap: <link>. The money leaves only when you
confirm there." Never confirm for them. The bank or mobile money name must match the name on their ID.

**Where it stands:** `cash_out_status` with the id the confirm page shows. **Say** it in one line: "Not
confirmed yet", "On its way", "Paid", or "Something needs fixing: <what>. Fix it here: <link>."

## Practice money

On the sandbox only: `top_up` (10, 25 or 100) returns a link. **Say:** "Open this to get $<X> of
practice money. Tell me when it's done." Never open it yourself. Real money is never topped up: a card
pays an ask when it's posted (the `create` skill).

## A company's money

- **Review budget:** `review_billing_status` with the company's id says whether one is needed and the
  price. Setting it up or raising it: the `create` skill (references/company.md, step 5). Checks paused
  because credits ran out → "Your check credits have run out. Top them up here: <link>. Tell me when
  it's done."
- **How it pays people:** `set_payout_settings` (preview, then `confirm: true`; the verifier list
  replaces the old one): references/company.md, step 12. Or **Say:** "Open your company's **Payouts**
  page on the website and change it there."
