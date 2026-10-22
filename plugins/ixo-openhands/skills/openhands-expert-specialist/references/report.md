# Write the report

For an Expert Review, or any task that wants a report with screenshots. Interview the person one
plain question at a time and write it in **their** words. Never add a finding they didn't see.

- **Summary:** what was checked (`product`), `date`, what was in and out of scope (`scope`), the
  overall result (`outcome`); if they know them, the version (`build`), where it ran (`environment`)
  and who it is for (`target`).
- **Steps,** one per thing tried (an Expert Review needs one for every scenario): `id` (s1, s2…),
  `what`, what should happen (`expected`), what did happen (`observed`), `result`: `passed`, `failed`,
  `blocked`, `not_tested` or `excluded`.
- **Problems found:** `id` (f1…), `title`, the steps it came from (`steps`), `observed`, `expected`,
  who it hurts and how (`impact`), `severity` (`blocker`, `major`, `minor`) and why (`severity_why`).
  A major one needs `how_to_reproduce`; a blocker that, or `cannot_reproduce` (what's missing). How
  sure they are → `uncertainty`.
- **What to do:** each with `text`, `priority` (`high`, `medium`, `low`), the problems it fixes
  (`findings`), who should do it (`target`) and how you'd know it's done (`done_when`).
- **What couldn't be checked** → `limitations`; each extra section the review names → `sections`
  (`{ heading: text }`).
- **Screenshots or a PDF** → `files`, full paths (png, jpg, webp, pdf; names of letters, digits, `-`,
  `_`). `evidence` on a step or problem = a file's name without its extension. Empty lists are fine.
- No passwords, test logins or personal data anywhere in it: on a private review only the builder,
  the author and the automated checks read it on the site, but the report and screenshots are kept on a public
  file store, reachable by exact link. Blur or
  crop a screenshot that shows one, or leave it out.

If any part came from what you remember about them or earlier chats, ask them first and pass
`uses_memory: true`.

Before handing in, read it back to them in plain words (not the field names): "You tried 5
scenarios: 4 worked, 1 failed. One serious problem: <title>. Your advice: <text>."
