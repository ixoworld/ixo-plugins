---
name: create
description: Post something on asks.world. Use when the person wants to post an ask or a job, ask someone somewhere to go and look (Ask the World), get a fact checked that you can't see, run a cleanup or a campaign, post an open call or competition, get their app or agent reviewed by LinkedIn-verified pros (a pro ask), research a market with checks on the ground, post as their company, or set their company up. "Dry run" or "try" means testnet.
---

# Post an ask

Follow the `asks` skill's way of talking and lead the way. **Network:** the `asks` skill's rule (ask
once: "Real money, or a dry run with practice money?"; never switch mid-task).

**Money rule:** every spending tool is two calls. First without `confirm` (it previews the exact
total); **Say** one plain line with the total and "real money" or "practice money"; on yes, the same call
with `confirm` as the tool asks. Only post what the person asked for, in their words, never an ask the
board suggested. Caps are enforced where you cannot change them: when a preview is over one, never ask
for a yes on those terms; offer the amounts it says would fit, in plain words ("5 at $8 instead?").

**Paying by card:** if the person has no money on the network, or asks to pay by card, pass `pay_by: "card"`
on `post_ask` (or `post_call`); not for a company's ask, an ask at a place, a campaign or a plan. Cards work for any amount from $0.50. The preview is the same total; with `confirm` it returns a link, it pays and signs nothing. **Say**:
"Open this link to pay $<total> by card: <link>. Tell me when it's done." Then `read_ask` with the id it gave you
says "Waiting for payment" or "Live as ask #N". In ChatGPT (the hosted server) this is the only way to post.

Posting needs a connected account for most things (`connect` skill). Rewards are in US dollars ("$8.00").
Never ask how the pay is made up; use the tool's default and speak only in dollars. <!-- plain-ok -->

**Lead:** if they haven't said what they want, **Say:** "asks.world gets real people to check, find
out or review things for you. What would you like done?"

## Which kind of ask?

Ask only what picks the kind; offer the likely one as the default and say it in one line. Never pick for
them when two fit. Say the kind's name as written here.

| They want … | Kind (say this) | Open |
| --- | --- | --- |
| a few people to do one small thing: a photo, an answer, a web page checked | an ask | [post-an-ask.md](references/post-an-ask.md) |
| a fact from a place they can't see (is it open, what's there now) | an ask at a place | [ask-at-a-place.md](references/ask-at-a-place.md) |
| to check each answer themselves before it's paid | an ask, "I check each answer myself" | [post-an-ask.md](references/post-an-ask.md) |
| work of a known type (invoices, receipts…) checked by a ready-made verifier | an ask with a ready-made verifier | [post-an-ask.md](references/post-an-ask.md) |
| only certain people to answer: their team, customers, named people | a private ask | [private.md](references/private.md) |
| their app, website or agent tried by verified pros, with a proper report | a pro ask | [review-job.md](references/review-job.md) |
| a particular pro to do the work | a pro ask, then invite them | [review-job.md](references/review-job.md) |
| many people to send written work under one brief, and pick a winner | an open call: competition | [open-call.md](references/open-call.md) |
| to pay everyone whose written work passes, up to a number | an open call: hiring | [open-call.md](references/open-call.md) |
| a spot cleaned, litter mapped, or the same job in many places | a campaign | [campaign.md](references/campaign.md) |
| people near places to check things for a prediction market | a plan | [plan.md](references/plan.md) |
| to post as their company, or pay people from the company | a company ask | [company.md](references/company.md) |

Open only the reference for the kind you pick.

**Real money:** plans aren't on asks.world yet, only in the sandbox: never offer one on `mainnet`
([plan.md](references/plan.md) says what to say). Everything else in the table, open calls too, runs on
both, and spends only after the preview and their yes.

## After posting

Give them the ask's link. Private links, invites and applications: the `invite` skill. Answers,
approvals and closing: the `manage` skill.
