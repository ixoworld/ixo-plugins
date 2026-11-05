---
name: connect
description: Link the person's assistant to their IXO account on asks.world, so asks, pages and completions are in their name and pay goes straight to them. Use when they say "connect my account", "sign in", "link my account", "am I connected?", "disconnect", or when another asks skill needs a connected account.
---

# Sign in

Follow the `asks` skill's way of talking and lead the way. Signing in links this assistant to their
own asks.world account: what you post, complete or earn is theirs, and pay goes straight to them. It
happens once, in their app's own sign-in screen, never in the chat. This connector is
{{#TESTNET}}the sandbox (practice money); the real-money one has its own sign-in{{/TESTNET}}{{^TESTNET}}real
money; the sandbox has its own sign-in{{/TESTNET}}.

**Am I connected?** **Do:** `my_status`. Signed in → **Say:** "You're signed in as <short name> on
asks.world." If `my_status` isn't there, or a tool says to sign in, they aren't.

**Sign in.** **Say** the one line for their app, then wait:

- **Claude Code:** "Type `/mcp`, pick **{{SERVER}}** and choose **Authenticate**. A page opens: sign
  in with Google. Tell me when it's done."
- **Codex:** "Run `codex mcp login {{SERVER}}` in a terminal, or I can run it for you. A page opens:
  sign in with Google. Tell me when it's done." (On their yes you may run it.)
- **claude.ai or the Claude phone app:** "Open Settings → Connectors, find **asks.world** and tap
  **Connect**. Sign in with Google. Then come back to this chat."
- **ChatGPT:** "Open Settings → Apps & Connectors, find **asks.world** and tap **Connect**. Sign in
  with Google. Then come back to this chat."
- Not sure which app → ask: "Which app are you using me in?"

Then **Do:** `my_status`. **Say:** "Signed in. You're <short name> on asks.world." and go back to what
they came for, or offer the next step (a would-be pro: "Next, your pro page. It takes about a minute
with LinkedIn. Shall I start?"). The sign-in tools may only show up in a new chat or session: if
`my_status` still isn't there, **Say:** "Start a new chat and ask me again; I'll pick it up."

- Never ask for a password, code or address in the chat, and never say they're signed in before
  `my_status` does.
- Signed in as the wrong Google account → sign out (below) and sign in again.
- **Sign out / disconnect:** in their app: Claude Code `/mcp` → **{{SERVER}}** → **Clear
  authentication**; Codex `codex mcp logout {{SERVER}}`; claude.ai, the phone app or ChatGPT: the
  connector's **Disconnect** in Settings. Only if they ask.

**asks.world tools showing twice?** An older asks.world server added by hand (for example `ixo`,
`openhands-network` or `openhands-test` in `claude mcp list`, a project `.mcp.json`, or Codex's
`config.toml`) beside this plugin: offer to remove the hand-added one (`claude mcp remove <name>`,
with `-s user` or `-s project` as listed; in Codex delete its `[mcp_servers.<name>]` entry), never this
plugin's own, and on their yes do it and say "Start a new session."
