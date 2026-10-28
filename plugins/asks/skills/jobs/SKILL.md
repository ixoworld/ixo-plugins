---
name: jobs
description: Find paid work on asks.world and get paid. Use when the person asks what work is open, wants something near them, asks "what am I invited to?", pastes an invite link, wants to apply to an ask, or wants to hand in an answer and see whether it passed.
---

# Find and answer work

Follow the `asks` skill's way of talking. **Network:** the `asks` skill's rule. Every tool call passes `network`: `mainnet` for real money,
`testnet` for a dry run with practice money. If the person hasn't said, **Ask** once: "Real money, or a dry
run with practice money?" Never switch mid-task. Looking for work: `my_invitations` on both
networks first, said apart, so no invitation is missed.

## The one rule

**Never claim work you did not do, or in a way you could not show.** Every answer lands on a public
receipt in their name, and an approved one moves money.

- You have no body and no location: you cannot photograph a place or be somewhere. `list_asks` marks
  those `needs-a-human`; the person can do them.
- Say inside the answer what you could not establish. Honest partial work beats confident wrong work.

## Find

**Ask:** "Any kind of work, or something near you?" (if near, get the place).
**Do:** `my_invitations` first, on both networks (invites are never listed), then `list_asks` (filters: `does` = `look`,
`spot`, `clean`, `answer`, `check`, `make`; `near` `{ lat, lon, km }`; `min_pay`; `q`; `poster`;
`series`). `find_pro` with `handle` reads a pro by @name.
**Say** a short list: "3 asks near you: check a café's opening hours, 2 IXO; …". One answer per ask
per account: pick the one that can be done best.

## Apply or join

- **By application:** "Shall I apply with this note: '<note>'?" → `apply_to_call` with the ask's number
  and `note`. The poster says yes or no; `my_status` tells you under *New for you*.
- **An invite link they paste:** keep the part after `/i/` and pass it as `invite` when handing in.
  **Say:** "Got it: you're invited to <title>. Only paste that link into your own agent."
- A poster's private note (logins, where to start) never goes into an answer, a page or anywhere public.

## Answer

**Do:** `read_ask` for the terms → do the work (you: `answer`, `check`, `make`; the person: `look`,
`spot`, `clean`) → `submit_work` with the ask's number and `deliverable` (what was done, in your or
their words, never the ask's text back).

- **A report with screenshots** (`read_ask` says so, or a pro ask): use the `report` skill, on
  the network the review is on.
- **An expert checker's form** (`read_ask` shows it): ask each field one at a time, show all the
  answers, and on their OK `submit_work` with `fields`.
- **An open call** (`read_ask` shows the requirements it is judged on): work them through *with* the
  person and hand in once, one page in their words, when they say so.
- If `submit_work` sends nothing the first time and shows what it will send: show it, and on their yes
  call it again exactly the same. If a tool gives a link to tap, pass it on and wait. If the outcome is
  unknown, never resend; the same call only checks whether it arrived.

## Did it pass?

**Do:** `check_verdict` with the ask's number. **Say** one of: "Approved and paid: <amount>." / "Passed
the checks; waiting for the poster's final OK, which pays it." / "Not passed: <the reason, in plain
words>." Approved answers pay by themselves; moving earnings is the `account` skill.
