---
name: remember
description: Use when the user says "remember …", states a lasting preference or fact about themselves, their people or their projects, or asks you to forget something — store it in {{TITLE}}, or delete it there only after the user explicitly confirms.
---

# Remember (and forget)

This plugin connects you to **{{TITLE}}** (`{{URL}}`) through the `{{SERVER}}` MCP server. Storing
needs the `memory:write` scope on the user's IXO sign-in; forgetting (`delete_edge`,
`delete_episode`, `clear`) needs `memory:delete`. If a tool is missing, the token doesn't carry its
scope (see the end of this skill).

## Remember

Call `add_memory` when the user asks you to remember something, or states something durable: a
preference ("I prefer short answers"), a fact about themselves, a person and how they relate, a
project and its status, a decision and why. Not for passing chatter, and not for things that are
only true for this conversation.

`add_memory` takes:

- `name` (required): a short title, e.g. `"Writing preferences"`, `"Project Aurora status"`.
- `content` (required): one self-contained statement with its context. Name people with their role
  and relationship, say when it happened or became true (write the date in the text, e.g. *"As of
  March 2025, …"*), and why it matters. Write it so it still makes sense months later, without this
  chat. Good: *"Thandi Mokoena is the user's co-founder at Kumo Labs; she leads sales and prefers
  calls before 10:00."* Bad: *"She does sales."*
- `source`: `"text"` (the default; use it for almost everything). `"message"` is for a short
  transcript with speaker roles; `"json"` for structured data that must be kept exactly.
- `source_description`: where it came from, e.g. `"told in chat"`.

The answer has `success` and a `queue_position`: the engine files the memory in the background, so it
may take a moment before search finds it. Confirm back in one line, in plain words ("Got it — I'll
remember you prefer short answers."). If `success` is false, say it wasn't saved and why.

Never store:

- passwords, API keys, tokens, recovery phrases, card or bank numbers, or anything that looks like a
  credential — refuse politely and say why;
- private details about other people that they wouldn't expect to be kept (health, finances,
  anything shared in confidence), unless the user clearly wants it remembered and it's theirs to
  share;
- whole conversations or long pasted documents — remember the point, not the transcript.

If unsure whether something should be kept, ask.

`add_oracle_knowledge` (shared knowledge for everyone using an IXO oracle) is **not** available to
plugin users. Never call it, even if it is listed; this plugin only touches the user's own memory.

## Forget

When the user asks you to forget something:

1. Find it: call `search_memory_engine` (`knowledge_level: "user"`) and show the user the matching
   facts in plain words.
2. Ask them to confirm exactly which ones to delete. Deleting is permanent.
3. Only after a clear yes, call `delete_edge` once per fact, with `edge_uuid` set to that fact's
   `uuid` from the search result (copied character for character) and
   `confirmed_deletion_from_user: true`. Only delete facts whose `knowledge_scope` is
   `user_private`; anything else isn't the user's to delete here.
4. Say what was deleted, from each answer's `success` and `message`. Be accurate: `delete_edge`
   removes the remembered fact, not necessarily the original note it was learned from — that note
   and the people or things it mentions stay in memory.

`delete_episode` removes one stored note (an episode) by its `episode_uuid`, with the same
confirmation flag. Search doesn't currently return episode ids (`episodes` is empty), so use it only
when you already have an episode uuid from elsewhere; don't guess one, and don't take a fact's
`uuid` for an episode's.

`clear` (with `confirmed_deletion_from_user: true`) wipes the user's **whole** memory space — every
memory, person and fact, **including everything their IXO Companion has remembered for them**, not
just what this plugin stored — and cannot be undone. Use it only when the user asks to erase
everything. First say plainly what will be lost, including the IXO Companion's memories, and call it
only after they confirm that exact consequence in their own words. Never use `clear` to forget one
thing.

Never set `confirmed_deletion_from_user` to true unless the user confirmed in this conversation.

## If the tool is missing or refused

If `add_memory` isn't available, the token doesn't carry the `memory:write` scope. If
`delete_edge`, `delete_episode` or `clear` isn't available, it doesn't carry `memory:delete`. Either
way (or if a call fails asking for authentication), the app asked for less than this plugin needs,
or isn't connected. Tell the user to reconnect and approve: in Claude Code, `/mcp` → the
`{{SERVER}}` server → Authenticate; in Codex, `codex mcp login {{SERVER}}`. Don't tell them they
refused something: IXO's page asks once for everything the app requests.
