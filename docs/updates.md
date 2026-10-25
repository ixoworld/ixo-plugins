# Plugin updates

IXO releases plugins by merging `develop` into `main` and increasing changed plugins' versions.
Updates follow the marketplace source configured in the client. A pinned ref stays pinned;
GitHub release tags and a local MCP package's npm dist-tag are separate from plugin releases.

## Automatic updates in local Claude Code and Codex sessions

Install **`ixo-plugin-updates`** once in each client to check for releases at session startup:

```text
# Claude Code
/plugin marketplace add ixoworld/ixo-plugins
/plugin install ixo-plugin-updates@ixo-plugins
```

```bash
# Codex
codex plugin marketplace add ixoworld/ixo-plugins
codex plugin add ixo-plugin-updates@ixo-plugins
```

Review the bundled hook when prompted (Codex: `/hooks`), then start a new session. The hook runs
in the background, at most once per day, using that client's native marketplace update command.
It refreshes installed IXO plugins through the client. A network or CLI failure retries on a
session start after an hour. It does not run on a timer while the client is closed.
For Claude it also lists installed plugins and explicitly updates each IXO plugin at its existing
user, project or local scope, including disabled plugins, without enabling it. Managed installs
stay under admin control.

Requirements: Node.js 22+, the matching CLI on `PATH`, a Git marketplace registered as
`ixo-plugins`, and a client that supports trusted asynchronous `SessionStart` plugin hooks.
This includes supported local desktop sessions with these prerequisites; it does not make web
chats or cloud-orchestrated ChatGPT Work able to execute local hooks.

Ask for **IXO plugin update status**, **update IXO plugins now**, **pause IXO plugin updates**, or
**resume IXO plugin updates**. You can also disable/uninstall the updater in the plugin manager,
or set `IXO_PLUGIN_AUTO_UPDATE=0` in the environment that launches the client. State and manual
commands are documented in the [updater README](../plugins/ixo-plugin-updates/README.md).

The current conversation can retain the versions it loaded. Start a new session to use the
refreshed plugins. In Claude Code, `/reload-plugins` can apply them during the session. A
successful check records that the native command completed, not that any plugin changed.

## Native client options

| Client / installation | Update route |
| --- | --- |
| Claude Code, including its supported desktop surfaces | `/plugin → Marketplaces → ixo-plugins → Enable auto-update`. Claude checks after session start and prompts to reload. Third-party marketplaces default to auto-update off. Use this or the updater plugin to avoid duplicate checks. |
| Codex with a configured Git marketplace | The updater invokes `codex plugin marketplace upgrade ixo-plugins`; the client refreshes installed caches. Client versions may also provide their own background refresh. |
| ChatGPT workspace marketplace imported by an admin | New marketplace imports sync daily. An admin can use **Admin → Plugins → Marketplaces → Sync now**. Local updater hooks do not configure this service. |
| Claude account-synced plugins, Cowork uploads, other remote catalogs | Use that surface's plugin update/sync controls. This repository cannot force an account-managed client to run a local hook. |
| A hosted MCP URL added as a connector | There is no installed IXO skill bundle to update. The service deploys independently; reconnect or reauthenticate if the client requests it. |

In Claude Code, the updater respects `DISABLE_AUTOUPDATER` unless
`FORCE_AUTOUPDATE_PLUGINS` is enabled. Client hook trust, managed policy and filesystem permissions
still apply. The updater does not change authentication, network selection or permissions.

## Manual update and troubleshooting

Claude Code:

```text
/plugin marketplace update ixo-plugins
/reload-plugins
```

For an individual installed plugin (including a disabled one), use
`claude plugin update <plugin-name>@ixo-plugins --scope <user|project|local>` from its project
directory where applicable. The updater does this for the installed IXO entries automatically.

Codex:

```bash
codex plugin marketplace upgrade ixo-plugins
```

Then start a new Codex session. If the updater reports failure, verify the matching CLI is on
`PATH`, check the marketplace is registered, and run its manual command to see the client's
diagnostic. The updater deliberately keeps client output out of its state file. A read-only
state directory or malformed state file leaves startup usable but prevents automatic updates;
inspect the file before repairing it. A killed process's lock expires after five minutes.

Sources checked for this implementation:

- [Claude Code: keep plugins updated](https://code.claude.com/docs/en/discover-plugins#keep-plugins-updated)
- [OpenAI: package plugins and lifecycle hooks](https://developers.openai.com/plugins/build/plugins#bundled-mcp-servers-and-lifecycle-hooks)
- [Codex hooks and trust](https://learn.chatgpt.com/docs/hooks)
- [ChatGPT workspace marketplace sync](https://learn.chatgpt.com/docs/enterprise/plugin-management#keep-plugins-up-to-date)
- [Codex marketplace upgrade implementation](https://github.com/openai/codex/blob/main/codex-rs/core-plugins/src/manager.rs)
