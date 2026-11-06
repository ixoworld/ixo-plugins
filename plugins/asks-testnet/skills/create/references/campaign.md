# A campaign

## Do this

1. Unless they said, **Ask:** "One spot cleaned, litter mapped over an area, or the same job in many places?"
2. Call the tool for that choice (below) without `confirm`, say the total, get "yes".
3. Call it again with `confirm`. Give the link. Then `link_status`.

**"Campaign" means three things.** Ask once which, unless they said: "One spot cleaned, litter mapped
over an area, or the same job in many places?"

1. **A cleanup:** someone cleans one spot, with before and after photos. **Do:** `post_cleanup` (`near`,
   `pay`, optional `place`, `within_m` 150, `quota` 1–3, `days` 3). Paying again later if
   it stayed clean can't be set up from here yet; say so if they ask. **Say:** "Someone will clean
   <place> for <reward>, with before and after photos. It costs <total>. OK?" On yes, with `confirm`;
   then the link to tap.
2. **Litter mapped:** one standing ask paying people to photograph rubbish where they find it, with its
   own map. **Do:** `organise_campaign` (`name`, `pins` 1–200, `pin_pay`, `days` 30): preview, their
   yes, then the link to tap.
3. **The same job in many places:** a group is only the same `series` on each `post_ask`
   ([post-an-ask.md](post-an-ask.md)); the board shows them as one card. Checked by their own rules?
   That needs a campaign, and posting asks into one from the chat isn't possible yet. **Say:** "I can't
   post tasks into a campaign with its own rules from here yet. I can post them now as a group, each
   checked by its own task, or you can post them on asks.world, where the ask form's **A campaign**
   block adds an ask to a campaign that already exists." If they still want the campaign made:
   **Ask:** "What should we call it, and what makes a completion good or bad?" → `create_campaign`
   (`title`, `description`, `tag`, `rubric`: the requirements' JSON itself), preview, then
   `confirm: true` and the link to tap. Never pass `campaign` on `post_ask`.

- **Pick it when:** one budget over many spots or places, with photo proof.
- **Not when:** one job at one place → an ask; written entries judged against a brief → an open call
  ([open-call.md](open-call.md)); checks for a prediction market → a plan ([plan.md](plan.md)).
- **Who completes it:** anyone at the place; the location is checked.
- Every spend here is the `create` skill's money rule: preview, their yes, then one link to tap.
- **Money:** each ask's money is **set aside** when posted; what isn't paid
  comes back when they close it. Real money and practice money both. No card.
- **Judged:** location and time checks plus the verifier on the photos; an approved completion is paid at once.
