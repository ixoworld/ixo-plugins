# {{TITLE}}

{{DESCRIPTION}}

- For: Claude Code and Cowork. Claude runs every step on your computer, so it needs Node.js 22.6 or newer.
- Skill `openhands-hq`: sets your company up. A few plain questions, then Claude does the rest and tells you exactly what to click: your company on Openhands, the one way you pay people (on chain in IXO or USDC, with nothing to set up; or USDC on Base or card, through a small payouts service in your Cloudflare account), the reviewer that checks answers, your review budget, and your first task. If you stop, run it again and it carries on where it stopped.
- Skill `openhands-everyday`: everything after that, in two or three questions and one yes: post a task (as you or as your company), Ask the World, campaigns, open calls, check answers, get paid, and your review budget.
- Tools: `{{SERVER}}`, the same Openhands server as `ixo-openhands` (`npx -y {{PACKAGE}}@{{MAJOR}}`), on `{{NETWORK}}` by default; set `OPENHANDS_NETWORK` to switch. If IXO sends you a newer package, start Claude Code with `OPENHANDS_MCP_PACKAGE=file:/abs/path/to/it.tgz claude`.
- Your keys never go into the chat. If the setup signs you in, it offers to remove that sign-in when it's done.
- The web connector on claude.ai or ChatGPT can only look; setting up, posting and paying happen here.

## Start

```text
/plugin install {{NAME}} --marketplace ixoworld/ixo-plugins
```

Then say: *Set up my company on Openhands.*

More: see [docs/kinds/openhands-hq.md](../../docs/kinds/openhands-hq.md).
