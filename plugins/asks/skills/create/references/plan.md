# A plan

## Do this

1. Real money: plans aren't here. Say the line below and stop.
2. Offer the sandbox instead.

Several small checks bought with one yes, to inform a prediction market (a Polymarket or Kalshi link):
people near the places the market turns on send photos, observations or a quick survey. The website
calls this "Ask the World".

- **Not on asks.world yet.** Plans exist only in the sandbox; never offer one here, with real money.
  Asked → **Say:** "Plans aren't on asks.world yet, only in the sandbox. Try it there?" (the `asks`
  skill says how).
- **Pick it when:** they follow a market and want local signals before it moves.
- **Not when:** one fact from one place → an ask at a place ([ask-at-a-place.md](ask-at-a-place.md));
  the same job in many places → a campaign. Refused: polling places, sport in play, conflict areas,
  faces or private ground, surveys on votes, politics, religion, health, sexuality or ethnicity.
- **Who completes it:** people near each place.
- **Money:** each check's money is **set aside** on its own ask, which they own; what no completion used comes
  back when they close the plan (`close_plan`, the `manage` skill). No card.
- **Judged:** as an ask at a place: location checks plus the verifier, each completion on its own.

**Do:** `scope_market` if they name a market, then `draft_plan` with the reasoning and checks (drafting
is free). Show its summary: what they'll learn, each check's reason and cost, what it can't tell, the
total. They approve, change (`draft_plan` again) or drop it. Only on yes: `fund_plan` with `confirm` =
the total; it gives one link to tap (the `create` skill's money rule), and the page posts every ask of
the plan in a row after that one tap. Then `plan_status` says they're live. If a tool gives a link or
a question for them, pass it on and wait.
