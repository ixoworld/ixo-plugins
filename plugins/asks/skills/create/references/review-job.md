# A review job: get an app or agent reviewed by specialists

The person (the **builder**) wants real **specialists** to try their app, website or agent. Each
specialist hands in a **report**; **automated checks** read it against the review's requirements; the
builder's **final approval** pays it. Say "automated checks", never "the checker" or "the reviewer".

What is true (never promise more): a report that passes waits for the builder's final approval, which
pays it; one that fails is not paid; there is no "needs changes" step and no payment in stages.
**Checked by IXO** on a specialist means IXO checked their experience; it is not a background check and
ranks nobody higher. On a private review only the builder, the specialist and the automated checks can
read a report on the site.

## Set it up

Connected first (`connect` skill, with `reviews: true` on `get_connect_link`).
**Do:** `draft_call` with `kind: "review"` and what the person already said. Its answer lists what is
missing, each with the question to ask: ask those one at a time and pass each answer back (never
re-send what it took). Usually:

1. A title.
2. What is reviewed → `subject { name, version, where }` (a public link).
3. The scenarios to try, one line each, up to 8 → `scenarios`. Suggest some.
4. A short intro and the story behind it → `lede`, `brief`, in their words.
5. Pay → `money { entry_each, entry_up_to }`.
6. Days open → `open_days`.
7. Who takes part: **only people you invite** (`access: "invite"`, the default) or **people apply and
   you say yes** (`access: "apply"`). Never open to everyone.
8. Who to invite now → `invite`: @names, or `"link"` once per private link. `find_hand` reads a
   specialist by @name.

Optional `report`: extra sections every report must have. **Say:** "Anything private, like a test
login, goes in the private note with each invitation. Only the invited specialist sees it."

## Preview and post

When nothing is missing, `draft_call` shows the whole review and the total. **Say:** "This sets up the
review '<title>' of <name> <version>: <n> scenarios, up to <count> reports at <pay> each, open for
<days> days, by invitation. It costs <total> in total (<real / play> money). Each report waits for your
final approval before it's paid. Post it?" On yes: `post_call` with `confirm` = that total, again until
it says everything is posted.

If posting is refused with an offer to post from Claude's own wallet instead, nothing happens until they
agree. **Say:** "asks.world can't take this from your account here. Instead you'd first move
<shortfall> to Claude's own wallet and I'd post from there. Then the automated checks decide each report
alone and you don't give final approval. Do that?" Only on yes: give the one way to move the money,
wait until `my_status` shows it, then post with `plain_key: true`. Never choose it silently.

**After posting, Say**, one step at a time: the review's page link; if there's a link to turn on their
checks, "Open this link and tap **Approve**, so reports wait for your final approval."; each private
invite link, "Send each of these to one specialist, privately."

## A follow-up review

`read_ask` and `call_invites` on the old one, then `draft_call` with `kind: "review"`, the same (or the
failed) scenarios, the same specialists, the same pay, and the new version and link.

If it's refused on mainnet because reviews aren't offered there, offer a dry run on testnet.
