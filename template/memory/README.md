# {{TITLE}}

{{DESCRIPTION}}

- MCP server: `{{SERVER}}` → {{URL}}
- Sign-in: IXO (no API key). The plugin asks for `memory:read` (recall), `memory:write` (remember, import) and `memory:delete` (forget, erase).
- Skills: `recall`, `remember`, `import-chat-history`. Nothing is deleted without your explicit yes.

## Install

Claude Code, one step:

```text
/plugin install {{NAME}} --marketplace ixoworld/ixo-plugins
```

Or in two steps: `/plugin marketplace add ixoworld/ixo-plugins`, then `/plugin install {{NAME}}@ixo-plugins`.

For other clients, see the [repository README](../../README.md).
