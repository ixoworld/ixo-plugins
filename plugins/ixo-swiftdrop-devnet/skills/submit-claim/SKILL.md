---
name: submit-claim
description: Use when the user wants the SwiftDrop Express (devnet) oracle to decide a claim — submit it, get the user's approval on IXO, and follow it to a decision (including a pending human review).
---

# Submit a claim and follow it to a decision

This plugin connects you to the **SwiftDrop Express (devnet)** oracle (`https://shipment-delivery-oracle.devnet.ixo.earth/v1/mcp`). Its MCP server gives you five
tools: `list_protocols`, `upload_file`, `submit_claim`, `get_decision`, `verify_receipt`. The user is signed in with
IXO; you never need an API key.

## 1. Read the work order first

Call `list_protocols` with the `protocolDid` (or with no arguments to list them). The work order
tells you:

- `answers`: the JSON Schema the claim's answers must match. Fill every required field from what the
  user told you; ask for what is missing, never invent facts (an order id, a code, a time, a place).
- `files`: the file questions. Attach each file one of two ways:
  - **A link**: `{ "question": "<file question>", "url": "https://…" }`.
  - **An upload**: call `upload_file`. In apps that show cards, ask the user to choose the file in the
    card; if you can run shell commands and the file is on this machine, run the `curl` it gives you.
    Then attach `{ "question": "<file question>", "uploadId": "<from upload_file>" }` — the oracle
    fills in the file's `cid`. One link per file; it works once and expires after 10 minutes.
  A photo pasted into the chat can't be sent on as it is: use `upload_file` and ask the user to pick it.
- **Who the claim is for**: never send `submitter`. The oracle records the signed-in user. If the
  protocol pays or counts a person named in one of its answers (for a delivery, the courier id), fill
  that answer with the real id the user gives you, never a placeholder; if it's missing, `submit_claim`
  answers `VALIDATION` naming the field (`answers.<field>`), before anything is approved or charged.
- `price`: the evaluation fee for one decision.

## 2. Submit — and let the user approve

Call `submit_claim`. Expect these answers and act on each. The three `APPROVAL_*` answers are **not**
errors: the result's text starts `NOT SUBMITTED.` and `structuredContent` has `status:
"approval_required"`, with the code and `approveUrl` under `error`. Nothing was submitted or charged
yet. In apps that show cards, the card's *Approve on IXO* button opens the same link.

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
| `UPLOAD_PENDING` | The user hasn't uploaded the file yet: ask them to choose it in the upload card (or run the `curl`), then call again with the same arguments. If the link expired, call `upload_file` again and use the new `uploadId`. |
| `VALIDATION` | An answer or file is missing or wrong; `details` names the field. Ask the user for it, then call again. |
| `SPEND_CAP` | The app reached today's limit. Stop and tell the user. |
| `autoApproved: true` | The user's own auto-approve limits paid it (only on oracles that allow auto-approve); say so and how much is left (`autoApproveRemaining`). |

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
- **A payout**: if the protocol pays someone on approval, a claim sent from an AI app is marked
  unverified, so the company's approver must approve that payout first. Say it is waiting for the
  company — never that it was paid.
