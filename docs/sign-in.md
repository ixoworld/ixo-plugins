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

## Read-only connectors: nothing

The asks.world web connectors are unauthenticated and read-only. There is nothing to sign in to.

## Local plugins: a key instead

A local plugin's server runs on your machine and holds a key of its own instead of an IXO sign-in.
The asks.world server makes its key the first time it runs and keeps it under
`~/.openhands/<network>`; see [asks.world](kinds/asks.md). The plugin never contains the key, and
neither does this repository: only `${VAR}` references to a key can appear in a plugin's files, and
CI scans the tree for secrets.
