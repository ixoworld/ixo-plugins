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
4. Call the tool without `confirm`, say the fees, the total and the checks its preview lists, get
   "yes", call again with `confirm` set to that exact total, give the link.
5. They say it's done → `link_status` with the link, then give them the ask's link.

This connector is practice money; never switch
mid-task. Post only what the person asked for, in their words. Money in dollars only.

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

- **Open Asks:** anyone can do it, an AI check approves each one, no service fee, and it's public.
- **Pro Asks:** verified pros do it, you OK each report, only you see the reports, and Asks takes a share (the total shows it).
- **Open Calls:** many people send entries, you pick the best, and entries stay sealed until it closes.

**Pick the kind from what they want done, never from words in the task.** A task that says "test" or
"check" and links an app is a review: someone tries it and says what they found. A website check is
only "is this one address up?", and a review never gets one. What a completion must include (words,
a photo, a file, a place) is also your choice, in the tool's fields: a word like "photo" in the task
chooses nothing. The task mentions a photo, a file, a site, an app or a link, or you are writing its
checks → open [brief.md](references/brief.md) first.

Two rows really fit? Ask one plain question about what they want, never which market. Every kind works here, plans too.

## Money

- **On a Pro Ask the AI check is free** (the Alpha check too); the extra cost is the network's share
  on top, which the preview shows. An open call by invitation or application carries the same share.
  An open ask has no service fee, only a check fee for each completion the AI checks. Read the
  preview's numbers as they are; never work one out yourself.
- **Set aside when posted:** the money is set aside on the ask when it's posted; a person is paid from
  it only for approved work, and what isn't paid comes back when they close it.
- **Over a limit:** never ask for a yes on those terms. Offer the amounts the tool says fit ("5 at $8
  instead?").
- **Paying:** an ask, an open call, a campaign or a plan is paid from the digital dollars in their
  Wallet, at its one link. Not enough → **Say:** "Add money first: Wallet, then Top up balance:
  https://test.asks.world/me/wallet/add. Tell me when it's there." A card can't pay
  for these.
- **A card pays only for a Pro Ask:** its link lets them pay by card or from their Wallet, and shows
  what a card can take.

## After posting

Public ask: give them the ask's link. Private with one link for everyone: its secret `/j/…` link, never
`/t/<number>`. Invite-only: send each person their own invite link, never the page link. More invites and applications: the `invite` skill. Completions, approvals and closing: the
`manage` skill.
