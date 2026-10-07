---
name: submit-claim
description: Use when the user wants the SwiftDrop Express (devnet) oracle to decide a claim — submit it, get the user's approval on IXO, and follow it to a decision (including a pending human review).
---

# Submit a claim and follow it to a decision

This plugin connects you to the **SwiftDrop Express (devnet)** oracle (`https://shipment-delivery-oracle.devnet.ixo.earth/v1/mcp`). Its MCP server gives you four
tools: `list_protocols`, `submit_claim`, `get_decision`, `verify_receipt`. The user is signed in with
IXO; you never need an API key.

## 1. Read the work order first

Call `list_protocols` with the `protocolDid` (or with no arguments to list them). The work order
tells you:

- `answers`: the JSON Schema the claim's answers must match. Fill every required field from what the
  user told you; ask for what is missing, never invent facts (an order id, a code, a time, a place).
- `files`: the file questions. A file is passed **by https URL** in `attachments`
  (`{ "question": "<file question>", "url": "https://…" }`). There is no upload: a photo pasted into
  the chat stays in the chat — ask the user for a link.
- `facts.frequency`: if true, the claim is counted per person. The oracle usually fills `submitter`
  itself; if `submit_claim` answers `SUBMITTER_REQUIRED`, send `submitter` = a stable id for the
  person the claim is about (e.g. the courier id), never a placeholder.
- `price`: the evaluation fee for one decision.

## 2. Submit — and let the user approve

Call `submit_claim`. Expect these answers and act on each:

| Answer | What you do |
| --- | --- |
| `APPROVAL_REQUIRED` with `approveUrl` | Show the link to the user and ask them to approve **there**. Then call `submit_claim` again with **exactly the same arguments**. |
| `APPROVAL_PENDING` | They haven't answered yet. Show `approveUrl` again and ask them to tell you once they've approved — don't poll — then call again with the same arguments. |
| `APPROVAL_STALE` | The price changed: show the new `approveUrl`, then call again with the same arguments once they've approved. |
| `SOURCE_REQUIRED` | Ask the user which of the listed sources the claim is for; call again with `sourceId`. |
| `NO_SOURCE` | The user has no source on this oracle they can submit for (submitting needs the owner role): send them to `consoleUrl`. |
| `SCOPE` | The app was connected for reading only: ask the user to reconnect it and allow submitting. |
| `INSUFFICIENT_CREDITS` | Not enough IXO credits: show `fundingUrl`. |
| `CARD_AUTHENTICATION_REQUIRED` | The bank wants 3-D Secure: show `confirmUrl` to the user (never open it yourself). Once they've confirmed, call again with the same arguments **plus** the error's `idempotencyKey` and `resumePayment` = the error's `paymentRequired` — the one time you add arguments. |
| `AWAITING_CARD_CONFIRMATION` | The card confirmation is still pending: wait for the user, then resume as above. |
| `SUBMITTER_REQUIRED` | Ask for the person's stable id (see above), then call again with `submitter`. |
| `SPEND_CAP` | The app reached today's limit. Stop and tell the user. |
| `autoApproved: true` | The user's own auto-approve limits paid it; say so and how much is left (`autoApproveRemaining`). |

Rules:

- **Never** try to approve for the user, open a link yourself, or change the arguments between the
  first call and the retry (a different body is a different claim and a new approval) — except to
  resume a card payment as above.
- A retry with the same arguments is safe: it never submits or charges twice.
- If your app asks permission before running `submit_claim`, explain: the tool submits a claim for an
  independent decision; any charge still needs the user's approval on IXO. Let the user allow just
  this tool — never suggest turning safety checks off.

## 3. Follow it

`submit_claim` waits up to 90 s. If it answers `status: "pending"`, call `get_decision` with the
`claimId` later. A `review` verdict means a person must answer review tasks; tell the user what is
pending — you can't answer them.

## 4. Say exactly what happened

Keep these apart — they are different statements:

- **The engine decided**: the verdict (`approve` / `reject` / `review`) and its reasons.
- **The receipt verifies**: only after `verify_receipt` says valid (use the verify-decision skill).
- **You are allowed to act**: the user's own rules decide that, not this tool.
- **Money moved**: only what `payment` on the record says. The evaluation fee the user approved pays
  for the decision; it is **not** a payout to anyone.
