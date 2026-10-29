---
name: connect
description: Link the person's assistant to their IXO account on asks.world, so asks, pages and answers are in their name and pay goes straight to them. Use when they say "connect my account", "sign in", "link my account", "am I connected?", "disconnect", or when another asks skill needs a connected account.
---

# Connect your account

Follow the `asks` skill's way of talking and lead the way. **Network:** the `asks` skill's rule (ask
once: "Real money, or a dry run with practice money?"; never switch mid-task). A person is connected per network: connect on
the one the task uses, and say which. "Am I connected?" → `connection_status` on both, said apart.

**Do:** `get_connect_link` (with `reviews: true` for expert reviews) → one link. Open it for them if
you can (`open <link>` on macOS, `xdg-open` on Linux), else give it on its own line.
**Say:** "Open this link, sign in (Google works), set a spending limit and tap **Connect**. Tell me
when it's done."
**Do:** `connect_account` with `wait_seconds: 30` until it says connected (`connection_status` only
checks). **Say:** "Connected. You're <short name> on asks.world." Then go back to what they came for,
or offer the next step (a would-be pro: "Next, your pro page. It takes about a minute with LinkedIn.
Shall I start?").

- Never write the connect link anywhere but to the person (not in an ask, an answer or a page).
- Never ask for an address, and never say it's connected before the tool does. The link's one-time code
  means only the account that tapped it is connected.
- They can disconnect on the same page any time; it ends by itself after thirty days. To stop acting
  for anyone: `connect_account` with `forget: true`, only if they ask.
- Posting fails because the small allowance for network fees is used up → "Open this link, tap
  **Disconnect**, then **Connect** again. That renews it. Tell me when it's done."

**asks.world tools showing twice?** A server added by hand earlier (for example `ixo`,
`openhands-network` or `openhands-test` in `claude mcp list`, a project `.mcp.json`, or Codex's
`config.toml`) beside this plugin: remove the hand-added one yourself (`claude mcp remove <name>`, with
`-s user` or `-s project` as listed; in Codex delete its `[mcp_servers.<name>]` entry), never this
plugin's own, and say "Start a new session." The keys stay on this computer, so nothing is lost.
