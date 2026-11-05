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
- **Who completes it:** only pros whose page is verified with LinkedIn: just the ones they invite, or any
  verified pro who has the link (they choose, below). The tick means only that they logged in to that
  LinkedIn account: no background check, no ranking.
- **Money:** pay per report × reports is **set aside** when posted, with what asks.world keeps; read the
  preview's money sentence as it is. What isn't paid comes back when they close it. Real money and
  practice money both.
- **Judged:** Asky Pro Checker, the verifier, checks each report; then the builder's final approval.
  A report that fails is not paid; there is no "needs changes" step and no payment in stages. Reports,
  files and messages are private to the builder, the pro and the automated checks.
- **"Review" means three things.** A pro ask (this); the verifier's check of any completion; a company's
  review budget, which pays for checks ([company.md](company.md)).

## Set it up

Signed in first (`connect` skill).

**Do:** `draft_call` with `kind: "review"` and what the person already said. Its response lists what is missing, each with the question to ask: ask those one at
a time and pass each reply back (never re-send what it took). Usually:

1. A title.
2. What is reviewed → `subject { name, version, where }` (a public link).
3. The scenarios to try, one line each, up to 8 → `scenarios`. Suggest some.
4. A short intro and the story behind it → `lede`, `brief`, in their words.
5. Pay → `money { entry_each, wanted, extra }`: what each good report pays, how many good reports they
   want, and how many extra in case some aren't good (below). `entry_up_to` is optional; if given, it
   must be wanted + extra.
6. Days open → `open_days`.

**Who may join. Ask:** "Only pros you invite, or any verified pro who has the link?"

- **Only pros I invite** (the default): leave out `access`. Who to invite comes after posting.
- **Any verified pro with the link:** `access: "apply"`. A pro with a LinkedIn-verified page joins at
  once from the link, with no application; each report still waits for the person's final approval. It
  is on no board: only its link brings pros to it, so they can share it anywhere.

**Extra reports.** Every report that comes in counts in its "N of M reports", even one that isn't good,
and it is Filled at M (wanted + extra). **Say:** "Some reports may not meet your requirements. You don't
pay for those, but each one still counts. I suggest <wanted + 3> reports: your <wanted> plus 3 extra, so
a few weak reports don't block good pros. You only pay for the reports you approve, and money for
reports that never come in comes back when you close it. Or I can take exactly <wanted>, and you add
more reports later if it fills. Which do you prefer?" → `extra` (3, or 0).

Optional `report`: extra sections every report must have. **Say:** "Anything private, like a test
login, goes in the private note with each invitation. Only the invited pro sees it."

## Preview and post

When nothing is missing, `draft_call` shows the whole pro ask and one sentence for its money. Read that
sentence as it is and repeat its numbers exactly; never work one out yourself. **Say:** "This sets up
the pro ask '<title>' of <name> <version>: <n> scenarios, <wanted> good reports wanted and up to
<count> in all, open for <days> days, <by invitation | open to any verified pro with the link>. <the money sentence> <total> in all (<real / practice> money). Each
report waits for your final approval before it's paid. Post it?" On yes: `post_call` with `confirm` =
that total. It gives one link to tap (the `create` skill's money rule); the page posts everything in a
row after that one tap. Then `read_ask` says it's live.

Over the limit one ask can hold? `draft_call` says so and names what fits. Never ask for a yes on those
terms. **Say:** "That's more than one pro ask can hold. I can make it <what fits, e.g. 5 reports at $8
each> instead. Which?" and draft again with their choice.

**After posting, Say**, one step at a time: its page, only theirs
(https://asks.world/me/pro-asks/<number>), where reports come in and are approved; if there's a link to turn on their
checks, "Open this link and tap **Approve**, so reports wait for your final approval."
Open to any verified pro? **Say:** "Share this link anywhere: https://asks.world/t/<number>.
Verified pros join from it."

## Invite pros

**Do:** `find_pro` (with `q` for what the pro ask needs, e.g. Android, payments). **Say** the three to five it suggests, each with "LinkedIn verified", their
rate and their page; nothing ranks them, the person chooses. Want to browse? "All the pros are at
https://asks.world/pros". `find_pro` with `handle` reads a pro
they name by @name. Then the `invite` skill: `invite_to_call` with the chosen @names (or `"link"` once
per private link) and the private note. **Say** for links: "Send each of these to one pro, privately."

## A follow-up pro ask

`read_ask` and `call_invites` on the old one, then `draft_call` with `kind: "review"`, the same (or the failed) scenarios, the same pay, and the new version and link; invite the
same pros after it posts.

A follow-up stays where the first pro ask was: real money or practice money.
