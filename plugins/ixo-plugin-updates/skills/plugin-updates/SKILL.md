---
name: plugin-updates
description: Check IXO plugin update status, update installed IXO plugins now, or pause and resume automatic updates.
---

# IXO plugin updates

Use the bundled `../../scripts/update.mjs` relative to this skill directory. Resolve it from the
installed skill's actual absolute path. Run it with Node.js and `--client claude` in Claude Code
or `--client codex` in Codex; use the current client only.

Map the user's request to one control:

| Request | Argument |
| --- | --- |
| Status / last check | `--status` |
| Update now | `--now` |
| Pause automatic updates | `--disable` |
| Resume automatic updates | `--enable` |

For example: `node "<absolute-plugin-root>/scripts/update.mjs" --client codex --status`.
Reading status is safe to do before diagnosing a failure. Run mutations only when the user asks
for that control. Keep shell paths quoted. The updater uses only the `ixo-plugins` marketplace.

Report the returned state. `checked` means the client's update command succeeded, not that a new
release was installed. `disabled` means a pause or environment opt-out applies; `busy` means
another check is running. After `checked`, tell the user to start a new session to load refreshed
plugins (Claude Code also supports `/reload-plugins`). A failure needs the matching CLI on PATH,
a configured marketplace and connectivity; inspect those before retrying once with `--now`.

If the environment cannot execute local commands, explain the client limitation and use its
native marketplace sync/update controls. Keep the client's hook trust and managed policy intact.
