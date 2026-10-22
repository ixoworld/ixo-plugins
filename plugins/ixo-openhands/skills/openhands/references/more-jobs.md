# More jobs

All of these preview first and take `confirm` exactly like posting a task. Rewards are in IXO, never
PAY. A person does the work; you fund it and read the evidence. Say every amount with its coin.

**Clean one spot:** `post_cleanup` (`near` as `"lat,lon"`, `pay`, optional `place`, `within_m`
default 150, `quota` 1–3, `days` 1–14 default 3, `follow_days` with `follow_pay` to pay again later if
it stayed clean; the preview says what those cost). Someone photographs it, clears it, photographs it
again. **Say:** "Someone will clean <place> for <reward>, with before and after photos. It costs
<total>. OK?"

**Map rubbish where people find it:** `organise_campaign` (`name`, `pins` 1–200, `pin_pay`, optional
`days` default 30). It pays for each mess photographed, on the campaign's own map.

**An open call** (people answer with their own AI): a **competition** (a prize plus runners-up) or a
**hire** (everyone whose work passes is paid, up to a number). `draft_call` with what the person said;
it answers with the next question to ask, in order. Never send a field twice and never invent their
brief; offer the defaults it shows. When nothing is missing it shows the whole call: tell it to them
in plain words, get a yes, then `post_call` with `confirm` = the total, once per part, until it says
everything is posted. Give them the link; a competition's pick is theirs. A call posts as the
connected account, so connect first. (An expert review of an app or agent is a call too: use the
**openhands-expert-builder** skill.)

**For a company** (its own rules, payouts, posting as the company): the Openhands HQ plugin
(`ixo-openhands-hq`).
