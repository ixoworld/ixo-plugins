# IXO Memory

**IXO Memory** is the memory your IXO Companion keeps for you, in your AI assistant. Ask it to
remember something, and it's there next time — in whichever app you use with your IXO sign-in.

- **Kind:** `memory`. **Runs:** hosted. **Sign-in:** IXO, see [sign-in](../sign-in.md).
- **Plugins:** [`ixo-memory`](../../plugins/ixo-memory/README.md) (mainnet),
  [`ixo-memory-testnet`](../../plugins/ixo-memory-testnet/README.md) (testnet, for testing) and
  [`ixo-memory-devnet`](../../plugins/ixo-memory-devnet/README.md) (devnet, for testing).
- One plugin per network: devnet, testnet and mainnet memories are separate, and so are their
  sign-ins. Install `ixo-memory` unless you are testing. Each plugin's MCP server has the plugin's
  own name (`ixo-memory`, `ixo-memory-testnet`, `ixo-memory-devnet`), so you can install more than
  one side by side.

## Install

Claude Code (then run `/mcp`, pick `plugin:ixo-memory:ixo-memory` and choose **Authenticate**):

```text
/plugin marketplace add ixoworld/ixo-plugins
/plugin install ixo-memory@ixo-plugins
```

For a test network install `ixo-memory-testnet` or `ixo-memory-devnet` instead; its server is
`plugin:ixo-memory-testnet:ixo-memory-testnet` (or `…-devnet`).

Codex: `codex plugin add ixo-memory@ixo-plugins` (after adding the marketplace). If it doesn't ask
you to sign in, run `codex mcp login ixo-memory` (the server name is the plugin name).

Claude.ai, Claude Desktop, ChatGPT: add a custom connector with the network's URL. See
[clients](../clients.md).

```text
https://memory-engine.ixo.earth/v1/mcp
https://memory-engine.testnet.ixo.earth/v1/mcp
https://memory-engine.devnet.ixo.earth/v1/mcp
```

## Then just ask

> *"Remember that I prefer short answers and morning meetings."*
>
> *"What did I decide about the Aurora launch date?"*
>
> *"Here's my ChatGPT export — bring over what matters."* — it shows you the list first and stores
> only what you approve.
>
> *"Forget what you know about my old address."* — it shows you the remembered facts it found and
> deletes them only after you say yes. That removes those facts; the note they were learned from may
> stay in your memory.

Its three skills are **recall**, **remember** (which also handles forgetting) and
**import-chat-history**. They never store passwords, keys or card numbers.

## What you allow when you sign in

IXO's page shows which app is asking and everything it asks to do, and you approve or cancel it as a
whole — there are no per-permission switches. The IXO Memory plugin asks for all three memory
permissions: `memory:read` (recall what you've stored), `memory:write` (remember new things and
import) and `memory:delete` (forget one thing, or erase everything). A connection has less only when
the app asks for less — for example `memory:read` alone makes it read-only. Through the plugin, the
assistant only ever reads, writes and deletes your own memory. It can also read the knowledge your
IXO Companion publishes for everyone, but it can't add to that, and it never sees the Companion's
private knowledge. Each sign-in works only at the one service it was made for.

## What the assistant can do

| Tool | Needs | In plain words |
| --- | --- | --- |
| `search_memory_engine` | `memory:read` | Finds what you've stored — people, projects, preferences, decisions — with dates. |
| `add_memory` | `memory:write` | Stores one memory. It's filed in the background, so search may take a moment to find it. |
| `delete_edge` | `memory:delete` | Deletes one remembered fact, after you confirm. Permanent. The note it was learned from, and the people or things it mentions, stay. |
| `delete_episode` | `memory:delete` | Deletes one stored note, after you confirm. Permanent. Needs the note's id, which search doesn't currently return. |
| `clear` | `memory:delete` | Wipes your whole memory space, after you confirm — including everything your IXO Companion has remembered for you, not just what this plugin stored. Permanent. |

The memory service also has a tool for adding knowledge shared with everyone who uses an oracle
(`add_oracle_knowledge`). It isn't available to plugin users, and the memory skills never use it.

## If something's off

- **No cards, or a tool seems to be missing.** After an update, reconnect once: quit and reopen the
  app, or run `/mcp` and reconnect in Claude Code. A new chat alone isn't enough, and you stay signed in.
- **Memory can recall but won't remember or forget (or the memory tools are missing).** The
  connection was made without that permission: the app didn't ask for it (`memory:write` to
  remember, `memory:delete` to forget). Reconnect the plugin's memory server (`ixo-memory`, or
  `ixo-memory-testnet` / `ixo-memory-devnet`) and approve again.
- **Sign-in fails.** Run `/mcp` (Claude Code) or `codex mcp login` (Codex) again. You'll need an IXO
  account.
