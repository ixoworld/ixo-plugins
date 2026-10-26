---
name: manage
description: Look after the person's open asks on asks.world. Use when they ask "did anyone answer?", "is anything waiting for me?", want to read answers or reports, give the final OK, see a plan's progress, close an ask or plan and get the money back, see where a check request stands, or (IXO staff) decide check requests.
---

# Your open asks

Follow the `asks` skill's way of talking. **Every tool call passes `network`:** mainnet unless this was a dry run;
if the ask isn't found there, look on testnet and say so. Never switch without saying so.

## What came in

- **My asks:** `list_asks` with `poster` = their account; `collect_answer` for one ask's answers or
  reports (`wait_seconds` to wait); `check_verdict` for how an answer's checks went. **Say** it in a
  line: "2 of 3 answered; one approved and paid."
- Tell them what came back, how sure it is and what was **not** checked. Never call an answer certain,
  never soften or add to a finding. If nothing came back, say so.
- **A plan:** `plan_status` — what each check found so far, in plain words.

## Final OK

Answers they chose to approve wait on the website, never here. **Say:** "Open <the link>, under
**Waiting for you to check**, read each and press **Send decision**." For a review job: "Open your
review's page, read the report, and approve it there to pay it." Never approve or turn anything down
for them.

Some company answers wait for a person in the Decision Console: **Say:** "Answers that need a person
wait under **Claims › Review queue**. If nobody answers within 48 hours they're turned down." If they
get no emails about it: "On that page, turn on **Email me when a claim needs my review**."

## Close and get money back

**Money moves back:** preview first, then confirm, and name the network ("real money" / "play money").

- **An ask:** `close_ask` with its number, without `confirm`. **Say:** "This closes '<title>' to new
  answers and sends <amount> back to your account. <What stays, and why.> OK?" → again with
  `confirm: true`. Only whoever posted it can close it.
- **A plan:** `close_plan`, the same two steps.

## Checks by IXO

- **Their own request:** `ask_for_check` with no `provider` says where it stands. **Say** one of:
  "Still with IXO." / "Done: your page shows **Checked by IXO**." / "IXO declined: <their note>."
  Asking for one is the `profile` skill.
- **IXO staff deciding requests:** `check_requests` lists who is waiting; read each person's page and
  links, then `decide_check` to decline (with a short note to the person), preview first, `confirm: true` on
  their yes. IXO checks are approved on the website's check requests page, signed in with their own
  account, never with this tool. Nobody decides their own request.
