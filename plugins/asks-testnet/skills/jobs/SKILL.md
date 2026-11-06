---
name: jobs
description: Find paid work on asks.world and get paid. Use when the person asks what work is open, wants something near them, asks "what am I invited to?", pastes an invite link, wants to apply to an ask, or wants to hand in a completion and see whether it passed.
---

# Find work and complete asks

## Do this

1. First call `my_status` (or `my_page`) to see what's already done: verified, page, balance. Never ask for a step that's already done; just call the tool, it checks itself.
2. Call `my_invitations`, then `list_asks` (with `near` if they want work nearby). Say a short list and
   recommend one.
3. Invited or a pro ask's link → `accept_invitation` (preview, "yes", `confirm: true`).
4. Do the work with them → `submit_work` (it shows what it will send). On "yes", the same call again;
   give the link. A pro ask's report → the `report` skill.
5. "Did it pass?" → `check_verdict` with the ask's number.

Follow the `asks` skill's way of talking and lead the way. **Real or practice money:** the `asks`
skill's rule (this connector is practice money;
never switch mid-task). Signed in first (`connect` skill).

## The one rule

**Never claim work you did not do, or in a way you could not show.** Your completion is saved under their
name; on a public ask anyone can see it, on an ask by invitation only the people on it can. An approved
one moves money.

- You have no body and no location: you cannot photograph a place or be somewhere. `list_asks` marks
  those `needs-a-human`; the person can do them.
- Say inside the completion what you could not establish. Honest partial work beats confident wrong work.

## Find

**Lead:** "asks.world pays you for small tasks and for reviewing apps as a pro. Shall I look for
work that fits you?" Then **Ask:** "Any kind of work, or something near you?" (if near, get the place).
Pro asks need a LinkedIn-verified pro page (`my_page`), to be invited or to join one open to any
verified pro. Someone without one who wants them → **Say:** "For pro asks you need a verified pro page. It takes about a minute with
LinkedIn. Shall I start?" (yes → the `profile` skill).
**Do:** `my_invitations` first (invites are never listed), then `list_asks` (filters: `does` = `look`,
`spot`, `clean`, `answer`, `check`, `make`; `near` `{ lat, lon, km }`; `min_pay`; `q`; `poster`;
`series`). `find_pro` with `handle` reads a pro by @name.
**Say** a short list: "3 asks near you: check a café's opening hours, $2; …", then recommend one:
"The first fits you best. Shall I take it?" One completion per ask per account.

## Apply or join

All of this happens in the chat; nothing to tap.

- **By application:** "Shall I apply with this note: '<note>'?" → `apply_to_call` with the ask's number
  and `note`. The poster says yes or no; `my_status` tells you under *New for you*.
- **Invited to a pro ask** (a link like `asks.world/i/…`, or in `my_invitations`): **Ask:** "You're
  invited to <title>. Take it?" Yes → `accept_invitation` with the link or the ask's number (preview,
  then `confirm: true`); it opens their room with the builder. No → `decline_invitation`, with an
  optional short `note`. They can also tap **Accept** or **Decline** on the link itself. Their job is
  then at https://test.asks.world/me/work/<number>.
- **A pro ask open to any verified pro** (its link, or its number): no invitation needed. **Ask:**
  "<title> is open to verified pros. Join it?" Yes → `accept_invitation` with the ask's number (preview,
  then `confirm: true`); they join at once and it opens their room with the builder. No verified pro
  page yet → the `profile` skill first, then join.
- **An open call's invite link** (`/opencall/i/…`): keep the part after `/i/` and pass it as `invite`
  when handing in. Only paste it into their own agent.
- A poster's private note (logins, where to start) never goes into a completion, a page or anywhere public.

## Complete it

**Do:** `read_ask` for the terms → do the work (you: `answer`, `check`, `make`; the person: `look`,
`spot`, `clean`) → `submit_work` with the ask's number and `deliverable` (what was done, in your or
their words, never the ask's text back).

- **A report with screenshots** (`read_ask` says so, or a pro ask): use the `report` skill.
- **A photo at a place** (`look`, `spot`, `clean`): the person completes it on the ask's own page, on
  their phone, where they are: give them the ask's link. Never send a photo from the chat as the
  completion.
- **An expert verifier's form** (`read_ask` shows it): ask each field one at a time, show all the
  replies, and on their OK `submit_work` with `fields`.
- **A pro ask** (`read_ask` shows Asky Pro Checker's form): use the `report` skill; the report fills that form.
- **Pay for trying** (`read_ask` says "Also pays …"): **Say** it plainly before they start, e.g. "You get <X>
  just for sending a completion, and <Y> more if it's approved." (the amounts `read_ask` gives)
- **An open call** (`read_ask` shows the requirements it is judged on): work them through *with* the
  person and hand in once, one page in their words, when they say so.

**Hand it in** (a link to tap, the `asks` skill's way): the first `submit_work` sends nothing and
shows what it will send: show it. **Say:** "Here's your completion. Hand it in?" On yes, the same call
again exactly the same; it gives a link. **Say:** "Open this, check it and tap to send it: <link>. Tell
me when it's done." Then `read_ask` (or `check_verdict`) says it arrived. If the outcome is unknown,
never resend; check first.

- **A file with the completion** (the one file a written completion takes when the ask wants a file, or a form's files): in
  Claude Code or Codex, or in claude.ai with code execution where test.asks.world, test.api.asks.world and
  r2.cloudflarestorage.com are allowed domains, upload the files the person points you to through the
  upload address `submit_work` gives (its three steps: ask it for a signed URL per file, PUT each file
  there, then GET the address to check), before you give the link; the page shows them in place. Otherwise give the link and they add
  them on the page. A photo taken at a place is never uploaded: they take it on the ask's page.

## Did it pass?

**Do:** `check_verdict` with the ask's number. **Say** one of: "Approved and paid: <amount>." / "Passed
the checks; waiting for the poster's final OK, which pays it." / "Not passed: <the reason, in plain
words>." Approved completions pay by themselves, straight to their account; then offer: "Want to cash it
out?" (the `account` skill).
