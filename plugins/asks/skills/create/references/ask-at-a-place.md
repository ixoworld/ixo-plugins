# An ask at a place

Someone near a place goes and looks, and reports what they see or sends a photo. Their phone's location
is checked and the verifier checks the answer is on topic. It can also check one web page (no place).

- **Pick it when:** the honest answer is "I don't know and can't know from here": the fact is current,
  needs eyes in a place, or must be checkable (is the shop open, is the notice still up).
- **Not when:** a web search would do; a task to *do* there, like a cleanup → [campaign.md](campaign.md);
  only certain people → a private ask ([private.md](private.md)): this one can't be private, a company's
  or paid by card.
- **Who answers:** anyone near the place.
- **Money:** the payment × answers, plus a small checking fee, is **set aside** when posted; what isn't
  paid comes back when they close it. Real money and practice money both.
- **Judged:** location and time checks plus the verifier; no person looks unless they pass `approver`.
- **Not to confuse with:** a plan (many checks for a prediction market, [plan.md](plan.md)), which the
  website also calls "Ask the World".

**Ask**, one at a time: "What do you want to know?" (`question`, 12–300 characters, their words) ·
"Where?" (turn it into `"lat,lon"`, read it back: "That's <street> in <town>, right?") · "A short
answer, or a photo?" (`needs`: `observation`, `photo`, or `url-check` for a web page, no place) ·
"What should one answer earn?"
Defaults said once in the preview: 1 answer (`quota`), 24 hours (`hours`), within 400 m (`within_m`).
**Do:** `ask_the_world` with those, a `title` (≤ 80 characters) and `pay`, without `confirm`.
**Say:** "Someone near <place> will check '<question>' within <hours> hours, for <reward>. It costs
<total> in total (<real / practice> money). <How asks near there usually go.> OK?" → on yes, with `confirm`.
**Then:** `collect_answer` (`wait_seconds` up to 45; again to keep waiting). Tell them what came back,
how sure it is (in words, never the bare number) and what was **not** checked. Never call it certain or
"verified". If nothing came back, say so; never guess.

**Never ask** anything that targets, follows or identifies a particular person (home, car, plate,
routine), involves children, is sexual, violent or unlawful, asks for personal data, puts the doer in
danger, or goes onto private land. A refused ask spends nothing. One held for a person's look posts but
stays off the board until seen: say so before they confirm.
