# A pro ask: get an app or agent reviewed by LinkedIn-verified pros

The person (the **builder**) wants real **pros** to try their app, website or agent. The builder
picks a **Zone** to run it first; any pro with a LinkedIn-verified page can be invited. Each pro hands in a **report**; **automated checks** read it against the
pro ask's requirements; the builder's **final approval** pays it. Say "automated checks", never "the
checker" or "the reviewer". <!-- plain-ok -->

What is true (never promise more): a pro ask is by invitation only; a report that passes waits for the
builder's final approval, which pays it; one that fails is not paid; there is no "needs changes" step
and no payment in stages. **LinkedIn verified** on a pro means only that they logged in to that
LinkedIn account; it is not a background check and ranks nobody higher. Asky Pro Checker, the
verifier, checks each report. On a private pro ask only the builder, the pro and the automated checks
can read a report on the site.

## Set it up

Pro asks run on both networks: `mainnet` for real money, `testnet` (the sandbox) for a dry run with
practice money. Use the network the person picked (the `asks` skill's rule: ask once if they haven't said)
on every call here.

Connected first (`connect` skill, with `reviews: true` on `get_connect_link`).

**The marketplace first. Do:** `list_marketplaces`. **Ask**, even when there is only one: "Which
Zone should run it? <each by name, in a line>."

**Do:** `draft_call` with `kind: "review"`, `sponsor` (the chosen Zone's slug) and what the
person already said. Its answer lists what is missing, each with the question to ask: ask those one at
a time and pass each answer back (never re-send what it took). Usually:

1. A title.
2. What is reviewed → `subject { name, version, where }` (a public link).
3. The scenarios to try, one line each, up to 8 → `scenarios`. Suggest some.
4. A short intro and the story behind it → `lede`, `brief`, in their words.
5. Pay → `money { entry_each, entry_up_to }`.
6. Days open → `open_days`.

Never pass `access`: a pro ask is by invitation only. Who to invite comes after posting.

Optional `report`: extra sections every report must have. **Say:** "Anything private, like a test
login, goes in the private note with each invitation. Only the invited pro sees it."

## Preview and post

When nothing is missing, `draft_call` shows the whole pro ask and one sentence for its money. Read that
sentence as it is and repeat its numbers exactly; never work one out yourself. **Say:** "This sets up
the pro ask '<title>' of <name> <version> through <Zone>: <n> scenarios, up to <count> reports,
open for <days> days, by invitation. <the money sentence> <total> in all (<real / practice> money). Each
report waits for your final approval before it's paid. Post it?" On yes: `post_call` with `confirm` =
that total, again until it says everything is posted.

Over the limit one ask can hold? `draft_call` says so and names what fits. Never ask for a yes on those
terms. **Say:** "That's more than one pro ask can hold. I can make it <what fits, e.g. 5 reports at $8
each> instead. Which?" and draft again with their choice.

If the Zone is refused (paused, or it can't take pro asks here yet), nothing was posted: say why
in the tool's plain words and offer another Zone from `list_marketplaces`.

If posting is refused with an offer to post from your assistant's own key instead, nothing happens
until they agree. **Say:** "asks.world can't take this from your account here. Instead you'd first move
<shortfall> to my own account on this computer and I'd post from there. Then the automated checks decide each report
alone and you don't give final approval. Do that?" Only on yes: give the one way to move the money,
wait until `my_status` shows it, then post with `plain_key: true`. Never choose it silently.

**After posting, Say**, one step at a time: the pro ask's page link; if there's a link to turn on their
checks, "Open this link and tap **Approve**, so reports wait for your final approval."

## Invite pros

**Do:** `find_pro` with the same `sponsor` (and `q` for what the pro ask needs, e.g. Android,
payments). **Say** the three to five it suggests, each with "LinkedIn verified", their
rate and their page; nothing ranks them, the person chooses. Want to browse? "All the pros are at
https://asks.world/pro/pros" (in the sandbox: https://test.asks.world/pro/pros). `find_pro` with `handle` reads a pro
they name by @name. Then the `invite` skill: `invite_to_call` with the chosen @names (or `"link"` once
per private link) and the private note. **Say** for links: "Send each of these to one pro, privately."

## A follow-up pro ask

`read_ask` and `call_invites` on the old one, then `draft_call` with `kind: "review"`, the same
Zone, the same (or the failed) scenarios, the same pay, and the new version and link; invite the
same pros after it posts.

A follow-up stays on the network the first pro ask was on.
