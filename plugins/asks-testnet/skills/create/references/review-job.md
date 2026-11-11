# A Pro Ask: verified pros do the work, and you OK each report

## Do this

1. **Ask** which kind, unless they've said: "Is this any kind of work, or market research checked by
   Alpha?"
   - **Any work** (checked by Asky Pro Checker) → `draft_call` with `kind: "review"` and everything the
     person already said.
   - **Market research, checked by Alpha** → `draft_call` with `kind: "review"` and `research`
     (below). No `subject` or scenarios needed.
2. It replies with what's missing, each with a question. Ask those one at a time and pass each reply
   back (never re-send what it took). Always ask who may join (below): there is no default.
3. When nothing is missing, read its summary and its one money sentence as they are. Get "yes".
4. Call `post_call` with `slug` and `confirm` = that total. Give the link. Then `link_status`.
5. Then help them invite pros (below).

The person is the **builder**. Verified **pros** do the work (for example, try an app on the builder's
scenarios) and each hands in a **report**. **Automated checks** read it; the builder's **final approval** pays it. Say "automated
checks", never "the checker" or "the reviewer". A report that fails is not paid. <!-- plain-ok -->

## What `draft_call` asks for

- A title; what the work is on (for example an app) → `subject { name, version, where }` (a public link); up to 8 scenarios,
  one line each (suggest some); a short intro → `lede`, `brief`.
- **Pay** → `money { entry_each, wanted, extra }`: what each good report pays, how many good reports
  they want, and how many extra (below). There is no fixed limit on reports.
- **Days open** → `open_days`, any number of days.
- **Who may join** → `access`. **Ask:** "Only pros you invite, or any verified pro who has the link?"
  - Only pros I invite → `access: "invite"`. Invite them after posting.
  - Any verified pro with the link → `access: "apply"`. A LinkedIn-verified pro joins at once from the
    link. It is never on the board: only its link brings pros in.
- **Extra reports.** Every report counts in "N of M reports", even one that isn't good, and it is
  Filled at wanted + extra. **Say:** "Some reports may not be good enough. You don't pay for those, but
  they still count. I suggest your <wanted> plus 3 extra. Money for reports that never come in comes
  back when you close it. Or take exactly <wanted> and add more later. Which?" → `extra` (3, or 0).
- Private things like a test login go in the invitation's note, never in the Pro Ask.

## Market research, checked by Alpha (`research`)

The brief is the same as on a public Alpha ask: ask the three questions and confirm the defaults
exactly as in [alpha-research.md](alpha-research.md) (what it's for → `intendedUse`; what each report
must cover → `requirements`; sources default to "Also their own research", at least 1 source each,
said out loud and confirmed, never hidden). The differences:

- **No due date question.** Reports are due when the Pro Ask closes: ask the days open → `open_days`.
  Never pass `deadline`.
- "Use only info from before" defaults to when it's priced (leave `cutoff` out); a date they give
  can't be in the future.
- `question` defaults to the title. Leave `processors` and `approval` out: they give the final OK.
- The brief can be read by everyone the Pro Ask lets in; keep private details out.
- **Say** once before the preview: "Researchers agree to 4 rules before sending (not investment
  advice, no insider info, the right to share sources, OpenAI's AI may read the evidence)." It's
  research only, never investment advice.
- "Alpha Pro Asks aren't available on this network yet" → **Say:** "Hidden market research isn't open
  here yet. I can post it as a public Alpha ask instead: listed on the board, $1 per report checked.
  Shall I?" (yes → [alpha-research.md](alpha-research.md)).
- The free Alpha check works only on a Pro Ask. A refusal saying "draft it with `draft_call` and
  research instead" → do that.

## The money

Read the preview's money sentence as it is. Never work a number out yourself.

**Any work:**
With practice money nothing is added on top: each pro gets the pay
they were promised. They pay only for reports they approve; what isn't paid comes back when
they close it. The limit is what one card payment can take ($999,999.99); `draft_call` says so if it is
over.

**Market research, checked by Alpha:** the Alpha check is free. With practice money nothing is added on top. Nothing is
paid without their OK.

**Say:** "This sets up the Pro Ask '<title>' for <name> <version>: <n> scenarios, <wanted> good reports
wanted, up to <count> in all, open <days> days, <only pros you invite | any verified pro with the
link>. <the money sentence> Each report waits for your OK before it's paid. Post it?" For market
research, say the brief's lines (each report must cover …) in place of the name and scenarios.

## After posting

- **Say:** "Your Pro Ask's page: https://test.asks.world/me/pro-asks/<number>.
  Reports come in there." If the reply gives a link to turn on their checks: "Open this and tap
  **Approve**, so reports wait for your OK."
- Open to any verified pro → **Say:** "Share this link anywhere: https://test.asks.world/t/<number>.
  Verified pros join from it."
- **Invite pros:** `find_pro` with `q` (what the Pro Ask needs). **Say** the three to five it gives,
  each with "LinkedIn verified", their rate and their page; they choose. Then `invite_to_call` with the
  chosen @names and the private note (the `invite` skill).
- **A follow-up Pro Ask:** `read_ask` and `call_invites` on the old one, then `draft_call` again with
  the same (or the failed) scenarios, the same pay and the new version. Same kind of money.
