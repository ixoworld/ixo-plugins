# {{TITLE}}

{{DESCRIPTION}}

**Draft.** Some steps wait on commands that are still being built; the skill says which and stops there instead of working around them.

- For: Claude Code and Cowork. Claude runs the setup as ordinary terminal commands on your computer, so it needs a client that can run them, plus Node.js 22.6 or newer (for `npx`).
- Skill: `openhands-hq`, a short interview and then twelve steps: sign in, create your organisation, fund it, set up the one way you pay workers (on chain in IXO or USDC, USDC on Base, or Stripe; review fees are PAY from your Console credits), link an oracle, connect the Openhands tools, and post your first ask. Each step checks its own result, so if you stop, run it again and it carries on where it stopped.
- MCP server: `{{SERVER}}`, the same Openhands server as `ixo-openhands` (`npx -y {{PACKAGE}}@{{MAJOR}}`). Network `{{NETWORK}}` by default; set `OPENHANDS_NETWORK` to switch (Claude Code). Until IXO publishes the version this skill needs, start Claude Code with `OPENHANDS_MCP_PACKAGE=file:/abs/path/ixo-openhands-mcp-0.0.0-development-<commit>.tgz` (IXO sends the file; see the skill's command table).
- Secrets never go into the chat. Keys go from your clipboard straight into Cloudflare (`pbpaste | wrangler secret put`). The IXO sign-in file is deleted at the end, because it has full power and never expires.

## Start

```text
/plugin install {{NAME}} --marketplace ixoworld/ixo-plugins
```

Then say: *Set up my company on Openhands.*

More: see [docs/kinds/openhands-hq.md](../../docs/kinds/openhands-hq.md).
