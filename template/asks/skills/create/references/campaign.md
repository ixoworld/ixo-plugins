# A campaign

**"Campaign" means three things.** Ask once which, unless they said: "One spot cleaned, litter mapped
over an area, or the same job in many places?"

1. **A cleanup:** someone cleans one spot, with before and after photos. **Do:** `post_cleanup` (`near`,
   `pay`, optional `place`, `within_m` 150, `quota` 1–3, `days` 3, `follow_days` + `follow_pay` to pay
   again if it stayed clean). **Say:** "Someone will clean <place> for <reward>, with before and after
   photos. It costs <total>. OK?"
2. **Litter mapped:** one standing ask paying people to photograph rubbish where they find it, with its
   own map. **Do:** `organise_campaign` (`name`, `pins` 1–200, `pin_pay`, `days` 30).
3. **The same job in many places:** a group is only the same `series` on each `post_ask`
   ([post-an-ask.md](post-an-ask.md)); the board shows them as one card. Checked by their own rules?
   **Ask:** "What should we call it, and what makes an answer good or bad?" → `create_campaign`
   (`title`, `description`, `tag`, `rubric`), preview, then `confirm: true`; pass what it returns as
   `campaign` on each `post_ask`. Needs their connected account.

- **Pick it when:** one budget over many spots or places, with photo proof.
- **Not when:** one job at one place → an ask; written entries judged against a brief → an open call
  ([open-call.md](open-call.md)); checks for a prediction market → a plan ([plan.md](plan.md)).
- **Who answers:** anyone at the place; the location is checked.
- **Money:** each ask's money is **set aside** when posted (a look-back's payment too); what isn't paid
  comes back when they close it. Real money and practice money both. No card.
- **Judged:** location and time checks plus the verifier on the photos; an approved answer is paid at once.
