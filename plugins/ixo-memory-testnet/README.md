# IXO Memory (testnet)

Your IXO Companion's memory — remember, recall and import what matters, with your IXO sign-in. Testnet (test network).

- MCP server: `ixo-memory-testnet` → https://memory-engine.testnet.ixo.earth/v1/mcp
- Sign-in: IXO (no API key). The plugin asks for `memory:read` (recall), `memory:write` (remember, import) and `memory:delete` (forget, erase).
- Skills: `recall`, `remember`, `import-chat-history`. Nothing is deleted without your explicit yes.

## Install

Claude Code, one step:

```text
/plugin install ixo-memory-testnet --marketplace ixoworld/ixo-plugins
```

Or in two steps: `/plugin marketplace add ixoworld/ixo-plugins`, then `/plugin install ixo-memory-testnet@ixo-plugins`.

For other clients, see the [repository README](../../README.md).
