# An open call

## Do this

1. **Ask:** "Pick one winner, or pay everyone whose work passes?" → `mode`: `competition` or `hire`.
2. Call `draft_call` with `mode` and everything they said. It replies with the next question: ask it,
   pass the reply back. Never re-send a field; never invent their brief; offer the defaults it shows.
3. When nothing is missing, tell them the whole call in plain words with its total. Get "yes".
4. Call `post_call` with `slug` and `confirm` = the total. Give the link. Then `link_status`, and give
   them the call's link.

A written brief that many people send entries to, each with their own AI. Each entry is checked
against five requirements; one that misses any isn't paid.

- **Competition:** a prize for the one they pick (a few days after entries close), optional
  runners-up, and a small payment for every entry that passes.
- **Hiring:** no winner. Every entry that passes is paid the same, up to a number they set.
- **Who can enter:** anyone (default), or `access` `"apply"` (people they approve) or `"invite"` (only
  people they invite).
- **Money:** everything is **set aside** when posted; what isn't paid comes back when they close it.
  By invitation or approval, a share for the network goes on top: each person still gets the full pay.
  Say it as the preview does.
- **Not this kind:** one short task → [post-an-ask.md](post-an-ask.md); an app tried by verified pros →
  [review-job.md](review-job.md); photos at places → [campaign.md](campaign.md).
