# A Pro Ask: verified pros do the work, and you OK each report

## Do this

1. Pick the kind from what they said: a question about a market, a company or customers is market
   research; anything else is any work. Only when you really can't tell, **ask:** "Is this research
   into a market, or some other work?"
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
  one line each (suggest some); a short intro → `lede`, `brief`. Scenarios about a screen: see
  [brief.md](brief.md), "Questions about a screen".
- **Pay** → `money { entry_each, wanted, extra }`: what each good report pays, how many good reports
  they want, and how many extra (below). There is no fixed limit on reports.
- **Days open** → `open_days`, any number of days.
- **Who may join** → `access`. Default: one secret link for everyone, `access: "apply"`. Always explain
  both and get their yes before posting: it can't be changed after. **Say:** "Who can join? One secret
  link for everyone (suggested): you share it anywhere, like a WhatsApp group. Anyone who has the link
  can join (LinkedIn-checked pros with a pro page). People without the link see nothing. Or only people
  you invite: each invitation link works for one person. This can't be changed after posting. One
  secret link for everyone?"
  - One secret link for everyone (default) → `access: "apply"`. A LinkedIn-checked pro with a pro page
    joins at once from it, and can read the brief first. It is never on the board: only its link brings
    pros in.
  - Posting a private Pro Ask needs a Google or email sign-in on asks.world.
  - Only if they want just people they pick → `access: "invite"`. Each invitation link works for one
    person. Invite them after posting.
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
  here yet. I can post it as a public Alpha ask instead: listed on the board, with a check fee per report
  checked. Shall I?" (yes → [alpha-research.md](alpha-research.md)).
- The free Alpha check works only on a Pro Ask. A refusal saying "draft it with `draft_call` and
  research instead" → do that.

## The money

Read the preview's money sentence as it is. Never work a number out yourself.

**Any work:** the AI check is free. The extra cost is a share for the network that runs Asks, on top, so
each pro gets exactly the pay they were promised; the preview shows the share and the total before they
pay. They pay only for reports they approve; what isn't paid comes back when they close it. If the
total is more than one card payment can take, `draft_call` says so.

**Market research, checked by Alpha:** the Alpha check is free too, and the same network share is
added on each report they approve, so the researcher gets the full price. Nothing is paid without their OK.

**Say:** "This sets up the Pro Ask '<title>' for <name> <version>: <n> scenarios, <wanted> good reports
wanted, up to <count> in all, open <days> days, <one secret link for everyone you share it with | only pros you invite, one link per person>, which can't be
changed after posting. <the money sentence> Each report waits for your OK before it's paid. Post it?" For market
research, say the brief's lines (each report must cover …) in place of the name and scenarios.

## After posting

- **Say:** "Your Pro Ask's page: https://test.asks.world/me/pro-asks/<number>.
  Reports come in there." If the reply gives a link to turn on their checks: "Open this and tap
  **Approve**, so reports wait for your OK."
- One secret link for everyone → hand over its `/j/…` link from `link_status`, `my_pro_asks`,
  `call_invites` or `my_status`, never the `/t/<number>` page. **Say:** "Share this one link with everyone, like a
  WhatsApp group: <the /j/ link>. Anyone who has it can join (LinkedIn-checked pros with a pro page);
  people without it see nothing. It's emailed to you too." Not there yet: "It's being made; ask me
  again in a minute."
- Invite-only → **Say:** "Only people you invite can join. Each invitation link works for one person.
  I can also turn on one secret link for a whole group." On a yes: the `invite` skill, "The secret link".
- **Invite pros:** `find_pro` with `q` (what the Pro Ask needs). **Say** the three to five it gives,
  each with "LinkedIn verified", their rate and their page; they choose. Then `invite_to_call` with the
  chosen @names and the private note (the `invite` skill).
- **A follow-up Pro Ask:** `read_ask` and `call_invites` on the old one, then `draft_call` again with
  the same (or the failed) scenarios, the same pay and the new version. Same kind of money.
