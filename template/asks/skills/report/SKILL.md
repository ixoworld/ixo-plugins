---
name: report
description: Write and hand in a report on asks.world, as a specialist reviewing an app or agent (an expert review) or for any ask that wants a report with screenshots. Use when the person says "help me write my report", "do the review", "hand in my review", "I tried the scenarios", or "did my report pass?".
---

# Write and hand in a report

Follow the `asks` skill's way of talking. **Every tool call passes `network`:** mainnet unless this was a dry run (an expert review is always `testnet` for now: **Say** once that it is play money while Expert Reviews is in its test phase);
if the ask isn't found there, look on testnet and say so.

**The specialist does the review. You organise their evidence and never invent a finding.** Their
words: **specialist**, **builder**, **review**, **report**, **automated checks** (never "the checker"
or "the reviewer"), **final approval**.

What is true: a report that passes the automated checks (it covers every scenario, says what was
observed against what was expected, and how to reproduce every blocker) is paid on the builder's final
approval, or at once if the builder left it to the checks. One that fails is not paid. There is no
"needs changes" step and no payment in stages.

## 1. Do the review

Connected first (`connect` skill, `reviews: true`). Invitations and applying: the `jobs` skill.
**Do:** `read_ask` with the review's number: what is reviewed, the version, where to find it, the
scenarios, extra sections, pay, deadline. Tell them in plain words. Then one scenario at a time:
**Say:** "Scenario 1: <what>. Try it and tell me what happened. Take a screenshot of anything that
matters and tell me where you saved it." Note what they did, what should happen, what did, and the
result. For each problem: what, which scenario, who it hurts and how badly, the exact steps to see it
again. In **their** words; never mark something tested that wasn't.

## 2. Write it

Ask one plain question at a time; fill these fields:

- **Summary:** `product`, `date`, `scope` (in and out), `outcome`; if known `build`, `environment`, `target`.
- **Steps**, one per scenario: `id` (s1…), `what`, `expected`, `observed`, `result` (`passed`, `failed`,
  `blocked`, `not_tested`, `excluded`).
- **Problems** (`findings`): `id` (f1…), `title`, `steps`, `observed`, `expected`, `impact`, `severity` (`blocker`,
  `major`, `minor`) and `severity_why`. A major needs `how_to_reproduce`; a blocker that or
  `cannot_reproduce`. How sure → `uncertainty`.
- **What to do** (`recommendations`): `text`, `priority` (`high`, `medium`, `low`), `findings`, `target`, `done_when`.
- `limitations` (what couldn't be checked); `sections` (`{ heading: text }`) for each extra section.
- Screenshots or a PDF → `files`, full paths (png, jpg, webp, pdf; names of letters, digits, `-`, `_`).
  `evidence` on a step or problem = a file's name without its extension.
- No passwords, test logins or personal data anywhere; blur, crop or leave out a screenshot that shows
  one. If any part came from memory or earlier chats, ask first and pass `uses_memory: true`.

Read it back in plain words: "You tried 5 scenarios: 4 worked, 1 failed. One serious problem: <title>.
Your advice: <text>."

## 3. Hand it in

**Do:** `submit_work` with the review's number, `report`, `files` (and `invite` if they came by link).
The first call sends nothing and returns the whole report: show all of it. **Say:** "Here's your report.
Hand it in?" On yes, the same call again with exactly the same report and files. If a tool gives a link
to tap or a dialog, pass it on as the tool says and wait; **never answer a dialog for them**. If the
outcome is unknown, never resend; the same call only checks whether it arrived.

## 4. Did it pass?

`check_verdict` with the review's number. **Say** one of: "Your report passed the automated checks.
It's waiting for the builder's final approval, which pays it." / "Paid: <amount> went to your
account." / "The automated checks didn't pass it: <the rule it missed>."
