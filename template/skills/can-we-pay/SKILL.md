---
name: can-we-pay
description: Use when the user asks whether they are set up to get decisions from the {{TITLE}} oracle — what it costs, what is missing before a claim can be submitted. A readiness check only; it never submits or pays.
---

# Readiness check (never pays)

This skill **only reads**. Never call `submit_claim` here, never open an approval link, and never move
money. If the user wants to go ahead, hand over to the submit-claim skill.

Check, in order, and report a short list of what is ready and what is missing:

1. **Signed in**: call `list_protocols` (no arguments). If it works, the user's IXO sign-in works.
   If it fails asking for authentication, tell them to connect the server (in Claude Code: `/mcp` →
   the server → Authenticate; in Codex: `codex mcp login <server>`).
2. **The protocol and its fee**: `list_protocols` with the `protocolDid` — the evaluation fee per
   decision (`price`), the answers and files it needs, whether it counts claims per person.
3. **How a charge is approved**: each claim is approved by the user on an IXO page before anything is
   charged. Some oracles also let the user set auto-approve limits on IXO (verified apps only, at most
   $100 and 7 days); IXO only offers it where the oracle allows it. Say which applies only if the user
   tells you; you can't read their settings.
4. **What they need**: an IXO account and a source on this oracle that they own — submitting needs
   the owner role (the oracle's Decision Console); for paid sources, IXO credits (PAY) or a saved card.
   Every app is also capped at $20 a day.

Wording: the evaluation fee pays for a decision. It is **not** a payout, and being "ready to pay the
fee" does not mean anyone is allowed to act on a decision. If the protocol pays someone on approval,
claims sent from an AI app wait for the company's approver before that payout.
