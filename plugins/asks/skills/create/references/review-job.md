# A pro ask: get an app or agent tried by verified pros

The person (the **builder**) invites real **pros** to try their app, website or agent on scenarios
they list. Each pro hands in a **report**; **automated checks** read it against the pro ask's
requirements; the builder's **final approval** pays it. Say "automated checks", never "the checker" or <!-- plain-ok -->
"the reviewer". <!-- plain-ok -->

- **Pick it when:** they want people who do this for a living to test their app or agent and say where
  it fails, with screenshots and steps to see each problem again.
- **Not when:** a cheaper first signal from anyone → an ask ([post-an-ask.md](post-an-ask.md)); work
  that isn't trying an app (a translation, a design, research) → a private ask with that pro's @name
  ([private.md](private.md)).
- **Hiring a particular pro:** there is no direct hire. Post a pro ask, then invite them by @name
  (below). Not to confuse with an open call's "hiring", which pays every passing entry.
- **Who answers:** only pros they invite whose page is verified with LinkedIn and open to work. The
  tick means only that they logged in to that LinkedIn account: no background check, no ranking.
- **Money:** pay per report × reports is **set aside** when posted, with what asks.world keeps; read the
  preview's money sentence as it is. What isn't paid comes back when they close it. Real money and
  practice money both.
- **Judged:** Asky Pro Checker, the verifier, checks each report; then the builder's final approval.
  A report that fails is not paid; there is no "needs changes" step and no payment in stages. Reports,
  files and messages are private to the builder, the pro and the automated checks.
- **"Review" means three things.** A pro ask (this); the verifier's check of any answer; a company's
  review budget, which pays for checks ([company.md](company.md)).

## Set it up

Connected first (`connect` skill, with `reviews: true` on `get_connect_link`).

**Do:** `draft_call` with `kind: "review"` and what the person already said. Its answer lists what is missing, each with the question to ask: ask those one at
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
the pro ask '<title>' of <name> <version>: <n> scenarios, up to <count> reports,
open for <days> days, by invitation. <the money sentence> <total> in all (<real / practice> money). Each
report waits for your final approval before it's paid. Post it?" On yes: `post_call` with `confirm` =
that total, again until it says everything is posted.

Over the limit one ask can hold? `draft_call` says so and names what fits. Never ask for a yes on those
terms. **Say:** "That's more than one pro ask can hold. I can make it <what fits, e.g. 5 reports at $8
each> instead. Which?" and draft again with their choice.

If posting is refused with an offer to post from your assistant's own key instead, nothing happens
until they agree. **Say:** "asks.world can't take this from your account here. Instead you'd first move
<shortfall> to my own account on this computer and I'd post from there. Then the automated checks decide each report
alone and you don't give final approval. Do that?" Only on yes: give the one way to move the money,
wait until `my_status` shows it, then post with `plain_key: true`. Never choose it silently.

**After posting, Say**, one step at a time: its page, only theirs
(https://asks.world/me/pro-asks/<number>), where reports come in and are approved; if there's a link to turn on their
checks, "Open this link and tap **Approve**, so reports wait for your final approval."

## Invite pros

**Do:** `find_pro` (with `q` for what the pro ask needs, e.g. Android, payments). **Say** the three to five it suggests, each with "LinkedIn verified", their
rate and their page; nothing ranks them, the person chooses. Want to browse? "All the pros are at
https://asks.world/pros" (in the sandbox: https://test.asks.world/pros). `find_pro` with `handle` reads a pro
they name by @name. Then the `invite` skill: `invite_to_call` with the chosen @names (or `"link"` once
per private link) and the private note. **Say** for links: "Send each of these to one pro, privately."

## A follow-up pro ask

`read_ask` and `call_invites` on the old one, then `draft_call` with `kind: "review"`, the same (or the failed) scenarios, the same pay, and the new version and link; invite the
same pros after it posts.

A follow-up stays on the network the first pro ask was on.
