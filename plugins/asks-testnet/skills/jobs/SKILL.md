---
name: jobs
description: Find paid work on asks.world and get paid. Use when the person asks what work is open, wants something near them, asks "what am I invited to?", pastes an invite link, wants to apply to an ask, or wants to hand in a completion and see whether it passed.
---

# Find work and complete asks

## Do this

1. First call `my_status` (or `my_page`) to see what's already done: verified, page, balance. Never ask for a step that's already done; just call the tool, it checks itself.
2. Call `my_invitations`, then `list_asks` (with `near` if they want work nearby). Say a short list and
   recommend one.
3. Invited or a pro ask's link → `accept_invitation` (preview, "yes", `confirm: true`). It checks
   LinkedIn itself. If the preview says they're already in → **Say:** "You're already in." No confirm.
4. Do the work with them, show them the completion, and on "send it" call `submit_work` once (section
   "Hand it in": files, then what to say). A pro ask's report → the `report` skill.
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

**Hand it in.** `submit_work` has no preview: it sends or gives a link on the first call. So show
them the completion first. **Say:** "Here's your completion: <it>. Send it?" On yes, call
`submit_work` once with the ask's number and `deliverable` (or `fields`).

- **A file with the completion** (screenshots, a PDF, a form's files):
  - ChatGPT: put the files the person attached in this chat in `attachments`.
  - Other apps: call `submit_work`; if an **Add screenshots** box appears under it, **Say:** "Add
    your screenshots in the box below." Otherwise give the link: they add them there.
  - Claude Code or Codex (you can make web requests): upload the files they point you to through the
    upload address the reply gives (ask it for a signed URL per file, PUT each file, then GET the
    address to check), before they open the link.
  - A photo taken at a place is never sent from the chat: they take it on the ask's page, there.
- **What came back:**
  - "Sent, waiting for approval" (no link) → **Say:** "Sent. It's waiting for approval."
  - A link → **Say:** "Tap this to send it. Leave the box ticked so next time I can send it for you:
    <link>"
  - An upload address and a `draft` id, with "Your assistant can send for you" on → once the files
    are in (uploaded, or added in the box), call `submit_work` with `collectionId` and `draft`; it sends.
- One completion per ask per person. Never call `submit_work` twice for one ask: if you're unsure it
  went, `link_status` with the link (or `check_verdict`) first.
- They want to stop the assistant sending → **Say:** "Turn it off in Settings, Agents:
  https://test.asks.world/me/settings."

## Did it pass?

**Do:** `check_verdict` with the ask's number. **Say** one of: "Approved and paid: <amount>." / "Passed
the checks; waiting for the poster's final OK, which pays it." / "Not passed: <the reason, in plain
words>." Approved completions pay by themselves, straight to their account; then offer: "Want to cash it
out?" (the `account` skill).
