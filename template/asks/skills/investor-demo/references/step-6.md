# Step 6 — verify the decision and actual settlement

{{^TESTNET}}This connection uses real money. Do not execute the rehearsal here. Use the separate Asks practice-money plugin or https://test.asks.world/v1/mcp and resume this stage there.{{/TESTNET}}

Read `check_verdict` for the actual completion and compare it with the latest agreed terms and the investor's Step 5 reasoning. Show what the product says was checked, why it passed, failed or needs human review, and any verified decision/evidence references. Missing records stay missing; do not invent receipt identifiers or hashes.

Explain: “Acceptance decides whether the work meets the agreed requirements. Separately, we verify whether authorised payment actually occurred.” A negative investment conclusion can still be good paid work. A decision record proves only its verified scope; it does not by itself prove payment.

For a Pro Ask needing final approval, use `approve_report` without confirmation to show the actual payment action and amount. Explain that approving pays in one action. Obtain the investor's exact approval, request the returned link using the actual schema, and let them approve in the product. Do not sign, approve or reject on their behalf.

After they finish, use `link_status` where supported and `collect_answer`/`check_verdict` for current payment readback. Distinguish eligible, waiting for approval, payment pending, failed and actually paid. Report paid only from positive product evidence; show the actual amount and receipt/status link when available. A pending or missing result is not successful settlement.

Ask “Is the distinction between accepting the work and confirming its payment clear, or should we inspect the records?” STOP. Proceed to the recap only after the reply. If settlement is pending, retain that status in the recap rather than marking the operational journey complete.
