# Post a task: the questions and the fields

The person reads only the **Say** lines and the questions, in plain words. Ask one at a time, each
with its default.

A personal task never passes `org` or `oracle`: Openhands' usual check reviews it. Only company tasks
pick a checker, and those belong to the Openhands HQ plugin (`ixo-openhands-hq`).

**First,** for a specialised task (invoices, receipts, lab results, contracts…), call `list_checkers`
quietly. If an expert checker clearly fits, recommend it in ONE sentence: "Acme Finance checks
invoices: amount, date and supplier, for a small fee per check. Use them, or Openhands' usual check?"
Otherwise use the usual check without asking. An expert → pass `checker` (and `check` if it offers
several); its own rules and form apply. `ask_the_world` takes both too.

## The questions

1. "What should people do?" → `task`: everything whoever answers must do, 12–300 characters, their words.
2. A short title for the card → `title`, at most 80 characters. Suggest one and let them change it.
3. "What does each answer earn?" → `pay`, in IXO by default; on live they can pick USDC → `currency: "USDC"`. Never PAY.
4. "How many people should do it?" → `quota`, 1–10, default 1.
5. "For how many days should it stay open?" → `days`, 1–30, default 7.
6. "Does it have to be done in a particular place?" If yes, turn the name into `"lat,lon"`, read the
   place back, then pass `near`, `place` (the name people see) and `within_m` (20–20000, default 400).
   A photo of a named place must be taken there: without `near` it is refused, and the refusal names
   where the map puts the place. Check that is the place they mean.
7. "What counts as done? What should the answer show?" Fold it into `task`.
8. "Do you have a picture for it?" Optional → `image` (png, jpg or webp, at most 5 MB; a file path,
   an https link or a data: URL).
9. "Who gives the final OK: the AI, or you?" Default the AI (pass nothing). **You** → `approver: "me"`;
   **someone else they trust** → ask for that person's @name or Openhands address and pass it. The AI
   still checks every answer first. Needs a connected account. Optional `person_checks`: up to 5 Yes/No
   questions for whoever decides (any No turns the answer down). With an expert checker, "you" only if
   that check has a person step.
10. If a person decides, and it isn't a photo task or an expert checker: "Want people to answer with a
    short report and screenshots?" Yes → `report: true`; "Any extra section it must have?" → `report`
    = the section names instead (up to 5, 60 characters each).
11. Only when it matters, not on every task: "Who can answer? Anyone, people you approve, or only
    people you invite?" → `access`: `"public"` (default), `"apply"` or `"invite"`, with `invite`: a
    list of @names or addresses, and `"link"` once for each private link wanted.

The same job at many places? Give each the same `series` name (lowercase letters, digits, dashes);
the board shows them as one card and each pays on its own.

## Preview, post, after

**Do:** `post_ask` without `confirm`; it answers with the exact total (rewards plus any check fee).

**Say:** "This posts '<title>' for <n> people, paying <reward> each, for <days> days. It costs <total>
in total. <The checker> checks <what>. OK?" With an approver add "you check each answer before it's
paid" (or "<name> checks…"). On yes, `post_ask` again with `confirm` = that exact total. Give them the
task's link.

**With an approver**, the reply ends with one link. **Say:** "Open this link and tap **Approve** to
turn on your checks." Answers then wait on the website: "Open <site>/me, under **Waiting for you to
check**, read each and press **Send decision**." Never sign, approve or turn down anything for them.

**Invites and applications.** After posting, give each private link to one person (privately).
`invite_to_call` adds more people; `call_invites` shows who was invited and who applied;
`decide_application` says yes or no to one applicant, only on the person's word.
