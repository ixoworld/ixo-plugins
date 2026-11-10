# An Alpha ask: market or company research with a sourced report

**Say** first, in one line: "A researcher sends a report. Our AI checks it against your brief ($1 each).
You read it, and your OK pays them."

## Do this

1. Call `list_checkers` quietly. No verifier whose name starts with **Alpha Asks** in the list →
   **Say:** "Alpha research asks aren't available here yet. I can post it as a normal private ask
   instead, with a report. Shall I?" (yes → [private.md](private.md) with `report: true`). Never post
   an Alpha ask without it, and never guess its name: `checker` is its name exactly as listed.
2. Ask the three questions below, one at a time, then confirm the defaults in one line.
3. **Ask** which of three ways:
   - "Invite pros you choose (Market Pros)" → `access: "invite"`, plus `invite` ([private.md](private.md)).
     If they ask: "You pick the researchers and invite them."
   - "Let people apply, you pick (Market Calls)" → `access: "apply"`; they may add `invite` for people
     let in at once. If they ask: "Researchers apply, and you choose who takes it."
   - "Open to anyone who meets your requirements (Ask the Market)" → no `access`. If they ask: "It's
     listed on the board, and anyone verified with LinkedIn can send one report."

   **Say** on every route: "Only you and the Alpha check see the reports." On the open one also
   **Say:** "It's $1 per report checked, even one that's turned down, up to the number of reports you
   pay for."
4. Read the whole ask back (the preview below). Get "yes".
5. Call `post_ask` with `checker` (the Alpha verifier's listed name), `research` and the rest, without
   `confirm`; say the total; on "yes" call again with `confirm` = that exact total. Give the link,
   then `link_status`.

The ask's text is the question: put it in `task` (with `title`, `pay` per approved report, `quota`
reports and `days`, as in [post-an-ask.md](post-an-ask.md)) and leave `question` out; the connector
copies it from `task`. Never ask for the question separately. The pay and the $1 check, × reports, are
set aside when posted; what isn't paid comes back when they close it.

## The three questions (`research`)

Ask only what they haven't said.

1. "What will you use it for?" → `intendedUse`. If they ask why: "Helps the researcher focus. Only you
   and the researcher see it." It's research only, never investment advice: say so if they talk about
   buying or selling anything.
2. "What must each report answer?" → `requirements`: 1 to 30 items, each `{ id, text }`; <!-- plain-ok -->
   `id` a short lowercase slug (`revenue-split`), `text` the line in their words. Suggest 3 to 6 from
   the ask and read them back. If they ask: "The AI checks each report covers every line. Keep each
   one short and clear."
3. "When do you want reports by?" Offer 3 days, 1 week (the default), 2 weeks, or a date. Talk in
   their local time; never say "UTC". 1 week → leave `deadline` out. Otherwise `deadline` = that moment
   in UTC (`2026-12-01T17:00:00Z`). Pass `days` the same length (7 for 1 week). If they ask: "The day
   researchers must send their reports by."

Then **confirm** the defaults in one go, never hiding them: "Reports use only info from before the
moment you post, with at least 1 source each. Researchers can use free websites and their own
research, like interviews and notes (recommended). OK, or free websites only, or also paid reports?"
Change one only on request:

- **Where the researcher gets information** (`research.access`; the sources, not the way they pick in
  step 3). Default "Also their own research" (leave it out; the connector sets `"private"`). If they
  ask what the choices mean, add "Reports stay private to you either way." and give these lines:
  - **Free websites only:** "News, company sites, public data anyone can open. Every fact can be
    checked by anyone." → `access: "public"`
  - **Also their own research:** "Adds interviews, calls, photos and notes the researcher can share.
    Best for most asks." → `"private"`
  - **Also paid reports:** "Adds paid databases or reports the researcher is allowed to use." →
    `"licensed"`
- **"Use only info from before"**: default now (leave `cutoff` out). A date → `cutoff` in UTC, before
  the deadline. If they ask: "Nothing published after this may be used, so every report works from
  the same facts."
- **Sources per report**: default 1 (leave `minIndependentSources` out); 1 to 10. If they ask: "How
  many separate sources each report must stand on. Copies of the same article count as one."

Leave `processors` and `approval` out (the connector sets OpenAI and their own final OK).

**Say** once before the preview: "Researchers agree to 4 rules before sending (not investment advice,
no insider info, the right to share sources, OpenAI's AI may read the evidence)." The full list only
if they ask: research only, not investment advice; no inside or confidential information; the right
to share their sources; the evidence may be read by OpenAI's AI.

Every text is at most 4,000 characters and the brief at most 32 kB.

## A price, if they ask

They don't know what to pay → a free estimate from their own numbers. Ask for the hours they think a
report takes and an hourly rate with a public web page that backs it (`https://…`), then POST JSON to
https://alpha-oracle-mainnet.ixo-api.workers.dev/alpha/v2/advise
(no sign-in): `{ "question", "approach", "sources": [], "criteria": [the requirements' texts],
"estimatedHours", "hourlyRateCents", "rateSource" }`. It returns a short checklist and
`pricing.estimate.cents` = hours × rate. **Say:** "From your own numbers, <hours> hours at $<rate> an
hour comes to about $<total> a report. It's an estimate, not a market rate; the pay is yours to set."
Without hours and a rate it gives the checklist only. Never call it a quote.

## The preview

**Say:** "This posts '<title>' as an Alpha research ask for <n> reports, paying <pay> each, open
<days> days, <only pros you invite | people who apply and you pick | open to anyone verified with
LinkedIn>. Each report must cover: <the lines, one each>. Information: <Free websites only | Also
their own research | Also paid reports>, at least <n> source(s), only info from before <cutoff, their
local time>, due <deadline, their local time>. Only you and the Alpha check see the reports. You give
the final OK on each report, which pays it. The check is $1 per report, on top of the pay<, even one
it turns down (open asks)>. It costs <total> in all (<real / practice> money). OK?"

## Refusals

Fix it, then tell them in plain words; never read the refusal out.

- "research terms are for Alpha Asks market research only" → pass `checker` = the Alpha verifier's
  listed name.
- "checks market research against the ask's research terms, and posts nothing without them" → the
  brief is missing: ask the three questions.
- "the research terms are not complete: <field>: <why>" → fix that field and call again. A due date before the "use only info from before" date → **Say:** "The due
  date has to come after that date. Which do you want to move?" A repeated or badly formed `id` → fix
  it quietly.
- "the research terms come to <n> kB" → **Say:** "The brief is too long. Shall I shorten the lines
  each report must cover?"
- "a report on an Alpha Asks research ask is paid research and must not be public" → **Say:** "This
  site doesn't take open research asks yet. Invite pros you choose, or let people apply and you pick?"
  and pass `"invite"` or `"apply"`.
- `ask_the_world` refuses the Alpha verifier: an Alpha ask is always `post_ask`.
- Everything else as [post-an-ask.md](post-an-ask.md).

Reports and the final OK: the `manage` skill (`collect_answer`, then their tap on the report's page).
