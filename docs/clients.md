# Clients

IXO plugins reach your assistant in one of three ways. Which one you get depends on the app and on
whether the plugin's MCP server is **hosted** (a URL IXO runs) or **local** (a command your app starts).

| App | Plugin | Custom connector (URL) | Local command |
| --- | --- | --- | --- |
| Claude Code | Yes: `/plugin install <name>@ixo-plugins` | Yes (`claude mcp add`) | Yes, from a plugin |
| Codex | Yes: `codex plugin add <name>@ixo-plugins` | Yes (`codex mcp add`) | Yes, from a plugin |
| Claude.ai, Claude Desktop | No | Yes: *Settings → Connectors → Add custom connector* | No (use the hosted connector) |
| ChatGPT | No | Yes: *Settings → Apps & Connectors*, in developer mode | No (use the hosted connector) |

## Claude Code

```text
/plugin marketplace add ixoworld/ixo-plugins
/plugin install <plugin-name>@ixo-plugins
```

- **Hosted plugins** (oracles, memory, `ixo-openhands-*`): run `/mcp`, pick the plugin's server and
  choose **Authenticate** when the plugin signs in with IXO. The Openhands hosted plugins need no sign-in.
- **Local plugins** (`ixo-openhands`): needs **Node.js 22.6 or newer**, because the plugin starts
  `npx -y @ixo/openhands-mcp@1`. No sign-in: the server keeps its own key on your machine.
- Claude Code expands `${VAR}` and `${VAR:-default}` in a plugin's `.mcp.json`, so a local plugin
  can offer switches such as `OPENHANDS_NETWORK`, read from the shell that starts Claude Code.
- Update with `/plugin marketplace update ixo-plugins`, then reconnect the server in `/mcp`.

## Codex

```bash
codex plugin marketplace add ixoworld/ixo-plugins
codex plugin add <plugin-name>@ixo-plugins
```

- **Hosted plugins** with IXO sign-in: Codex asks you to sign in when you install. If it doesn't, run
  `codex mcp list` and `codex mcp login` with the plugin's server name.
- **Local plugins**: need **Node.js 22.6 or newer** too. Codex reads the portable `mcp.json`, which supports
  `stdio` servers but does **not** expand environment variables (only `${PLUGIN_ROOT}` and
  `${PLUGIN_DATA}`), so a local plugin's settings, such as the network, are fixed when it is built (to change them, edit the installed plugin's `mcp.json`; for Openhands see [its page](kinds/openhands.md#choosing-the-network)).
- Codex's marketplace entry for a plugin that needs no sign-in says `ON_USE` for authentication:
  Codex has no "none" value; `ON_USE` is the closest documented one, not a statement that none is needed.

## Claude.ai and Claude Desktop

No plugins: add a **custom connector** with the URL of a hosted plugin's MCP server, and sign in if it asks.

- Oracles and memory: the URLs are in [oracles](kinds/oracle.md) and [memory](kinds/memory.md).
- Openhands (read-only, no sign-in): `https://openhands.network/v1/mcp` (mainnet) or
  `https://test.openhands.network/v1/mcp` (testnet).

A local plugin cannot run here: there is no command to start. Use its hosted connector, or use Claude
Code or Codex for the full tool set.

## ChatGPT

No plugins: in *Settings → Apps & Connectors*, in developer mode, add a custom connector with the
URL. On a Pro plan, developer mode only runs the read tools, so a connector that spends money or
writes is limited there. The Openhands hosted connectors are read-only anyway.

## What each format supports

| | Claude Code `.mcp.json` | Portable `mcp.json` (Codex, Agent Plugins 1.0.0) |
| --- | --- | --- |
| Hosted server | `{"type": "http", "url": …}` | `{"type": "streamable-http", "url": …}` |
| Local server | `{"type": "stdio", "command": …, "args": […], "env": {…}}` | the same stdio shape |
| `${VAR}` / `${VAR:-default}` in `env` | Yes (Claude Code expands them) | No: only `${PLUGIN_ROOT}` and `${PLUGIN_DATA}` |
| Secrets in the file | Never (this repo only allows `${VAR}` references) | Never: `env` is visible package data |

Sources: the [Agent Plugins specification](https://agent-plugins.org/specification) and its
[`mcp.schema.json`](https://agent-plugins.org/schemas/1.0.0/mcp.schema.json); Codex's
`PluginInstallPolicy` and `PluginAuthPolicy` in
[openai/codex](https://github.com/openai/codex/tree/main/codex-rs/app-server-protocol/schema/typescript/v2).
