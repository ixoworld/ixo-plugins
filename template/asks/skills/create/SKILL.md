---
name: create
description: Post something on asks.world. Use when the person wants to post an ask or a job, ask someone somewhere to go and look (Ask the World), get a fact checked that you can't see, run a cleanup or a campaign, post an open call or competition, get any work done by LinkedIn-verified pros, such as their app or agent reviewed (a Pro Ask), research a market with checks on the ground, get a market or company question researched with a sourced report (an Alpha ask), post as their company, or set their company up. "Dry run" or "try" means the sandbox (practice money).
---

# Post an ask

## Do this

1. Signed in first (the `connect` skill). No idea yet what they want → **Say:** "asks.world gets real
   people to check, find out or review things for you. What would you like done?"
2. Pick the kind from the table below (offer the likely one as the default) and open only its reference.
3. Ask only what the tool asks for and they haven't said, one question at a time.
4. Call the tool without `confirm`, say the total, get "yes", call again with `confirm`, give the link.
5. They say it's done → `link_status` with the link, then give them the ask's link.

This connector is {{#TESTNET}}practice money{{/TESTNET}}{{^TESTNET}}real money{{/TESTNET}}; never switch
mid-task. Post only what the person asked for, in their words. Money in dollars only.

## Which kind of ask?

| They want … | Kind (say this) | Open |
| --- | --- | --- |
| a few people to do one small thing: a photo, a few words, a web page checked | an ask | [post-an-ask.md](references/post-an-ask.md) |
| a fact from a place they can't see (is it open, what's there now) | an ask at a place | [ask-at-a-place.md](references/ask-at-a-place.md) |
| only certain people to complete it: their team, customers, named people | a private ask | [private.md](references/private.md) |
| any work done by verified pros, with a proper report (for example their app, website or agent tried) | a Pro Ask | [review-job.md](references/review-job.md) |
| a particular pro to do the work | a Pro Ask, then invite them | [review-job.md](references/review-job.md) |
| many people to send written work under one brief, and pick a winner | an open call: competition | [open-call.md](references/open-call.md) |
| to pay everyone whose written work passes, up to a number | an open call: hiring | [open-call.md](references/open-call.md) |
| a spot cleaned, litter mapped, or the same job in many places | a campaign | [campaign.md](references/campaign.md) |
| people near places to check things for a prediction market | a plan | [plan.md](references/plan.md) |
| a market or company question researched, with a sourced report (research only, not investment advice), listed on the board | an Alpha ask | [alpha-research.md](references/alpha-research.md) |
| market research by pros they invite, or by anyone verified who has the link, hidden from the board | an Alpha Pro Ask | [review-job.md](references/review-job.md), with `research` |
| to post as their company, or pay people from the company | a company ask | [company.md](references/company.md) |
| people paid just for trying, or even when turned down | pay for trying | [pay-for-trying.md](references/pay-for-trying.md) |

Two kinds fit? Ask which, in one line. {{^TESTNET}}Plans are sandbox-only: never offer one here
([plan.md](references/plan.md) says what to say).{{/TESTNET}}{{#TESTNET}}Every kind works here, plans too.{{/TESTNET}}

## Money

- **The AI check is free.** The total is the pay, plus a share on top only where the preview names one
  (a Pro Ask, or an open call by invitation or application). Read the preview's numbers as they are.
- **Over a limit:** never ask for a yes on those terms. Offer the amounts the tool says fit ("5 at $8
  instead?").
- **Paying by card:** not enough in their Wallet, or they ask for card → pass `pay_by: "card"` on
  `post_ask`. **Say:** "Open this link to pay $<total> by card: <link>. Tell me when it's done." Then
  `read_ask` with the link's id says when it's live. A card pays from $0.50 up to $999,999.99. Not for an
  ask with a picture, a company's ask, an ask at a place, a campaign or a plan. Open calls and Pro Asks
  need nothing extra: their link lets them pay by card or from their Wallet.

## After posting

Public ask: give them the ask's link. Private: send each person their own invite link, never the page
link. More invites and applications: the `invite` skill. Completions, approvals and closing: the
`manage` skill.
