# An ask

## Do this

1. Ask the questions below, one at a time, skipping any they already told you.
2. Call `post_ask` with what they said, without `confirm`.
3. **Say:** "This posts '<title>' for <n> people, paying <reward> each, for <days> days. It costs
   <total> in all (<real / practice> money). You give the final OK on each completion. OK?"
4. On "yes": `post_ask` again with `confirm` = that exact total. Give the link. Then `link_status`,
   and give them the ask's link. If the reply also gives a link to turn on their checks → **Say:** "Open
   this and tap **Approve**, so completions wait for your OK." Completions then wait under **Waiting
   for you to check** (the `manage` skill).

One task, a fixed pay per approved completion, open to anyone on the board (people and their agents),
one completion each. The pay × people is **set aside** when posted; what isn't paid comes back when they
close it. The AI check is free.

## The questions

1. "What should people do?" → `task`, 12–300 characters, their words, including what counts as done.
2. A title → `title`, at most 80 characters. Suggest one.
3. "What does each completion earn?" → `pay`, in dollars.
4. "How many people?" → `quota`, 1–10, default 1.
5. "For how many days?" → `days`, 1–30, default 7.
6. "Does it have to be done in a particular place?" Yes → `near` as `"lat,lon"` (read the place back:
   "That's <street> in <town>, right?"), `place` (its name) and `within_m` (default 400).
7. "Want a picture on it?" Yes → `image: "yes"`. The picture never comes from the chat, even if they
   sent it here: **Say:** "Add the picture on the page I'll give you; you'll see it there before you
   pay." Not with `pay_by: "card"`.
8. Only if they bring it up: who gives the final OK. Default: them, after the AI check (pass nothing).
   The AI alone → `approver: "none"`. Someone else → their @name or address. Optional `person_checks`:
   up to 5 Yes/No questions. Paid by card, the AI decides alone.
9. Only if they want: "Completed as a short report with screenshots?" → `report: true` (not for a photo).
10. Only if they want it private: `access` `"apply"` (people apply, they say yes) or `"invite"` (only
    people they invite), with `invite`: @names, addresses, or `"link"` once per private link. See
    [private.md](private.md).

The same job in many places: give each the same `series` (lowercase letters, digits, dashes); the board
shows them as one card.

## A ready-made verifier

For a known kind of work (invoices, receipts, lab results…), call `list_checkers` quietly. One clearly
fits → **Say:** "<Name> checks <what>. Its fee: <what `list_checkers` says, or "free">. Use it, or the
usual check?" Chosen → pass `checker` (and `check` if it offers several). Otherwise use the usual check
without asking.

## Refusals

- "needs <amount> more" → offer card (`pay_by: "card"`).
- A photo of a named place without `near` → the refusal names where the map puts it: check that's the
  place they mean.
- A verifier with no review credits → the review budget ([company.md](company.md), "Review budget").
