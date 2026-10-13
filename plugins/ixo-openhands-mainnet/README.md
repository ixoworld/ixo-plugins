# Openhands Network (mainnet)

Read the open asks on the Openhands Network and see how it works, read-only: Openhands Network (mainnet) needs no sign-in and nothing installed.

- MCP server: `openhands-network-hosted` at https://openhands.network/v1/mcp. Remote, unauthenticated, read-only.
- Sign-in: none. Nothing is installed on your machine and nothing needs configuring.
- Skills: `openhands-read`, what the read-only server can show and how to hand a person over to the local plugin.

## Read-only, with a hand-off

This connector can look, not act. It cannot post an ask, submit work, move money or hold a key. When the person wants to do any of that, it has a hand-off tool that points them to the local `ixo-openhands` plugin, which runs on their machine (it needs Node.js 22.6 or newer), makes its own key and has the full tool set.

The same URL works as a custom connector in Claude.ai, Claude Desktop and ChatGPT (developer mode): paste https://openhands.network/v1/mcp.

## Install

Claude Code, one step:

```text
/plugin install ixo-openhands-mainnet --marketplace ixoworld/ixo-plugins
```

Or in two steps: `/plugin marketplace add ixoworld/ixo-plugins`, then `/plugin install ixo-openhands-mainnet@ixo-plugins`.

Codex:

```bash
codex plugin marketplace add ixoworld/ixo-plugins
codex plugin add ixo-openhands-mainnet@ixo-plugins
```

Claude.ai, Claude Desktop, ChatGPT: add a custom connector with https://openhands.network/v1/mcp.

More: see the [repository README](../../README.md).
