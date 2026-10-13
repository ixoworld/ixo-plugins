# IXO Memory (devnet)

Your IXO Companion's memory — remember, recall and import what matters, with your IXO sign-in. Devnet (test network).

- MCP server: `ixo-memory-devnet` → https://memory-engine.devnet.ixo.earth/v1/mcp
- Sign-in: IXO (no API key). The plugin asks for `memory:read` (recall), `memory:write` (remember, import) and `memory:delete` (forget, erase).
- Skills: `recall`, `remember`, `import-chat-history`. Nothing is deleted without your explicit yes.

## Install

Claude Code, one step:

```text
/plugin install ixo-memory-devnet --marketplace ixoworld/ixo-plugins
```

Or in two steps: `/plugin marketplace add ixoworld/ixo-plugins`, then `/plugin install ixo-memory-devnet@ixo-plugins`.

For other clients, see the [repository README](../../README.md).
