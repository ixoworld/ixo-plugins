---
name: import-chat-history
description: Use when the user wants to bring what another assistant knew about them into IXO Memory (devnet) — from a ChatGPT, Claude or other chat export or a saved memory list. Curates short dated thoughts, gets the user's approval, then stores them one by one.
---

# Import chat history into memory

This plugin connects you to **IXO Memory (devnet)** (`https://memory-engine.devnet.ixo.earth/v1/mcp`) through the `ixo-memory-devnet` MCP server. Importing
uses `add_memory`, which needs the `memory:write` scope on the user's IXO sign-in. If the tool is
missing, the token doesn't carry that scope; see "If the tool is missing" in the remember skill.

The goal is a short list of things worth knowing about the user — not a copy of their old chats.

## 1. Read the export

Ask the user for the export or paste: a ChatGPT data export (`conversations.json`), a Claude export,
a "saved memories" list, or notes. Read it yourself if it's a file on this machine; otherwise ask
them to paste the relevant part. If it's very large, work through it in parts and tell them.

## 2. Curate it into thoughts

Pull out short, self-contained, typed thoughts:

- **Preference**: how they like to work, write, be spoken to.
- **About the user**: role, skills, location if they shared it, goals.
- **Person**: someone they deal with, the relationship and the context.
- **Project**: what it is, its status, who's involved.
- **Decision**: what they decided and why.

For each thought keep the date it was said or became true when the export shows it (a message or
conversation timestamp). Drop anything that was only true for one chat, anything later contradicted
(keep the newer one, and say it changed), and duplicates.

Leave out entirely, and don't show in the list:

- passwords, API keys, tokens, recovery phrases, card or bank numbers, or anything that looks like a
  credential;
- other people's private details (health, finances, things shared in confidence);
- whole transcripts, long quotes or pasted documents.

## 3. Show the list and get approval

Show the thoughts as a numbered list, grouped by type, each with its date. Ask the user to approve,
remove or edit items. Store nothing until they approve; store only what they approved.

## 4. Store each thought

Call `add_memory` once per approved thought:

- `name`: a short title, e.g. `"Preference — meeting times"`.
- `content`: the thought as one self-contained sentence or two, with the original date written in the
  text when known (*"As of 14 March 2024, the user leads the mobile app project at Kumo Labs."*).
  `add_memory` has no date field; the date goes in the text.
- `source`: `"text"`.
- `source_description`: where it came from, e.g. `"imported from ChatGPT export"`.

Make the calls one after another, not all at once; the engine files them in the background (each
answer gives a `queue_position`), so newly imported memories may take a while to show up in search. Search's `recent_memory` strategy
filters by when a memory was stored, so right after an import everything imported looks recent.
If a call returns `success: false`, note it and carry on.

## 5. Report

Say how many thoughts were stored and list any that failed. Don't claim anything was stored that
wasn't. Offer to check a few with the recall skill a little later.
