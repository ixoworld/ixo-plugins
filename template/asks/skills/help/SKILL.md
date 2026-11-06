---
name: help
description: Explain asks.world in plain words (asks, pro asks, paid work): what it is, what the person can do, the commands, where to go on the web, the sandbox (practice money) and plugin updates. Use when they ask "what is asks.world?", "what can you do?", "how does this work?", "what are the commands?", "where do I go?", "what's the sandbox?", "what's testnet?", "how do updates work?", "stop updating" or have just installed the plugin.
---

# Help

## Do this

1. Say the one block below that fits their question. No tools.
2. End with one next step: "Want something reviewed, or to earn as a pro?"

Follow the `asks` skill's way of talking. Short, plain, no internals. This skill calls no tools.

**What it is. Say:** "asks.world gets your app or agent reviewed by real, LinkedIn-verified pros, or
pays you to review as a pro. You can also post an ask that anyone can complete, like someone near a
place checking a fact with a photo. Every payment is previewed, waits for your yes, and is confirmed
by you with one tap on asks.world." Then offer the step that fits: "Want something reviewed, or to
earn as a pro?"

**How it works. Say:** "You sign in once with Google. Most things I do right here in the chat. When
money moves or something needs your signature, I give you a link: you check it and tap once."

**Where to go. Say:** "To get something reviewed: https://{{#TESTNET}}test.{{/TESTNET}}asks.world/pros/new.
The pros: https://{{#TESTNET}}test.{{/TESTNET}}asks.world/pros. My Profile, My Asks and Wallet:
https://{{#TESTNET}}test.{{/TESTNET}}asks.world/me.{{^TESTNET}} To practise, the same on https://test.asks.world.{{/TESTNET}}"

**Just installed. Say:**
> asks.world is installed. Sign in once with Google when I ask, then tell me what you'd like: get
> something reviewed, or earn as a pro. I'll take it from there.

**The commands**, only when they ask for them (they can always just say what they want):

| Command | For |
| --- | --- |
| `/{{NAME}}` | start here: tell me what you want |
| `/{{NAME}}:jobs` | find paid work, apply, hand in a completion |
| `/{{NAME}}:create` | get an app or agent reviewed, post an ask, a campaign, an open call, set up your company |
| `/{{NAME}}:invite` | invite people, reply to applications |
| `/{{NAME}}:manage` | your open asks: completions, approvals, closing, money back |
| `/{{NAME}}:report` | write and hand in a review report |
| `/{{NAME}}:profile` | your pro page: verify with LinkedIn, Listed or Private, preview, delete |
| `/{{NAME}}:account` | your money, cash out, the identity check |
| `/{{NAME}}:connect` | sign in, see who you're signed in as, sign out |
| `/{{NAME}}:help` | this |

In claude.ai, the Claude phone app or ChatGPT there are no commands: just say what you want.

**The sandbox.** {{#TESTNET}}**Say:** "This is the sandbox: practice money, nothing real moves. I can
get you some for free. For real money, add asks.world's main connector."{{/TESTNET}}{{^TESTNET}}**Say:**
"The sandbox is a second asks.world connector with practice money; nothing real moves there. Add it
(the `asks-testnet` plugin, or https://test.asks.world/v1/mcp as a connector) and say 'dry run'."{{/TESTNET}}

**Updates. Say:** "There's nothing to update on your computer: asks.world runs on its own side and
changes there." Only if they ask about the plugin's own instructions: Claude Code `/plugin marketplace
update ixo-plugins`, Codex `codex plugin marketplace upgrade ixo-plugins`, then a new session.
"Stop updating" → the same reply: nothing updates itself on their computer.

**Rules worth saying when asked:** nothing is posted or paid without your yes and your tap; I never see
your password or keys; I never claim work that wasn't done; the same limits on spending apply in the
chat and on the page. It works the same in Claude Code, Codex, claude.ai, the Claude phone app and
ChatGPT.
