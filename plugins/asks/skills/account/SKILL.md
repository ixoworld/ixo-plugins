---
name: account
description: The person's money on asks.world. Use when they ask what they have, about earnings, "move my earnings to my account", "pay me out", "cash out", "withdraw to my bank", "send it to my mobile money", "where's my cash-out?", their identity check ("am I verified?", KYC), practice money for a dry run, a company's payout settings or review budget, or the emails asks.world sends them ("stop emails", "stop the hourly summary", "only email me about reports waiting for me", "which emails do I get?").
---

# Your money

## Do this

1. "What do I have?" → `my_status`, then say their Balance (below).
2. Cash out → check which balance they want to withdraw, then follow the steps below.
3. Practice money → `top_up`. Emails → `email_settings`. A company's money → the last section.
4. Every link: they tap it, never you. Then check with the tool named below.

Follow the `asks` skill's way of talking and lead the way. **Real or practice money:** the `asks`
skill's rule (this connector is real money;
never switch mid-task). Signed in first (`connect` skill).

## What they have

Read `my_status` and show the available balances as labelled. Keep home address and settings lines
private. **Say:** "Your Balance is <amount and
currency>. It's under Wallet: https://asks.world/me/wallet." If the reply
shows money set aside on their open Asks, say separately how much is **Committed to your Asks**.
Then offer the next step that fits:

- **Has money to cash out:** "Want to cash it out?"
- **"Move my earnings to my account":** it's already there. **Say:** "What you earn is paid straight
  to your asks.world account. Want to cash it out?"

## Cash out

Approval sends the full Ask Reward to their wallet. They can request a withdrawal when it
arrives. Methods include USDC on Base, a bank payout through their own Stripe account and other
channels supported by the IXO Payments Facilitator. Offer only methods shown for their balance.

For their **Balance**, give the Wallet's Cash out page at https://asks.world/me/cash-out. Ask them to
review the withdrawal quote there. For **Pro Ask earnings**, call `cash_out` with nothing else. It
checks their available earnings, LinkedIn and identity check. Follow each reply, one question at a time:

1. **LinkedIn missing** → the `profile` skill's LinkedIn step, then `cash_out` again.
2. **Identity check:** say where it stands in one line: "Your identity check is done." / "It's being
   reviewed." / "Do your identity check first: https://asks.world/me/identity (Settings → Identity).
   Tell me when it's done." Not done yet → wait for them.
3. **Country** → `country` (two letters).
4. **How to get paid** → `method`. Show the available methods from the reply and explain any
   eligibility checks it names.
5. **How much** → `amount_usd`, within the limits it gives for their chosen method.
6. Own wallet only: the address it asks for → `to`. Only what the person types.

Show the withdrawal quote, including the amount and currency they will receive, any fee and the
destination. If the tool sends them to the Wallet for the quote, have them review it there. With their
yes, call again with `confirm: true` and give them the confirmation link. If the quote changes, show
the updated details and get a fresh yes. They confirm on the site. The bank or mobile money name must
match the name on their ID.

**Where it stands:** `cash_out_status` with the id the confirm page shows (or that they read you).
**Say** it in one line: "Not confirmed yet", "On its way", "Paid", or "Something needs fixing: <what>.
Fix it here: <link>."

## Practice money

Only in the sandbox (the `asks` skill says how to switch).

## Top up real money

**Say:** "Add money on asks.world: Wallet, then Top up balance: https://asks.world/me/wallet/add. Send
digital dollars on Base to your own address shown there, then tap to move them into your wallet. The fee
and time show first. It needs a Google or Apple sign-in." Never send or move it for them. Then check
`my_status` to see it arrived.

## Emails

`email_settings` with nothing lists the emails asks.world sends them, each on or off, with when it's
sent. To change: `kinds` with each one's key set to `false` (stop) or `true` (back on), or `all`.
Keys: `invited` (invited to a Pro Ask), `ok-waiting` (a report waits for their OK), `ok-reminder`
(still waiting 3 days later), `full` (their Pro Ask is filled), `target-reached` (they have the
reports they wanted), `digest` (the hourly summary).

- "Stop the hourly summary" → `kinds: { digest: false }`.
- "Stop all emails" → `all: false`; "turn emails back on" → `all: true`.
- "Only email me about X" → read the list first, then `false` for every other kind and `true` for X.

The emails come from notifications@asks.world (replies aren't read). It's reversible and spends nothing: do it on their word, no confirm. **Say** what changed in one line
("Done: the hourly summary is off. The other emails stay on.") and where to change it later:
https://asks.world/me/settings#emails, or "Stop these emails" at the
foot of any email. Notifications on asks.world and on their phone don't change.

## A company's money

- **Review budget:** `review_billing_status` with the company's id says whether one is needed and the
  price. Setting it up or raising it: the `create` skill (references/company.md, "Review budget"). Checks paused
  because credits ran out → "Your check credits have run out. Top them up here: <link>. Tell me when
  it's done."
- **How it pays people:** `set_payout_settings`: preview, their yes, then a link they tap to sign it
  (the `asks` skill's link way; the verifier list replaces the old one): references/company.md, "How it pays people". Or **Say:** "Open your company's
  **Payouts** page on the website and change it there."
- **Paying workers into bank accounts:** the company's own payouts service with its own Stripe: the
  `bank-payouts` skill.
