# IXO Plugin Updates

Automatically check for IXO plugin releases once a day when a session starts and refresh installed plugins through Claude Code or Codex.

Install this once in each client where you want automatic updates for your installed IXO plugins.
It needs Node.js 22 or newer and that client's CLI on `PATH`. It has no MCP server or sign-in.

## Install

Claude Code:

```text
/plugin marketplace add ixoworld/ixo-plugins
/plugin install ixo-plugin-updates@ixo-plugins
```

Codex:

```bash
codex plugin marketplace add ixoworld/ixo-plugins
codex plugin add ixo-plugin-updates@ixo-plugins
```

Start a new session and review/trust the bundled hook when the client asks. Codex exposes hook
trust under `/hooks`. Installation alone does not bypass the client's hook review.

## How updates work

On session startup, an asynchronous hook checks at most once per 24 hours. It runs only
`claude plugin marketplace update ixo-plugins` or `codex plugin marketplace upgrade ixo-plugins`.
For Claude it first reads `claude plugin list --json`, then explicitly runs `claude plugin update`
for each installed IXO plugin at its existing user, project or local scope, including disabled
plugins. Project installs use their recorded directory; managed installs are left to the admin.
The client fetches its configured marketplace and refreshes installed plugin copies, including
this updater. The default source follows `main`, where IXO publishes releases; explicitly pinned
marketplace refs continue to follow that pin. This does not select GitHub release tags or npm's
`latest` tag, change a network, or install every plugin in the catalog.

The running chat may keep its loaded versions. Start a new session after a successful check;
Claude Code also supports `/reload-plugins`. Hosted MCP services deploy independently.

Failures leave updating to the client and retry at a session start after an hour. They never
prevent starting a chat. Concurrent sessions share a lock. Status contains timestamps and the
client's exit code, never client output, tokens or keys. A successful check means the client
command completed; it does not prove a newer version was available or every server reconnected.

## Controls

Ask your assistant to **check IXO plugin update status**, **update IXO plugins now**, **pause IXO
plugin updates**, or **resume IXO plugin updates**. The `plugin-updates` skill runs the appropriate
control. You can also run the bundled script from this installed plugin's directory:

```bash
node scripts/update.mjs --client codex --status
node scripts/update.mjs --client codex --now
node scripts/update.mjs --client codex --disable
node scripts/update.mjs --client codex --enable
```

Use `--client claude` in Claude Code. `--now` bypasses the daily delay, but respects pause and
environment opt-outs. Disable or uninstall this plugin in the client's plugin manager to remove
its startup hook. `IXO_PLUGIN_AUTO_UPDATE=0` also stops checks. For Claude, `DISABLE_AUTOUPDATER`
is respected unless `FORCE_AUTOUPDATE_PLUGINS` is enabled.

State lives at `~/.codex/ixo-plugin-updates/state.json` or
`~/.claude/ixo-plugin-updates/state.json`, respecting `CODEX_HOME` / `CLAUDE_CONFIG_DIR`.

## Client limits

This hook runs where Claude Code or Codex can execute local commands, including their supported
desktop sessions. It requires the matching CLI on `PATH`; a desktop app alone may not provide it.
It cannot run in a web chat, an uploaded ZIP with no local runtime, or cloud-orchestrated ChatGPT
Work. For Claude Code you can alternatively enable native auto-update under
`/plugin → Marketplaces → ixo-plugins → Enable auto-update` without installing this plugin.
Choose one updater to avoid duplicate checks. Workspace marketplace imports in ChatGPT use
admin-managed sync instead. See [update support](../../docs/updates.md).
