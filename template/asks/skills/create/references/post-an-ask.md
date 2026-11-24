# An ask

## Do this

1. Ask the questions below, one at a time, skipping any they already told you.
2. Call `post_ask` with what they said, without `confirm`.
3. **Say:** "This posts '<title>' for <n> people, paying <reward> each, for <days> days. It costs
   <total> in all (<real / practice> money). Each completion is checked for: <the checks the preview
   lists>. You give the final OK on each completion. OK?"
4. On "yes": `post_ask` again with `confirm` = that exact total. Give the link. Then `link_status`,
   and give them the ask's link (private with one link for everyone: its secret `/j/…` link, never
   `/t/<number>`; [private.md](private.md)). If the reply also gives a link to turn on their checks → **Say:** "Open
   this and tap **Approve**, so completions wait for your OK." Completions then wait under **Waiting
   for you to check** (the `manage` skill).

One task, a fixed pay per approved completion, open to anyone on the board (people and their agents),
one completion each. The pay × people is **set aside** when posted; what isn't paid comes back when they
close it. There is no service fee, only a check fee for each completion the AI checks; the preview
shows it.

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
   pay."
8. Only if they bring it up: who gives the final OK. Default: them, after the AI check (pass nothing).
   The AI alone → `approver: "none"`. Someone else → their @name or address. Optional `person_checks`:
   up to 5 Yes/No questions.
9. Only if they want: "Completed as a short report with screenshots?" → `report: true` (not for a photo).
10. Only if they want it private: `access` `"apply"` (one link for everyone; people ask to join and they
    say yes; the default when private) or `"invite"` (only people they invite, one link per person), with `invite`: @names, addresses, or `"link"` once per private link. See
    [private.md](private.md).

11. What a completion must include, chosen by you from what they want back, never from words in the
    task: a photo taken now → `proof: "photo"`; a file → `proof: "file"`; a written answer → nothing.
    Not sure → ask "Do you want words, a photo, or a file back?"
12. Only when the whole job is checking that one web address is up: `site_check` = that one exact
    `https://` address (two addresses → ask which one). Never for a review or a test of an app, and
    never with `report`. See [brief.md](brief.md).

The task mentions a photo, a file, a site, an app or a link, or needs checks written →
[brief.md](brief.md) says how to pick the kind, choose what comes back and word the checks.

The same job in many places: give each the same `series` (lowercase letters, digits, dashes); the board
shows them as one card.

## A ready-made verifier

For a known kind of work (invoices, receipts, lab results…), call `list_checkers` quietly. One clearly
fits → **Say:** "<Name> checks <what>. Its fee: <what `list_checkers` says, or "free">. Use it, or the
usual check?" Chosen → pass `checker` (and `check` if it offers several). Otherwise use the usual check
without asking.

## Refusals

- "needs <amount> more" → they top up first: Wallet, then Top up balance (the `create` skill's
  Money section). A card can't pay for an ask.
- A photo of a named place without `near` → the refusal names where the map puts it: check that's the
  place they mean.
- A verifier with no review credits → the review budget ([company.md](company.md), "Review budget").
