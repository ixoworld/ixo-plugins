# Signing in

How a plugin knows who you are depends on where its MCP server runs.

## Hosted plugins: IXO sign-in

Oracles and IXO Memory run on IXO's infrastructure. They sign you in with **IXO Auth Hub** (OAuth):
your app opens IXO's sign-in page, you sign in with your IXO account, and the page shows which app is
asking and everything it asks to do. You **Allow** or **Cancel** it as a whole — there are no
per-permission switches.

- No API key, ever. The plugin carries only the service's public URL.
- Each sign-in works only at the one service it was made for.
- Disconnect an app any time from IXO's *Connected apps* page.
- Where: Claude Code `/mcp` → **Authenticate**; Codex asks at install, or `codex mcp login`;
  Claude.ai, Claude Desktop and ChatGPT ask when you add the connector.

What each kind asks for is in [oracles](kinds/oracle.md) and [memory](kinds/memory.md).

For a service to be signed in this way it must publish OAuth protected-resource metadata (RFC 9728)
for its MCP endpoint, naming IXO Auth Hub as the authorization server and listing its
`scopes_supported`, and be listed in Auth Hub's catalogue — ask the IXO team for an entry.

## asks.world: its own sign-in, with Google

The asks.world connectors (`asks`, `asks-testnet`) run their own OAuth sign-in in front of `/v1/mcp`,
the shape Claude Code, Codex, claude.ai and ChatGPT expect (protected-resource and authorization-server
metadata, dynamic client registration, PKCE). The sign-in page signs you in with IXO's Google login;
the token your app gets is bound to your asks.world account and works only on that one site (mainnet
or the sandbox). asks.world keeps no password, recovery words or signing key of yours: anything that
needs your signature is a link you tap on asks.world, signed in your browser.

- Where: Claude Code `/mcp` → **Authenticate**; Codex at install or `codex mcp login asks`; claude.ai,
  the Claude phone app and ChatGPT when you add or connect the connector.
- The plugins use `/v1/mcp/me`, which answers 401 until you sign in: that is what opens the sign-in.
  Plain `/v1/mcp` never asks and only reads (the board, an ask, a pro).
- Sign out from the same place (Claude Code `/mcp` → **Clear authentication**; `codex mcp logout`;
  the connector's **Disconnect**). See [asks.world](kinds/asks.md).

## No keys in plugins

No plugin contains a key, and neither does this repository: only `${VAR}` references could appear in
a plugin's files, and CI scans the tree for secrets.
