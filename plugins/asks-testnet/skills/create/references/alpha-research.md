# An Alpha ask: market or company research with a sourced report

## Do this

1. Call `list_checkers` quietly. No verifier whose name starts with **Alpha Asks** in the list →
   **Say:** "Alpha research asks aren't available here yet. I can post it as a normal private ask
   instead, with a report. Shall I?" (yes → [private.md](private.md) with `report: true`). Never post
   an Alpha ask without it, and never guess its name: `checker` is its name exactly as listed.
2. Gather the research terms (below), one question at a time, in plain words.
3. **Ask:** "Only people you invite, or anyone who applies and you say yes?" → `access` `"invite"` or
   `"apply"`, plus `invite` ([private.md](private.md)). An Alpha ask is always private: never post one
   open to the board.
4. Read the whole ask back (the preview block below). Get "yes".
5. Call `post_ask` with `checker` (the Alpha verifier's listed name), `research` and the rest, without
   `confirm`; say the total; on "yes" call again with `confirm` = that exact total. Give the link,
   then `link_status`.

An Alpha ask is a paid question about a market or a company, such as "What share of its revenue did
this company make outside the US last year, and from what?" Each person who takes it hands in a
sourced report: every finding points at the evidence behind it. The Alpha verifier checks the report
against the terms; the person gives the final OK, which pays it. The check is free. The pay × people
is set aside when posted; what isn't paid comes back when they close it.

## The research terms (`research`)

Ask only for what they haven't said. Suggest a default where one is shown.

1. "What's the question you want researched?" → `question` (their words, one clear question).
2. "What will you use the findings for?" → `intendedUse`, e.g. "deciding whether to open a sales office
   in Brazil". Reports are research only, never investment advice: say so if they talk about buying
   or selling anything.
3. "Up to what date should the information go?" → `cutoff`, an ISO date and time in UTC
   (`2026-12-01T00:00:00Z`). Nothing after it may be used as evidence. Default: now.
4. "When do you want the reports by?" → `deadline`, the same form, after the cutoff. Default: 7 days
   after the cutoff. Also pass `days` so the ask stays open that long.
5. "What must every report cover?" → `requirements`: 1 to 30 items, each `{ id, text }`. The `id` is
   a short lowercase slug (`revenue-split`, `top-competitors`); the `text` is the rule in their words.
   Suggest 3 to 6 from the question; read them back.
6. "How many separate sources should each report stand on?" → `minIndependentSources`, 1 to 10.
   Default: 3. Copies of the same article count as one.
7. `processors`: which AI may read the evidence. Default `["cloudflare-workers-ai"]`, the one the
   Alpha verifier uses; without it, nothing can be checked. **Say:** "The evidence is read by an AI to
   check it. OK?"
8. "Who may see the reports?" → `access`: `"private"` (only them; the default), `"public"` (anyone),
   or `"licensed"` (shared under the sources' licences). Only with `"public"` can the check settle
   the sources' rights by itself; otherwise their own OK settles it.
9. `approval`: who accepts a report the check passes. Recommend `"asker"` (they read each report and
   give the final OK, which pays it); `"automatic"` pays with no look from them. Pass `"asker"` unless
   they say otherwise.

Then the ask itself ([post-an-ask.md](post-an-ask.md)): `task` (the question plus what a report must
contain, in their words), `title`, `pay` per approved report, `quota` (how many reports), `days`.
Every text is at most 4,000 characters, and the terms together at most 32 kB: a refusal that says so
means shorter requirements.

## What people agree to

Before they confirm, **Say** once: "Everyone who hands in a report will confirm four things: it's
research only, not investment advice; it holds no inside or confidential information; they have the
right to share their sources; and the evidence may be read by the AI we named. Only you, the people
you invite and the verifier can open the ask or read its reports."

## A price, if they ask

They don't know what to pay → a free estimate from their own numbers. Ask for the hours they think a
report takes and an hourly rate with a public web page that backs it (`https://…`), then POST JSON to
https://alpha-oracle-testnet.ixo-api.workers.dev/alpha/v2/advise
(no sign-in): `{ "question", "approach", "sources": [], "criteria": [the requirements' texts],
"estimatedHours", "hourlyRateCents", "rateSource" }`. It returns a short checklist and
`pricing.estimate.cents` = hours × rate. **Say:** "From your own numbers, <hours> hours at $<rate> an
hour comes to about $<total> a report. It's an estimate, not a market rate; the pay is yours to set."
Without hours and a rate it gives the checklist only. Never call it a quote.

## The preview

**Say:** "This posts '<title>' as an Alpha research ask for <n> reports, paying <pay> each, open
<days> days, <only people you invite | people you approve>. Question: <question>. Each report must
cover: <the requirements, one line each>, on at least <n> separate sources, with nothing after
<cutoff date>, due <deadline date>. Only you see the reports. You give the final OK on each report,
which pays it. It costs <total> in all (<real / practice> money). OK?"

## Refusals

- "research terms are for Alpha Asks market research only" → `research` was passed with another
  verifier or none: pass `checker` = the Alpha verifier's listed name.
- "checks market research against the ask's research terms, and posts nothing without them" →
  `research` is missing: gather it (above).
- "the research terms are not complete: <field>: <why>" → fix that one field (a deadline before the
  cutoff, a repeated `id`, an `id` with capitals or spaces, a date not in UTC) and call again.
- "the research terms come to <n> kB" → shorten the requirements.
- `ask_the_world` refuses the Alpha verifier: an Alpha ask is always `post_ask`.
- Everything else as [post-an-ask.md](post-an-ask.md).

Reports and the final OK: the `manage` skill (`collect_answer`, then their tap on the report's page).
