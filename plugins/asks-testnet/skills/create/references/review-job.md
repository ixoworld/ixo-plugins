# A Pro Ask: get an app or agent tried by verified pros

## Do this

1. Call `draft_call` with `kind: "review"` and everything the person already said.
2. It replies with what's missing, each with a question. Ask those one at a time and pass each reply
   back (never re-send what it took). Always ask who may join (below): there is no default.
3. When nothing is missing, read its summary and its one money sentence as they are. Get "yes".
4. Call `post_call` with `slug` and `confirm` = that total. Give the link. Then `link_status`.
5. Then help them invite pros (below).

The person is the **builder**. Verified **pros** try the app on the builder's scenarios and each hands
in a **report**. **Automated checks** read it; the builder's **final approval** pays it. Say "automated
checks", never "the checker" or "the reviewer". A report that fails is not paid. <!-- plain-ok -->

## What `draft_call` asks for

- A title; what is reviewed → `subject { name, version, where }` (a public link); up to 8 scenarios,
  one line each (suggest some); a short intro → `lede`, `brief`.
- **Pay** → `money { entry_each, wanted, extra }`: what each good report pays, how many good reports
  they want, and how many extra (below). There is no fixed limit on reports.
- **Days open** → `open_days`, any number of days.
- **Who may join** → `access`. Always ask, even when they say "invite" or "send it to people": it can't
  be changed once posted. **Ask:** "One link you can share anywhere, like a WhatsApp group or social
  media, or a private link for each person?"
  - One link to share → `access: "apply"`. Any LinkedIn-verified pro who opens it joins at once, until
    the Pro Ask is Filled, so the budget looks after itself. It is never on the board: only its link
    brings pros in. People who aren't verified yet are shown how to verify first.
  - A private link for each person → `access: "invite"`. Only the pros they invite join, each by name
    or with their own link that works once. Invite them after posting.
- **Extra reports.** Every report counts in "N of M reports", even one that isn't good, and it is
  Filled at wanted + extra. **Say:** "Some reports may not be good enough. You don't pay for those, but
  they still count. I suggest your <wanted> plus 3 extra. Money for reports that never come in comes
  back when you close it. Or take exactly <wanted> and add more later. Which?" → `extra` (3, or 0).
- Private things like a test login go in the invitation's note, never in the Pro Ask.

## The money

Read the preview's money sentence as it is. Never work a number out yourself.
With practice money nothing is added on top: each pro gets the pay
they were promised. They pay only for reports they approve; what isn't paid comes back when
they close it. The limit is what one card payment can take ($999,999.99); `draft_call` says so if it is
over.

**Say:** "This sets up the Pro Ask '<title>' for <name> <version>: <n> scenarios, <wanted> good reports
wanted, up to <count> in all, open <days> days, <one link to share anywhere |
only pros you invite>. <the money sentence> Each report waits for your OK before it's paid. Post it?"

## After posting

- **Say:** "Your Pro Ask's page: https://test.asks.world/me/pro-asks/<number>.
  Reports come in there." If the reply gives a link to turn on their checks: "Open this and tap
  **Approve**, so reports wait for your OK."
- Open to any verified pro → **Say:** "Share this one link anywhere, like a WhatsApp group or social
  media: https://test.asks.world/t/<number>. Verified pros join from it until
  it is Filled. No need to make a link for each person."
- **Invite pros:** `find_pro` with `q` (what the Pro Ask needs). **Say** the three to five it gives,
  each with "LinkedIn verified", their rate and their page; they choose. Then `invite_to_call` with the
  chosen @names and the private note (the `invite` skill).
- **A follow-up Pro Ask:** `read_ask` and `call_invites` on the old one, then `draft_call` again with
  the same (or the failed) scenarios, the same pay and the new version. Same kind of money.
- Work that isn't trying an app (a translation, a design) → a private ask with that pro's @name
  ([private.md](private.md)).
