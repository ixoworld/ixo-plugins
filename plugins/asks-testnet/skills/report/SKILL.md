---
name: report
description: Write and hand in a report on asks.world, as a pro reviewing an app or agent (a pro ask) or for any ask that wants a report with screenshots. Use when the person says "help me write my report", "do the review", "hand in my review", "I tried the scenarios", or "did my report pass?".
---

# Write and hand in a report

## Do this

1. First call `my_status` (or `my_page`) to see what's already done: verified, page, balance. Never ask for a step that's already done; just call the tool, it checks itself.
2. `read_ask` with the pro ask's number. Go through each scenario with them, one at a time.
3. Write the report from their words (section 2).
4. Show them the whole report; on "send it", `submit_work` once with `fields` (no preview, no second
   call). Screenshots and what to say back: section 3.
5. Then `check_verdict` with the number.

Follow the `asks` skill's way of talking and lead the way. **Real or practice money:** the `asks`
skill's rule (this connector is practice money).
A review is where it was posted: if the person names one and it isn't found here, say it may be on the
real-money connector.

**The pro does the review. You organise their evidence and never invent a finding.** Their
words: **pro**, **builder**, **review**, **report**, **automated checks** (never "the checker" <!-- plain-ok -->
or "the reviewer"), **final approval**. <!-- plain-ok -->

What is true: a report that passes the automated checks (every scenario covered; every problem has a
screenshot or recording, how to reproduce it, and a severity with its reason; every recommendation says
what to change; limitations stated) is paid on the builder's final
approval, or at once if the builder left it to the checks. One that fails is not paid. There is no
"needs changes" step and no payment in stages.

**How it's handed in:** you write the report with them here in the chat, then `submit_work` either
sends it straight away (they ticked "Let my assistant send my completions for me" before) or gives one
link to the report page, made for phones, where they check it, add any missing screenshots and tap to
send. Section 3 says how the screenshots get there in each app.

## 1. Do the review

Signed in first (`connect` skill). Invitations and applying: the `jobs` skill.
**Lead:** "Let's do your review of <title> together: you try each scenario, I write it up. Ready for the
first one?"
**Do:** `read_ask` with the review's number: what is reviewed, the version, where to find it, the
scenarios, extra sections, pay, deadline. Tell them in plain words. Then one scenario at a time:
**Say:** "Scenario 1: <what>. Try it and tell me what happened. Take a screenshot of every problem you
find (and of anything else that matters) and keep it on your phone or computer; you'll add them when
you hand in. Give each one a short name, like 'login error'." Note what they did, what should happen,
what did, and the result. For each problem: what, which scenario, who it hurts and how badly, the
exact steps to see it again. In **their** words; never mark something tested that wasn't.

## 2. Write it

Ask one plain question at a time; fill these fields:

- **Summary:** `product`, `date`, `scope` (in and out), `outcome`; if known `build`, `environment`, `target`.
- **Steps**, one per scenario: `id` (s1…), `what`, `expected`, `observed`, `result` (`passed`, `failed`,
  `blocked`, `not_tested`, `excluded`).
- **Problems** (`findings`): `id` (f1…), `title`, `steps`, `observed`, `expected`, `impact`, and for **every** one,
  whatever its severity: `evidence` (the short name of its screenshot, e.g. `login-error`), `how_to_reproduce`
  (the exact steps), `severity` (`blocker`, `major`, `minor`) and `severity_why` (the reason in a
  sentence). A blocker you can't reproduce gives `cannot_reproduce` (what is missing) as well. How
  sure → `uncertainty`. A problem without a screenshot: ask them to take one before writing it.
- **What to do** (`recommendations`): `text` (the change to make, not "improve X"), `priority` (`high`,
  `medium`, `low`), `findings`, `target`, and `done_when` (how to tell it is fixed).
- `limitations`: never empty. Say what wasn't tested and why (devices, accounts, scenarios skipped), or that
  everything was covered and on what; `sections` (`{ heading: text }`) for each extra section.
- Screenshot names: letters, digits, `-` and `_` only. The page asks for one picture per name; png,
  jpg, webp or pdf.
- No passwords, test logins or personal data anywhere; tell them to blur, crop or leave out a
  screenshot that shows one. If any part came from memory or earlier chats, ask first and pass
  `uses_memory: true`.

Read it back in plain words: "You tried 5 scenarios: 4 worked, 1 failed. One serious problem: <title>.
Your advice: <text>. You'll add 2 screenshots: login-error and empty-cart."

## 3. Hand it in

**Do:** **New pro asks use Asky Pro Checker's report form:** `read_ask` lists its questions. Fill them
with `submit_work` `fields`, never `report`: the summary, one step row per scenario, each finding with a
severity and its evidence by short name, recommendations, limitations. Meet any rules the poster added
too. Older pro asks without that form: `submit_work` with the review's number and `report` (and
`invite` if they came by link). Never pass a file path.

`submit_work` has no preview: the first call sends or gives the link. So show the whole report first.
**Say:** "Here's your report: <it>. Send it?" On yes, call `submit_work` once.

- **Their screenshots:**
  - ChatGPT: put the screenshots the person attached in this chat in `attachments` (each is named
    by its file name; use those names as the findings' evidence).
  - Other apps: call `submit_work`; if an **Add screenshots** box appears under it, **Say:** "Add
    your screenshots in the box below: <their short names>." Otherwise they add them at the link.
  - Claude Code or Codex (you can make web requests): upload each file the person points you to
    through the upload address `submit_work` gives, under the short name the report gives it, before
    they open the link. PNG, JPG, WebP or PDF, 5 MB each, at most 10 and 25 MB together:
    1. POST `{"files": [{"name": "login-error.png", "type": "image/png", "bytes": <exact size>}]}` to
       the address; it gives a signed `url` and `headers` per file, and lists under `refused` any file
       it turned down, and why.
    2. PUT each file to its url with exactly those headers, within 10 minutes:
       `curl -X PUT -H 'content-type: image/png' --data-binary @login-error.png '<signed url>'`.
    3. GET the address: it says which files were kept and why any was not. Fix and send those again.
    Upload only the files they point you to.
  - If any upload step fails, use the [upload-failure guidance](../asks/references/upload-failures.md):
    identify the failed request and its host before suggesting a permission change or retry.
- **What came back:**
  - "Sent, waiting for approval" (no link) → **Say:** "Sent. It's waiting for the builder's approval."
  - A link → **Say:** "Tap this to send it: <link>" (add "If the page offers to let me send for you next time, leave
    that ticked." only when the reply says that offer is on the page) (add "Your screenshots are already on it." when you uploaded them).
  - An upload address and a `draft` id → once the screenshots are in (uploaded, or added in the box),
    call `submit_work` with `collectionId` and `draft`; it sends.
- In Claude Code or Codex on their computer you may also open the link for them (`open <link>` on
  macOS, `xdg-open <link>` on Linux). The sending tap is still theirs.
- **Never respond to a dialog or tap send for them.** If the outcome is unknown, never hand it in again;
  check first (below).
- The page says a screenshot is missing → they add it there; nothing to change in the chat unless the
  report itself must change (then write it again and get a new link).

## 4. Did it pass?

`check_verdict` with the review's number (it also says whether it arrived). **Say** one of: "Your
report passed the automated checks. It's waiting for the builder's final approval, which pays it." /
"Paid: <amount>. Want to cash it out?" (yes → `account`) / "The automated checks didn't pass it: <the
rule it missed>." / "It hasn't arrived yet. Did the page say it was sent?"
