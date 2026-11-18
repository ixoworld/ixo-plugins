---
name: create
description: Post something on asks.world. Use when the person wants to post an ask or a job, ask someone somewhere to go and look (Ask the World), get a fact checked that you can't see, run a cleanup or a campaign, post an open call or competition, get any work done by LinkedIn-verified pros, such as their app or agent reviewed (a Pro Ask), research a market with checks on the ground, get a market or company question researched with a sourced report (an Alpha ask), post as their company, or set their company up. "Dry run" or "try" means the sandbox (practice money).
---

# Post an ask

## Do this

1. Signed in first (the `connect` skill). No idea yet what they want → **Say:** "asks.world gets real
   people to check, find out or review things for you. What would you like done?"
2. **You pick, they don't.** From what they want, pick the row below yourself. Never list the markets
   or ask "which market?": they don't know the difference and shouldn't have to. Say your pick in one
   line with the market's short line (below), then open only its reference. They say no → pick again.
3. Ask only what the tool asks for and they haven't said, one question at a time.
4. Call the tool without `confirm`. Show the reward, any fees and the total. Get "yes", call again
   with `confirm` set to the exact total and give the checkout link.
5. They say it's done → `link_status` with the link, then give them the ask's link.

This connector is practice money; never switch
mid-task. Post only what the person asked for, in their words. Use the currency shown in the quote.

## Pick the best fit for them

| They want … | Market: kind | Open |
| --- | --- | --- |
| a few people to do one small thing: a photo, a few words, a web page checked | Open Asks: an ask | [post-an-ask.md](references/post-an-ask.md) |
| a fact from a place they can't see (is it open, what's there now) | Open Asks: an ask at a place | [ask-at-a-place.md](references/ask-at-a-place.md) |
| only certain people to complete it: their team, customers, named people | Open Asks: a private ask | [private.md](references/private.md) |
| a spot cleaned, litter mapped, or the same job in many places | Open Asks: a campaign | [campaign.md](references/campaign.md) |
| people near places to check things for a prediction market | Open Asks: a plan | [plan.md](references/plan.md) |
| a market or company question researched, with a sourced report (research only, not investment advice), listed on the board | Open Asks: an Alpha ask | [alpha-research.md](references/alpha-research.md) |
| to post as their company, or pay people from the company | Open Asks: a company ask | [company.md](references/company.md) |
| people paid just for trying, or even when turned down | Open Asks: pay for trying | [pay-for-trying.md](references/pay-for-trying.md) |
| any work done by verified pros, with a proper report (for example their app, website or agent tried) | Pro Asks: any work | [review-job.md](references/review-job.md) |
| a particular pro to do the work | Pro Asks: any work, then invite them | [review-job.md](references/review-job.md) |
| market research by pros they invite, or by anyone verified who has the link, hidden from the board | Pro Asks: market research | [review-job.md](references/review-job.md), with `research` |
| many people to send written work under one brief, and pick a winner | Open Calls: a competition | [open-call.md](references/open-call.md) |
| to pay everyone whose written work passes, up to a number | Open Calls: hiring | [open-call.md](references/open-call.md) |

**Say your pick** in one line, the market's short line filled in. For example: "Best fit: **Pro Asks**.
Verified pros do it, you OK each report, and only you see the reports. OK?"

- **Open Asks:** anyone can do it, and the Ask says how each completion is checked and approved.
- **Pro Asks:** verified pros do the work, a Decision Oracle checks each report and you give final approval.
- **Open Calls:** many people send entries, you pick the best, and entries stay sealed until it closes.

Two rows really fit? Ask one plain question about what they want, never which market. Every kind works here, plans too.

## Money

- **Funding:** the Asker pays the reward and the Decision Oracle Fee into the Ask contract in advance.
  The operator sets the fee and the Asker agrees to it at setup. The Ask reserves the reward when
  someone takes it. On approval the full reward goes straight to that person's, agent's or organisation's wallet.
- **Quote:** show the reward, fees and total from the preview. The checkout link shows the methods and
  limits for that Ask. If it shows a different total, review the new quote with the person before they pay.
- **Paying:** use the practice payment options shown at checkout.
  If checkout asks them to add to their Balance, send them to **Wallet** → **Top up balance** at
  https://test.asks.world/me/wallet/add.
- **Over a limit:** offer only the amounts the tool or checkout says fit. Get a new quote and a fresh yes.

## After posting

Public ask: give them the ask's link. Private: send each person their own invite link, never the page
link. More invites and applications: the `invite` skill. Completions, approvals and closing: the
`manage` skill.
