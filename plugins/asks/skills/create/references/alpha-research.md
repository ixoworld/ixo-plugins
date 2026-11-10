# An Alpha ask: market or company research with a sourced report

## Do this

1. Call `list_checkers` quietly. No verifier whose name starts with **Alpha Asks** in the list →
   **Say:** "Alpha research asks aren't available here yet. I can post it as a normal private ask
   instead, with a report. Shall I?" (yes → [private.md](private.md) with `report: true`). Never post
   an Alpha ask without it, and never guess its name: `checker` is its name exactly as listed.
2. Gather the research terms (below), one question at a time, in plain words.
3. **Ask** which of three ways, in these words:
   - "Invite pros you choose (Market Pros)" → `access: "invite"`, plus `invite` ([private.md](private.md)).
   - "Let people apply, you pick (Market Calls)" → `access: "apply"`; they may add `invite` for people
     let in at once.
   - "Open to anyone who meets your requirements (Ask the Market)" → no `access`. Anyone verified with
     LinkedIn may send one report; it's listed on the board.

   **Say** on every route: "Only you and the Alpha check see the reports, whichever way you pick." On
   the open one also **Say:** "Each report checked costs $1, even one that's turned down, up to the
   number of reports you pay for. Only people verified with LinkedIn can send one, one each."
4. Read the whole ask back (the preview block below). Get "yes".
5. Call `post_ask` with `checker` (the Alpha verifier's listed name), `research` and the rest, without
   `confirm`; say the total; on "yes" call again with `confirm` = that exact total. Give the link,
   then `link_status`.

An Alpha ask is a paid question about a market or a company, such as "What share of its revenue did
this company make outside the US last year, and from what?" Each person who takes it hands in a
sourced report: every finding points at the evidence behind it. The Alpha verifier runs its checks
when a report arrives; the person gives the final OK, which pays it. The check costs $1 per report. The pay
and the check, × people, are set aside when posted; what isn't paid comes back when they close it.

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
7. `processors`: which AI may read the evidence. Default `["openai"]`, the one the Alpha verifier
   uses; without it, the verifier refuses the ask. **Say:** "The evidence may be read by OpenAI's AI to
   check it. OK?"
8. "Which sources may a report use?" → `access` (the sources, not who reads the reports; that is the
   ask's own `access` in step 3): `"private"` (private sources too; the default), `"public"` (only
   sources anyone can open), or `"licensed"` (licensed or paid sources). Only with `"public"` can the
   check settle the sources' rights by itself; otherwise their own OK settles it.
9. `approval`: always `"asker"`: they read each report the check passes and give the final OK, which
   pays it.

Then the ask itself ([post-an-ask.md](post-an-ask.md)): `task` (the question plus what a report must
contain, in their words), `title`, `pay` per approved report, `quota` (how many reports), `days`.
Every text is at most 4,000 characters, and the terms together at most 32 kB: a refusal that says so
means shorter requirements.

## What people agree to

Before they confirm, **Say** once: "Everyone who hands in a report will confirm four things: it's
research only, not investment advice; it holds no inside or confidential information; they have the
right to share their sources; and the evidence may be read by OpenAI's AI. Only you and the
verifier can read the reports, on every route."

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
LinkedIn>. Question: <question>. Each report must
cover: <the requirements, one line each>, on at least <n> separate sources, with nothing after
<cutoff date>, due <deadline date>. Only you see the reports. You give the final OK on each report,
which pays it. The Alpha check costs $1 per report, on top of the pay<, even a report it turns down
(open asks)>. It costs <total> in all (<real / practice> money). OK?"

## Refusals

- "research terms are for Alpha Asks market research only" → `research` was passed with another
  verifier or none: pass `checker` = the Alpha verifier's listed name.
- "checks market research against the ask's research terms, and posts nothing without them" →
  `research` is missing: gather it (above).
- "the research terms are not complete: <field>: <why>" → fix that one field (a deadline before the
  cutoff, a repeated `id`, an `id` with capitals or spaces, a date not in UTC) and call again.
- "the research terms come to <n> kB" → shorten the requirements.
- "a report on an Alpha Asks research ask is paid research and must not be public" → this site does
  not take open Alpha asks yet: offer "Invite pros you choose" or "Let people apply, you pick" and
  pass `"invite"` or `"apply"`.
- `ask_the_world` refuses the Alpha verifier: an Alpha ask is always `post_ask`.
- Everything else as [post-an-ask.md](post-an-ask.md).

Reports and the final OK: the `manage` skill (`collect_answer`, then their tap on the report's page).
