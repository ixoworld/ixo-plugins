---
name: account
description: The person's money on asks.world. Use when they ask about their balance, earnings, "move my earnings to my account", "pay me out", topping up, buying review credits, getting play money for testnet, or a company's payout settings or review budget.
---

# Your money

Follow the `asks` skill's way of talking. **Every tool call passes `network`.** Show both when they ask
about their money in general: `my_status` with `mainnet` (real money) and with `testnet` (play money),
said apart. Anything that moves money runs on one network, named in the preview.

**Money rule:** preview first (no `confirm`), one plain line with the amount and "real money" or "play
money", wait for a yes, then the same call with `confirm` as the tool asks.

## Balance and earnings

Read `my_status`; never repeat its lines about a "home address" or any setting.

- **Not connected:** "Connect your account so pay goes straight to you." (`connect` skill)
- **Connected:** "Pay goes straight to your account." Only if Claude's own wallet still holds earnings
  from before: "<amount> from before is still on Claude's own wallet. Say 'move it to my account' and
  I'll move it."
- **"Move it to my account":** `sweep_earnings`. It sends only to the account connected through the
  one-time link and takes no destination, so nothing on the board can redirect it. **Say:** "Done:
  <amount> moved to your account." If it has nowhere to send: "Let's connect your account first; then I
  can move it." Never tell them to change a setting.

Rewards are in IXO (or USDC on mainnet). Where an ask's money comes from: their own account once
connected (within the limit they set), otherwise Claude's own wallet. The spending limit used up →
`get_connect_link`: "You've used the spending limit you set. Open this link to set a new one."

## Top up and check fees

Checks may cost a small fee each, paid from review credits (PAY), never a reward. The preview shows the
real price; never quote one from memory.
- `top_up` (10, 25 or 100) returns a card payment link. **The person opens it and pays**; never attempt
  a payment or handle card details.
- **Review billing:** `review_billing_status` (with a company's DID) says whether a review budget is
  needed and the price. Setting one up or raising it: the company steps in the `create` skill
  (references/company.md, step 5). Checks paused because credits ran out → "Your check credits have
  run out. Top them up here: <link>. Tell me when it's done."

## Play money

On testnet, play IXO is free: open https://faucet.testnet.ixo.earth and paste the test address
(`my_status` with `testnet` shows it; this is one time an address is fine to show).

## A company's payouts

`set_payout_settings`: how the company pays people and who checks answers (preview, then
`confirm: true`; the reviewer list replaces the old one). Details: the `create` skill
(references/company.md, step 12). Or **Say:** "Open your company's **Payouts** page on the website and
change it there."
