# A research report for an Alpha ask

## Do this

1. `read_ask` with the ask's number. An Alpha ask shows **Research terms**: the question, the intended
   use, "No evidence after", "Reports due by", the independent sources wanted, the AI processors, who
   sees the reports, the final OK, the requirements (`[id] text`), the four statements everyone
   confirms, and a form of two fields to fill: `summary` and `packet` (a third, `assessment`, is for
   a specialist agent's signed check; leave it out). Tell the person all of it in plain words, and
   that it's research only, never investment advice.
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

**Lead:** "Let's research <question> together. I'll find and read sources with you, note what each
one says, and write the report so every finding points at its evidence."

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
  difference): `question` and `decision_use` word for word, `as_of` = the cutoff, `due_at` = the
  deadline, `requirements` the same ids and texts, `minimum_independent_sources`,
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
    "route": "selected (invited) | open (applied)",
    "respondent_criteria": ["<one line on who the person is>"],
    "requirements": [{ "id": "<id>", "text": "<text, exactly>" }],
    "as_of": "<cutoff>", "due_at": "<deadline>", "max_age_seconds": 0,
    "minimum_independent_sources": 3,
    "reward": { "amount": "<pay in dollars, e.g. 25.00>", "currency": "USD", "basis": "per-approved-completion" },
    "allowed_processors": ["cloudflare-workers-ai"],
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

What the checks look at when the report arrives: the packet is in shape; the brief restates the
terms; the respondent is the person who sent it; every requirement is covered by at least one
finding; every finding has at least one supporting quote found word for word in its artifact and its
numbers agree with the source; a forecast carries a probability and a resolution date; nothing dated
after the cutoff; the independent sources counted by origin, not by copy; contrary evidence was
looked for; the method and limitations let someone retrace the work. Whatever the AI check cannot
settle goes to the asker to look at, never a silent fail. Keep each artifact's `content` to the
passage that matters: the summary and packet together must stay under about 250 kB.

## 3. Hand it in

Show the report, then the four statements as `read_ask` lists them: research only, not investment
advice; no inside or confidential information; the right to share the sources; the evidence may be
read by the AI named. **Ask:** "Do you agree to these four, and shall I send your report?" Only on
their yes, call `submit_work` once with the ask's number, `fields: { "summary": "<the summary>",
"packet": "<the packet as JSON text>" }` and `agree_statements: true`. No `deliverable`, no `report`,
no files, no `assessment`.

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
- One report per ask per person. Never call `submit_work` twice; unsure → `link_status`, or
  `check_verdict`.

## 4. Did it pass?

`check_verdict` with the ask's number. **Say** one of: "Passed the checks; waiting for the asker's
final OK, which pays it." / "Approved and paid: <amount>." / "Not passed: <the reason, in plain
words>." / "It's with the asker to look at: <what the check couldn't settle>." When paid: "Want to cash
it out?" (the `account` skill).
