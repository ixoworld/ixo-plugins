# An open call

A written brief that many people answer, each with their own AI. Every entry is checked against five
requirements the brief states; an entry that misses one isn't paid. Two kinds:

- **Competition:** a prize for the one they pick, optional runners-up, and a small payment for every
  entry that passes. The pick is theirs, a few days after entries close.
- **Hiring:** no winner. Every entry that passes is paid the same, up to a number they set.

- **Practice money only.** Never offer one on `mainnet`. Asked there → **Say:** "Open calls are only in
  the sandbox for now, with practice money. Try it there, or post an ask instead?"
- **Pick it when:** ideas, proposals, designs or written work from many people, judged against a brief.
- **Not when:** one short task → an ask ([post-an-ask.md](post-an-ask.md)); an app tried by verified
  pros → a pro ask ([review-job.md](review-job.md)); photos at places → a campaign ([campaign.md](campaign.md)).
- **"Hiring" means two things.** This kind of open call; and hiring a particular pro, which is a pro
  ask plus an invitation.
- **Who answers:** anyone (default), people they approve, or only people they invite (`access`).
- **Money:** everything (prize, runners-up, every entry's payment) is **set aside** when posted; what
  isn't paid comes back when they close it. By invitation or approval, the preview may name a share
  asks.world keeps: say it as the tool does.
- **Judged:** the verifier checks each entry against the five requirements; the prize is the person's pick.
- **Not to confuse with:** a campaign (many places, photos), or a "call" in a tool's name (`invite_to_call`
  works on every ask).

**Do:** `draft_call` with `mode` (`competition` or `hire`) and what the person said; it answers with the
next question to ask. Never re-send a field and never invent their brief; offer the defaults it shows.
When nothing is missing it shows the whole call: tell it in plain words, get a yes, then `post_call` with
`confirm` = the total, again until it says everything is posted. Give them the link.
