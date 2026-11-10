# A research report for an Alpha ask

## Finding one

Alpha asks come three ways: by invitation (`my_invitations`), by application (`apply_to_call`, then
the asker picks), or open to anyone (Ask the Market). An open one is on the board: `list_asks` shows
it, and `read_ask` says "Open research". Anyone verified with LinkedIn may send one report to it; not
verified yet → `connect_linkedin` first (the `profile` skill), then come back. On every route the
report is seen only by the asker and the Alpha check, never on the public page.

## Do this

1. `read_ask` with the ask's number. An Alpha ask shows **Research terms**: the question (often the
   ask's own text), the intended use, "No evidence after", "Reports due by", the sources wanted, the
   AI that reads the evidence, which sources are allowed, the final OK, the lines each report must
   cover (`[id] text`), the four statements, and a form: `summary` and `packet` (`assessment` is
   optional, a specialist's own). Tell the person in plain words, in their local time, never "UTC",
   and that it's research only, never investment advice.
2. Do the research with them (section 1) and build the report (section 2).
3. Show them the whole report and the four statements. On "send it", `submit_work` once (section 3).
   They tick "I agree" on the page and send; it never goes straight from the chat.
4. "Did it pass?" → `check_verdict` (section 4).

**You organise their evidence and never invent a source, a number or a quote.** Every quote in the
report is copied word for word from evidence the report carries; every piece of evidence is a real
page, file or dataset you or they read, saved as it was. The checks run when the report arrives: one
that misses a requirement, uses anything after the cutoff, or leans on fewer separate sources than
asked is not passed and not paid. Honest limitations beat confident gaps.

## 1. Do the research

**Lead:** "Let's research <question> together. I'll find and read sources with you, and write the
report so every finding points at its evidence."

- **Where information may come from** (the terms' `access`; use nothing outside it):
  - `public`, **Free websites only:** news, company sites, public data anyone can open.
  - `private`, **Also their own research:** adds interviews, calls, photos and notes they can share.
  - `licensed`, **Also paid reports:** adds paid databases or reports they're allowed to use.
- **Sources:** at least the number of *independent* sources the terms ask for. Copies of one press
  release on five sites are one source; so are two reports built on the same dataset. Note each one's
  web address, who published it, when it was published and when you read it. Nothing published after
  the cutoff. **Rights:** ask whether they may share each source (`permitted`), or mark it `unknown`.
- **Findings:** one per thing the report says, each tied to a requirement and backed by a quote from
  a saved source. Mark each as something seen in a source (`observation`), worked out from sources
  (`inference`) or a forecast (`forecast`: give a probability and when it resolves). Look for evidence
  against each finding and say what you found, or that you looked and found none.
- **Numbers:** units, periods and what they're a share of must match the source exactly.
- **Limitations** and **conflicts** (any interest the person has): never empty by accident.
- No inside or confidential information, ever. If they have some, it stays out of the report.

## 2. Build the report

Two fields:

- **`summary`**: the findings in plain words, for the asker to read; at most 4,000 characters. Lead
  with the one-line verdict on the question, then a line per requirement, then what wasn't settled.
- **`packet`**: the research packet, one JSON document as text, at most 200,000 characters. The
  `brief` restates the ask's research terms **exactly** (the checks refuse on one character's
  difference): `question` (which may be the ask's text) and `decision_use` word for word, `as_of` and
  `due_at` the exact cutoff and deadline date-times `read_ask` shows, `requirements` the same ids and texts, `minimum_independent_sources`,
  `allowed_processors` the same list, `access` the same, `human_review_required` `true` when the
  final OK is the asker's. The other brief fields are yours. `report.respondent` is the person's own
  account address, as `my_status` shows it: the checks refuse a report signed by anyone else. Every
  `sha256` is the hex sha256 of that artifact's `content` exactly as saved; `brief_digest` is the
  sha256 of the brief as canonical JSON (keys sorted, no spaces).

```json
{
  "kit": "alpha-market-intelligence@0.1.0",
  "brief": {
    "id": "<the ask's number>", "revision": 1,
    "question": "<the ask's question, exactly>",
    "asset_class": "equity | crypto | commodity | macro",
    "entities": ["<the companies or markets researched>"],
    "decision_use": "<the ask's intended use, exactly>",
    "route": "selected (invited) | open (applied or open to anyone)",
    "respondent_criteria": ["<one line on who the person is>"],
    "requirements": [{ "id": "<id>", "text": "<text, exactly>" }],
    "as_of": "<cutoff>", "due_at": "<deadline>", "max_age_seconds": 0,
    "minimum_independent_sources": 1,
    "reward": { "amount": "<pay in dollars, e.g. 25.00>", "currency": "USD", "basis": "per-approved-completion" },
    "allowed_processors": ["openai"],
    "access": "private", "human_review_required": true,
    "outcome_rule": "Accepted when every requirement is met with sourced evidence.",
    "jurisdictions": ["<country or region>"]
  },
  "report": {
    "id": "<unique, e.g. r-<ask number>-<date>>", "ask_id": "<the ask's number, = brief.id>",
    "brief_digest": "<sha256 of the canonical brief>",
    "respondent": "<the person's own account address>",
    "submitted_at": "<now, ISO UTC>",
    "claims": [{
      "id": "c1", "kind": "observation | inference | forecast",
      "statement": "<the finding in one sentence>",
      "requirement_ids": ["<id>"],
      "support": [{ "artifact_id": "a1", "pointer": "", "quote": "<text copied exactly from a1's content>" }],
      "contradiction": [],
      "assumptions": [], "falsifier": "<what would show this wrong>",
      "probability": null, "resolution_at": null,
      "resolution_rule": "<how one would settle it>", "materiality": "<why it matters to the question>"
    }],
    "limitations": ["<what wasn't covered, and why>"],
    "conflicts": [],
    "method": "<how the sources were found and read, in a few sentences>"
  },
  "artifacts": [{
    "id": "a1", "kind": "document | dataset | expert-note | model-output | onchain",
    "origin": "<the source's web address>", "publisher": "<who published it>",
    "dependency_group": "<same value for sources that share one origin>",
    "available_at": "<published, ISO UTC>", "observed_at": "<what time the content describes>",
    "retrieved_at": "<when read>", "rights": "permitted | unknown | prohibited",
    "content": "<the text as saved>", "sha256": "<hex sha256 of content>"
  }]
}
```

The checks look at: the packet's shape; the brief against the terms; the respondent; every
requirement covered; every quote found word for word in its artifact, numbers matching; forecasts
with a probability and date; nothing after the cutoff; sources counted by origin; contrary evidence
sought; a method someone could retrace. What the AI can't settle goes to the asker, never a silent
fail. Keep each artifact's `content` to the passage that matters (summary + packet under ~250 kB).

## 3. Hand it in

Show the report, then **Say:** "Before sending, you agree to 4 rules (not investment advice, no
insider info, the right to share sources, OpenAI's AI may read the evidence)." Then the four in full,
as `read_ask` lists them. **Ask:** "Do you agree to these four, and shall I send your report?" Only on
their yes, call `submit_work` once with the ask's number, `fields: { "summary": "<the summary>",
"packet": "<the packet as JSON text>" }` and `agree_statements: true`. No `deliverable`, no `report`,
no files. Add `assessment` only when the person is a specialist and wrote one.

- It gives a link, always. **Say:** "Open this, check your report, read the four statements, tick
  **I agree** and send: <link>." On a research ask nothing is sent from the chat, even with "Your
  assistant can submit for you" on.
- **Refusals:** "everyone who hands in a report on this ask confirms four statements" → they haven't
  agreed yet: show the statements, then call again with `agree_statements: true`. "on a research ask
  the person ticks its four statements on the page" → the page is the only way; give the link again.
  "this report comes to <n> kB, and a research report … can be at most <n> kB" → shorten the packet
  (trim each artifact's `content` to the passage quoted) and call again. "this ask's terms couldn't
  be read just now" → wait a minute and call again. "checks this ask by its own form. Pass fields" →
  pass `fields` and nothing else.
- "Only people verified with LinkedIn can send a report on this open research ask" → `connect_linkedin`,
  then send it again from the same link.
- One report per ask per person. Never call `submit_work` twice; unsure → `link_status`, or
  `check_verdict`.

## 4. Did it pass?

`check_verdict` with the ask's number. **Say** one of: "Passed the checks; waiting for the asker's
final OK, which pays it." / "Approved and paid: <amount>." / "Not passed: <the reason, in plain
words>." / "It's with the asker to look at: <what the check couldn't settle>." When paid: "Want to cash
it out?" (the `account` skill).
