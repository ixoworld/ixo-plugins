# Post an ask: the questions and the fields

Ask one at a time, each with its default. The person reads only the questions and the preview.

A personal ask passes no `org` and no `oracle`: the usual check reviews it. As a company, see
[company.md](company.md).

**First,** for a specialised ask (invoices, receipts, lab results, contracts…), call `list_checkers`
quietly. If an expert verifier clearly fits, recommend it in one sentence: "<Name> checks invoices:
amount, date and supplier, for a small fee per check. Use them, or the usual check?" If chosen, pass
`checker` (and `check` if it offers several). Otherwise use the usual check without asking.
`ask_the_world` takes these too.

## The questions

1. "What should people do?" → `task`: everything whoever answers must do, 12–300 characters, their
   words. Fold "what counts as done" into it.
2. A title for the card → `title`, at most 80 characters. Suggest one.
3. "What does each answer earn?" → `pay`, said in dollars ("$8.00"); never ask about coins. <!-- plain-ok -->
4. "How many people?" → `quota`, 1–10, default 1.
5. "For how many days?" → `days`, 1–30, default 7.
6. "Does it have to be done in a particular place?" If yes, turn it into `"lat,lon"`, read it back,
   and pass `near`, `place` (the name people see) and `within_m` (20–20000, default 400). A photo of a
   named place without `near` is refused, and the refusal names where the map puts it: check it's the
   place they mean.
7. "Do you have a picture for it?" Optional → `image` (png, jpg or webp, at most 5 MB; a path, an https
   link or a data: URL).
8. "Who gives the final OK: the AI, or you?" Default the AI (pass nothing). You → `approver: "me"`;
   someone they trust → that person's @name or address. Optional `person_checks`: up to 5 Yes/No
   questions (any No turns the answer down). With an expert verifier, "you" only if its check has a
   person step.
9. If a person decides and it isn't a photo task or an expert verifier: "Answer with a short report and
   screenshots?" → `report: true`, or the extra section names (up to 5, 60 characters each).
10. Only when it matters: "Who can answer? Anyone, people you approve, or only people you invite?" →
    `access`: `"public"` (default), `"apply"` or `"invite"`, with `invite`: @names or addresses, and
    `"link"` once per private link. For a private ask **Say** once: "Only you, whoever answers and the
    verifier can read the answers on the site; anyone can see that one came in and how the check went."

The same job at many places: give each the same `series` (lowercase letters, digits, dashes); the board
shows them as one card.

## Preview and post

**Do:** `post_ask` without `confirm`. **Say:** "This posts '<title>' for <n> people, paying <reward>
each, for <days> days. It costs <total> in total (<real / play> money).< You check each answer before
it's paid.> OK?" On yes, again with `confirm` = that exact total. Give them the link.

**With an approver** the reply ends with one link. **Say:** "Open this link and tap **Approve** to turn
on your checks." Answers then wait on the website under **Waiting for you to check**. Never sign,
approve or turn down anything for them.

**Refusals:** "needs <amount> more" → the `account` skill (or connect first); "the small allowance for
network fees is used up" → **Say:** "Open this link, tap **Disconnect**, then **Connect** again. That
renews it. Tell me when it's done." (`get_connect_link`, then wait as the `connect` skill says, then try
again). A verifier that takes its fee when you post, with no credits → `top_up` (the `account` skill).
