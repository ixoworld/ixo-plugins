# An ask at a place

## Do this

1. Ask, one at a time: "What do you want to know?" → `question` (12–300 characters, their words);
   "Where?" → `near` as `"lat,lon"` (read it back: "That's <street> in <town>, right?"); "A few words,
   or a photo?" → `needs` (`observation` or `photo`; `url-check` for one web page, no place); "What
   should one completion earn?" → `pay`.
2. Call `ask_the_world` with those and a `title` (at most 80 characters), without `confirm`.
3. **Say:** "Someone near <place> will check '<question>' within <hours> hours, for <reward>. It costs
   <total> in all (<real / practice> money). <How asks near there usually go.> OK?"
4. On "yes": again with `confirm` = that total. Give the link. Then `link_status`.
5. Once it's live: `collect_answer` (`wait_seconds` up to 45; call again to keep waiting). Tell them
   what came back, how sure it is (in words) and what was **not** checked. Never call it certain.
   Nothing came back → say so; never guess.

Someone near the place goes and looks; their phone's location is checked and the AI checks the
completion is on topic (free). Defaults, said once in the preview: 1 completion (`quota`), 24 hours
(`hours`), within 400 m (`within_m`). The person gives the final OK by default, after the AI; the AI
alone → `approver: "none"`. The money is **set aside** when posted; what isn't paid comes back when
they close it. It can't be private, a company's, or paid by card.

**Not this kind:** a web search would do → just search; a task to *do* there, like a cleanup →
[campaign.md](campaign.md); only certain people → [private.md](private.md).

**Never ask** anything that targets, follows or identifies a particular person (home, car, plate,
routine), involves children, is sexual, violent or unlawful, asks for personal data, puts the doer in
danger, or goes onto private land. A refused ask spends nothing. One held for a person's look posts but
stays off the board until seen: say so before they confirm.
