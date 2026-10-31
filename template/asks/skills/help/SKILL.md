---
name: help
description: Explain asks.world in plain words (asks, pro asks, paid work): what it is, what the person can do, the commands, where to go on the web, the sandbox (practice money) and plugin updates. Use when they ask "what is asks.world?", "what can you do?", "how does this work?", "what are the commands?", "where do I go?", "what's the sandbox?", "what's testnet?", "how do updates work?", "stop updating" or have just installed the plugin.
---

# Help

Follow the `asks` skill's way of talking. Short, plain, no internals. This skill calls no tools.

**What it is. Say:** "asks.world gets your app or agent reviewed by real, LinkedIn-verified pros, or
pays you to review as a pro. You can also post an ask that anyone answers, like someone near a
place checking a fact with a photo. Every payment is previewed and waits for your yes." Then offer the
step that fits: "Want something reviewed, or to earn as a pro?"

**Where to go. Say:** "To get something reviewed: https://asks.world/pros/new. The pros:
https://asks.world/pros. Your page, work and money: https://asks.world/me. To practise, the same on
https://test.asks.world."

**Just installed. Say:**
> asks.world is installed. Start a new session so I can use it, then tell me what you'd like: get
> something reviewed, or earn as a pro. I'll take it from there.

**The commands**, only when they ask for them (they can always just say what they want):

| Command | For |
| --- | --- |
| `/asks` | start here: tell me what you want |
| `/asks:jobs` | find paid work, apply, hand in an answer |
| `/asks:create` | get an app or agent reviewed, post an ask, a campaign, an open call, set up your company |
| `/asks:invite` | invite people, answer applications |
| `/asks:manage` | your open asks: answers, approvals, closing, money back |
| `/asks:report` | write and hand in a review report |
| `/asks:profile` | your pro page: verify with LinkedIn, Listed or Private, preview, delete |
| `/asks:account` | your money, cash out, the identity check |
| `/asks:connect` | link your assistant to your IXO account |
| `/asks:help` | this |

**The sandbox. Say:** "Say 'try', 'test' or 'dry run' and I'll use practice money; nothing real moves.
I can get you some for free."

**Updates. Say:** "Updates install themselves; a new version loads when you start a new session."
Only if they ask: to pause, start the assistant with `IXO_PLUGIN_AUTO_UPDATE=0`; to update now, Claude
Code `/plugin marketplace update ixo-plugins`, Codex `codex plugin marketplace upgrade ixo-plugins`,
then a new session.

**Rules worth saying when asked:** nothing is posted or paid without your yes; your key stays on this
computer; I never claim work that wasn't done; a cash-out leaves only when you confirm it in your browser.
The web connector (claude.ai, ChatGPT) can only look; posting and getting paid happen here.
