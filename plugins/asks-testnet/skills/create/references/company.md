# A company ask: set up a company, or post as one

- **Pick it when:** the asks should be in their company's name and paid from the company: from its own
  account, or to people by bank-style dollars or card through its own payouts service.
- **Not when:** a person posting for themselves → an ask ([post-an-ask.md](post-an-ask.md)); one expert
  for one job → a pro ask ([review-job.md](review-job.md)).
- **Paying by card:** a company's ask can't be paid by card when it's posted. "Card" here means the
  company pays people through its own Stripe. Say this if they ask to pay by card.
- **Who completes it:** as any ask: anyone, people they approve, or only people they invite.
- **Money:** the company's account sets aside each ask's money when it is posted (a company paying
  through its own payouts service pays the people outside); checks may come from its review budget.
  What isn't paid comes back when they close it.
- **Judged:** by a verifier the company allows.

## Rules for this part

- Plain words: organisation → **your company**; its admin address → **your company's Asks account**;
  oracle → **the verifier**; facilitator → **your payouts service**; review billing → **your review <!-- plain-ok -->
  budget**; rails → **how you pay people**. Money is only ever said in dollars. <!-- plain-ok -->
- `<site>` is the website in the links the tools return; never guess a domain. `<org>` is the
  company's id (starts with `did:ixo:entity:`); if you don't have it, ask them to open their company's
  **Payouts** page and read you the address bar. <!-- plain-ok -->
- Describe a verifier only with what `list_checkers` says. Never sign or approve anything for them.

## Setting up a new company

Creating the company, building or linking its own verifier, and running its own payouts service are
done by a developer on their own computer, not in this chat. **Say:** "Setting up a company is a
developer's job for now. The guide is at https://docs.ixo.world/build-an-oracle/decision-oracle. Once
your company is set up, I can help with its payouts and checks from here, and you post as the company
on asks.world." Don't walk them through it step by step.

## Posting as the company

Not from the chat yet: `post_ask` here posts only as the person. **Say:** "Posting as your company
happens on asks.world for now: open <site>/ask, signed in, and pick your company under **Post as**.
The form offers the verifiers your company allows." Offer to help write the task and title first
([post-an-ask.md](post-an-ask.md)), so they can paste them in.

## How it pays people, and its verifiers

`set_payout_settings` without `confirm`: `orgDid`; `facilitator` (only when it pays through its own
payouts service); `rails` `["chain"]`, `["usdc_base"]` or `["stripe"]`; `oracles`: the verifier(s),
default first (the list replaces the old one, so pass the current list with the new one added);
`currency`: none for paying from the company's account, `USDC` for bank-style dollars, `USD` for card.
**Say:** "You pay people <how>; completions are checked by <verifier>. OK?" → `confirm: true`; it gives a
link they tap to sign it (the `asks` skill's link way). "Not confirmed" → check the company's
**Payouts** page before trying again. **Say:** "You can change this any time on your company's
**Payouts** page: <site>/org/<org>/settings."

## Review budget

**Check:** `review_billing_status` with the company's id says whether a budget is needed and the price.
Only the company's owner can approve it. **Say:** "Each review costs $<price> from your review credits.
You approve a review budget once; you can raise it any time. Open <site>/org/<org>/settings#pay-for-reviews,
set the budget, then click **Allow reviews to be paid from my credits**. Tell me when it's done."
Then `review_billing_status` again to see it's on. The Decision Console's **Billing › Pay for reviews**
does the same.

## Completions a person checks

**Say:** "Now and then a completion needs a person to look at it. It waits in the Decision Console, and if
nobody decides within 48 hours it's turned down. Open
https://decision-console.testnet.ixo.earth/claims/review, <!-- plain-ok -->
sign in, and turn on **Email me when a claim needs my review**." <!-- plain-ok -->

## Refusals

"the oracle's signing wallet could not be confirmed" → wait and retry; "that way of paying isn't <!-- plain-ok -->
available on <network>" → pay from the company's account; "It will retry on its own" → nothing to do.
