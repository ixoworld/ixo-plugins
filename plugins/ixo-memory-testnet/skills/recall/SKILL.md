---
name: recall
description: Use before answering anything personal or about the user's history — their preferences, people, projects, past decisions, "what did I say about", "do you remember" — by searching IXO Memory (testnet). Read-only; it never stores or deletes anything.
---

# Recall from memory

This plugin connects you to **IXO Memory (testnet)** (`https://memory-engine.testnet.ixo.earth/v1/mcp`), the memory the user's IXO Companion keeps for
them. Its MCP server is `ixo-memory-testnet`. The user is signed in with IXO; you never need an API key.

Searching needs the `memory:read` scope on the user's IXO sign-in. If the tool is missing, the token
doesn't carry that scope (see below).

## When to search

Before you answer a question that depends on who the user is or what happened before — a preference,
a person they mentioned, a project's history, a decision they made — call `search_memory_engine`
on the `ixo-memory-testnet` server first. Don't search for general knowledge questions that don't involve
the user.

## How to call it

`search_memory_engine` takes:

- `query` (required): a short natural-language question about the thing you need, in the user's
  words. Search for the subject, not the whole message: *"Thandi's role and how the user works with
  her"*, not *"can you draft an email to Thandi about Friday"*. Ask two narrow questions rather than
  one broad one.
- `strategy` (required): use `"balanced"` unless you have a reason not to. `"recent_memory"` for
  "lately" / "this week" questions (it filters by when a memory was stored, not when it happened, so
  right after an import everything imported looks recent); `"precise"` for one specific fact; `"diverse"` for an overview;
  `"entities_only"`, `"topics_only"`, `"facts_only"` to narrow the result; `"contextual"` only with a
  `center_node_uuid` copied exactly from an earlier result.
- `knowledge_level`: `"user"` for questions about the user themselves (their preferences, their work,
  their people). The default `"both"` also searches shared knowledge; use it when shared knowledge
  could help.
- Optional filters: `node_labels` (e.g. `["Person"]`, `["Project"]`, `["Preference"]`), `edge_types`
  (e.g. `["WorksWith"]`), and the date filters `valid_at`, `invalid_at`, `created_at`, `expired_at`.
  Date filters use exactly this shape: `[[{"date": "2025-01-15T00:00:00Z", "comparison_operator": ">"}]]`
  (operators `=`, `<>`, `>`, `<`, `>=`, `<=`, `IS NULL`, `IS NOT NULL`). Leave filters out when
  unsure; a wrong filter hides real results.

The result has `nodes` (people, projects and other things, each with a `summary`), `facts` (each with
a `fact` sentence, a `uuid` and dates such as `valid_at` / `invalid_at`) and `communities` (summaries
of related groups). Each item has a `knowledge_scope`: `user_private` is the user's own memory;
`organization_public` is the oracle's public shared knowledge, not something the user said.
Anything else (including `unknown`) is not the user's own; don't treat it as theirs.

## Using what comes back

- Use the facts and summaries as written. Don't add details they don't contain, and don't say "you
  told me" about shared (`organization_*`) knowledge.
- Prefer current facts. A fact with an `invalid_at` date stopped being true then; say so if it
  matters ("you used to …").
- If two facts conflict, say so and ask which is right; offer to remember the correction (the
  remember skill).
- If nothing relevant comes back, say you don't have it in memory and answer without it, or ask.
  Never present a guess as a memory.
- Something remembered a moment ago may not be searchable yet: the engine files new memories in the
  background.

## If the tool is missing or refused

If `search_memory_engine` isn't available, or the call fails asking for authentication, the plugin
isn't connected or its token doesn't carry the `memory:read` scope. Tell the user to reconnect and
approve: in Claude Code, `/mcp` → the `ixo-memory-testnet` server → Authenticate; in Codex,
`codex mcp login ixo-memory-testnet`. IXO's page asks once for everything the app requests.
