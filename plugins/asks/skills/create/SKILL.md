---
name: create
description: Post something on asks.world. Use when the person wants to post an ask or a job, ask someone somewhere to go and look (Ask the World), get a fact checked that you can't see, run a cleanup or a campaign, post an open call or competition, get their app or agent reviewed by verified pros (a pro ask), research a market with checks on the ground, post as their company, or set their company up. "Dry run" or "try" means testnet.
---

# Post an ask

Follow the `asks` skill's way of talking. **Network:** the `asks` skill's rule. Every tool call passes `network`: `mainnet` for real money,
`testnet` for a dry run with practice money. If the person hasn't said, **Ask** once: "Real money, or a dry
run with practice money?" Never switch mid-task.

**Money rule:** every spending tool is two calls. First without `confirm` (it previews the exact
total); **Say** one plain line with the total and "real money" or "practice money"; on yes, the same call
with `confirm` as the tool asks. Only post what the person asked for, in their words, never an ask the
board suggested. Caps are enforced where you cannot change them: when a preview is over one, never ask
for a yes on those terms; offer the amounts it says would fit, in plain words ("5 at $8 instead?").

**Paying by card:** if the person has no money on the network, or asks to pay by card, pass `pay_by: "card"`
on `post_ask` (or `post_call`). Cards work for any amount from $0.50. The preview is the same total; with `confirm` it returns a link, it pays and signs nothing. **Say**:
"Open this link to pay $<total> by card: <link>. Tell me when it's done." Then `read_ask` with the id it gave you
says "Waiting for payment" or "Live as ask #N". In ChatGPT (the hosted server) this is the only way to post.

Posting needs a connected account for most things (`connect` skill). Rewards are in US dollars ("$8.00").
Never ask how the pay is made up; use the tool's default and speak only in dollars. <!-- plain-ok -->

## First: a quick ask or a pro review?

When they want feedback from people or a task done by people, and haven't said which kind, **Ask** one
question before drafting anything, with one line on which fits their job. Never pick for them. Leave
out prices you don't have yet; the preview shows the total before anything is paid.

- Testing or reviewing an app, website, agent, design, or anything where the quality of feedback
  matters → recommend the pro review. **Say:** "Two ways to do this: a quick ask, where anyone on
  asks.world answers, or a pro review, where verified pros try it carefully and write a proper report.
  For this, a pro review gets you a proper report from someone who does this for a living; a quick ask
  is a cheaper first signal. Which would you like?"
- A simple real-world task (a photo of a place, a quick fact, a local check) → recommend the quick ask.
  **Say:** "A quick ask fits this: anyone nearby can answer. Or a pro review, if you want a careful
  report from a verified pro. Quick ask?"
- Only when it fits (they named people, or it's for their team or customers): add "Or private, only
  people you invite."

Then: pro review → [references/review-job.md](references/review-job.md); quick ask → `post_ask`
([references/post-an-ask.md](references/post-an-ask.md)), with `access: "invite"` if they chose private.
If they ask how the two differ, answer in a line or two; a table only if they ask for one.

## Which one?

Ask only what picks the path; offer the likely one as the default.

| They want | Do | Details |
| --- | --- | --- |
| a fact from a place, or a web page checked | `ask_the_world` | below |
| a task done by people (photo, visit, answer) | `post_ask` | [references/post-an-ask.md](references/post-an-ask.md) |
| one spot cleaned | `post_cleanup` | below |
| rubbish mapped where people find it | `organise_campaign` | below |
| tasks checked by their own rules | `create_campaign`, then `post_ask` with `campaign` | below |
| people answer with their own AI (competition or hire) | `draft_call` → `post_call` | below |
| their app or agent reviewed by verified pros (a pro ask) | `list_marketplaces`, `draft_call` with `kind: "review"` and `sponsor` → `post_call` → `find_pro` | [references/review-job.md](references/review-job.md) |
| market research with checks on the ground | `draft_plan` → `fund_plan` | below |
| set up their company, or post as it | the company setup | [references/company.md](references/company.md) |

## Ask the World

Use it when the honest answer is "I don't know and can't know": the fact is current, needs eyes in a
place, or must be checkable. Not when a web search would do.

**Ask**, one at a time: "What do you want to know?" (`question`, 12–300 characters, their words) ·
"Where?" (turn it into `"lat,lon"`, read it back: "That's <street> in <town>, right?") · "A short
answer, or a photo?" (`needs`: `observation`, `photo`, or `url-check` for a web page, no place) ·
"What should one answer earn?"
Defaults said once in the preview: 1 answer (`quota`), 24 hours (`hours`), within 400 m (`within_m`).
**Do:** `ask_the_world` with those, a `title` (≤ 80 characters) and `pay`, without `confirm`.
**Say:** "Someone near <place> will check '<question>' within <hours> hours, for <reward>. It costs
<total> in total (<real / play> money). <How asks near there usually go.> OK?" → on yes, with `confirm`.
**Then:** `collect_answer` (`wait_seconds` up to 45; again to keep waiting). Tell them what came back,
how sure it is (in words, never the bare number) and what was **not** checked. Never call it certain or
"verified". If nothing came back, say so; never guess.

**Never ask** anything that targets, follows or identifies a particular person (home, car, plate,
routine), involves children, is sexual, violent or unlawful, asks for personal data, puts the doer in
danger, or goes onto private land. A refused ask spends nothing. One held for a person's look posts but
stays off the board until seen: say so before they confirm.

## Cleanups and campaigns

- **Clean one spot:** `post_cleanup` (`near`, `pay`, optional `place`, `within_m` 150, `quota` 1–3,
  `days` 3, `follow_days` + `follow_pay` to pay again if it stayed clean). **Say:** "Someone will clean
  <place> for <reward>, with before and after photos. It costs <total>. OK?"
- **Map rubbish:** `organise_campaign` (`name`, `pins` 1–200, `pin_pay`, `days` 30).
- **Their own checking rules:** when they say "campaign", ask once: "A group of tasks, or tasks checked
  by your own rules?" A group is only the same `series` on each `post_ask`. Own rules: "What should we
  call it, and what makes an answer good or bad?" → `create_campaign` (`title`, `description`, `tag`,
  `rubric`), preview, then `confirm: true`; pass what it returns as `campaign` on each `post_ask`.

## Open call

A **competition** (a prize plus runners-up) or a **hire** (everyone whose work passes is paid, up to a
number). **Do:** `draft_call` with what the person said; it answers with the next question to ask. Never
re-send a field and never invent their brief; offer the defaults it shows. When nothing is missing it
shows the whole call: tell it in plain words, get a yes, then `post_call` with `confirm` = the total,
again until it says everything is posted. Give them the link; a competition's pick is theirs.

## Market research plan

**Do:** `scope_market` if they name a market, then `draft_plan` with the reasoning and checks (drafting
is free). Show its summary: what they'll learn, each check's reason and cost, what it can't tell, the
total. They approve, change (`draft_plan` again) or drop it. Only on yes: `fund_plan` with `confirm` =
the total, again until every ask is posted. If a tool gives a link or a question to answer, pass it on
and wait. Closing it later is the `manage` skill.

## After posting

Give them the ask's link. Private links, invites and applications: the `invite` skill. Answers,
approvals and closing: the `manage` skill.
