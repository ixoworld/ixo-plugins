# Clients

IXO plugins reach your assistant in one of two ways: as a **plugin** (skills plus the server's URL)
or as a **custom connector** (the URL alone). Every plugin with a server is **hosted**: a URL IXO
runs, so nothing is installed on the computer.

| App | Plugin | Custom connector (URL) |
| --- | --- | --- |
| Claude Code | Yes: `/plugin install <name>@ixo-plugins` | Yes (`claude mcp add`) |
| Codex | Yes: `codex plugin add <name>@ixo-plugins` | Yes (`codex mcp add`) |
| Claude app (Desktop), paid plan | Yes: *Customize → Plugins → Add marketplace* | Yes: *Settings → Connectors → Add custom connector* |
| Claude.ai on the web, Claude phone app | No | Yes: *Settings → Connectors → Add custom connector* |
| ChatGPT | No | Yes: *Settings → Apps & Connectors*, in developer mode |

## Claude Code

```text
/plugin marketplace add ixoworld/ixo-plugins
/plugin install <plugin-name>@ixo-plugins
```

- **Hosted plugins** (oracles, memory, asks): run `/mcp`, pick the plugin's server and
  choose **Authenticate** when the plugin signs in.
- Update with `/plugin marketplace update ixo-plugins`, then reconnect the server in `/mcp`.
- Moving from an `ixo-openhands*` plugin: nothing to do; the catalog's `renames` moves it to `asks`.

## Codex

```bash
codex plugin marketplace add ixoworld/ixo-plugins
codex plugin add <plugin-name>@ixo-plugins
```

- **Hosted plugins** that sign in: Codex asks you to sign in when you install. If it doesn't, run
  `codex mcp list` and `codex mcp login` with the plugin's server name (`asks`, `asks-testnet`, …).
- Codex reads the portable `mcp.json`, which does **not** expand environment variables (only
  `${PLUGIN_ROOT}` and `${PLUGIN_DATA}`).
- **Reinstall as `asks`.** Codex's catalog has no `renames` (its marketplace format reads only
  `name`, `interface` and `plugins`), so an old `ixo-openhands*` plugin is not moved: run
  `codex plugin remove ixo-openhands@ixo-plugins` (or whichever you had), then
  `codex plugin add asks@ixo-plugins`.
- Codex's marketplace entry for a plugin that needs no sign-in says `ON_USE` for authentication:
  Codex has no "none" value; `ON_USE` is the closest documented one, not a statement that none is needed.

## Claude app (Claude Desktop)

On a paid plan you can add plugins in the app:

1. *Customize → Plugins → Add → Add marketplace → Add from a repository*, and enter `ixoworld/ixo-plugins`.
2. *Discover*, pick a plugin, *Add*. Plugins sync to your account.

Source: support.claude.com, "Use plugins in Claude".

## Claude.ai on the web and the Claude phone app

No plugins: add a **custom connector** with the URL of a hosted plugin's MCP server, and sign in if it asks.

- Oracles and memory: the URLs are in [oracles](kinds/oracle.md) and [memory](kinds/memory.md).
- asks.world: `https://asks.world/v1/mcp` (mainnet) or `https://test.asks.world/v1/mcp` (testnet).
  Sign in with Google when you connect it (without `/me` it never asks, and only reads the board). Anything that
  moves money is a link to tap on asks.world, which works the same on a phone. See
  [asks.world](kinds/asks.md).

## ChatGPT

No plugins: in *Settings → Apps & Connectors*, in developer mode, add a custom connector with the
URL. On a Pro plan, developer mode only runs the read tools, so a connector that writes is limited
there. The asks.world connector's own tools spend nothing: money always moves on asks.world, with a
tap.

## What each format supports

| | Claude Code `.mcp.json` | Portable `mcp.json` (Codex, Agent Plugins 1.0.0) |
| --- | --- | --- |
| Hosted server | `{"type": "http", "url": …}` | `{"type": "streamable-http", "url": …}` |
| Local server (no plugin here uses one) | `{"type": "stdio", "command": …, "args": […], "env": {…}}` | the same stdio shape |
| `${VAR}` / `${VAR:-default}` in `env` | Yes (Claude Code expands them) | No: only `${PLUGIN_ROOT}` and `${PLUGIN_DATA}` |
| Secrets in the file | Never (this repo only allows `${VAR}` references) | Never: `env` is visible package data |

Sources: the [Agent Plugins specification](https://agent-plugins.org/specification) and its
[`mcp.schema.json`](https://agent-plugins.org/schemas/1.0.0/mcp.schema.json); Codex's
`PluginInstallPolicy` and `PluginAuthPolicy` in
[openai/codex](https://github.com/openai/codex/tree/main/codex-rs/app-server-protocol/schema/typescript/v2).
