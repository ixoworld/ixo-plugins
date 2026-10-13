<p align="center">
  <img src="assets/banner.svg" alt="IXO Plugins — signed decisions on claims, right inside your AI assistant" width="100%">
</p>

<p align="center">
  <a href="https://github.com/ixoworld/ixo-plugins/actions/workflows/validate.yml"><img alt="validate" src="https://github.com/ixoworld/ixo-plugins/actions/workflows/validate.yml/badge.svg"></a>
  <img alt="Claude Code" src="https://img.shields.io/badge/Claude%20Code-plugin-0b1220?labelColor=3ad6c5">
  <img alt="Codex" src="https://img.shields.io/badge/Codex-plugin-0b1220?labelColor=5b8cff">
  <img alt="MCP" src="https://img.shields.io/badge/MCP-OAuth%20sign--in-0b1220?labelColor=7f93ad">
</p>

Sometimes you need someone neutral to say *"yes, this really happened."* A courier says the parcel
was delivered. A farmer says the trees were planted. An agent says the job was done.

**IXO oracles** check claims like these against a published set of rules and give you a decision —
`approve`, `reject` or `review` — signed by IXO's decision engine, so anyone can check it later.

These plugins put that inside your AI assistant. You say what you want in plain words; the assistant
reads what the oracle needs, sends the claim, asks you to approve the fee, and comes back with the
decision and a receipt you can verify.

**IXO Memory** is the other kind of plugin here: the memory your IXO Companion keeps for you, in
your AI assistant. Ask it to remember something, and it's there next time — in whichever app you
use with your IXO sign-in.

<p align="center">
  <img src="assets/flow.svg" alt="You ask → the assistant sends the claim → you approve the fee on IXO → the engine decides and signs a receipt" width="100%">
</p>

## Get started

Add the marketplace once, then install the plugins you want.

**Claude Code**

```text
/plugin marketplace add ixoworld/ixo-plugins
/plugin install ixo-swiftdrop-devnet@ixo-plugins
```

Then run `/mcp`, pick `plugin:ixo-swiftdrop-devnet:ixo-shipment-delivery`, and choose
**Authenticate**. Your browser opens IXO's sign-in page — sign in and click **Allow**. That's it.

For IXO Memory it's the same: `/plugin install ixo-memory@ixo-plugins`, then in `/mcp` pick
`plugin:ixo-memory:ixo-memory` and **Authenticate**. (`ixo-memory-testnet` and `ixo-memory-devnet`
are the test networks.)

**Updating.** When we ship a new version, run `/plugin marketplace update ixo-plugins` in Claude
Code, then reconnect the server in `/mcp`.

**Codex**

```bash
codex plugin marketplace add ixoworld/ixo-plugins
codex plugin add ixo-swiftdrop-devnet@ixo-plugins
```

For IXO Memory it's `codex plugin add ixo-memory@ixo-plugins`.

Codex asks you to sign in with IXO when you install. If it doesn't, run `codex mcp list` and
`codex mcp login` with the plugin's server name (for example `ixo-shipment-delivery` or
`ixo-memory`; the memory plugins' server names match their plugin names).

**Claude.ai, Claude Desktop, ChatGPT and other apps**

You don't need a plugin there. Add the oracle (or IXO Memory) as a custom connector with its URL
and sign in when asked:

```text
https://shipment-delivery-oracle.devnet.ixo.earth/v1/mcp
https://memory-engine.ixo.earth/v1/mcp
https://memory-engine.testnet.ixo.earth/v1/mcp
https://memory-engine.devnet.ixo.earth/v1/mcp
```

In Claude it's *Settings → Connectors → Add custom connector*. In ChatGPT it's *Settings → Apps &
Connectors* in developer mode (on a Pro plan, developer mode only runs the read tools).

**What you allow when you sign in.** IXO's page shows which app is asking and everything it asks
to do, and you approve or cancel it as a whole — there are no per-permission switches. For an oracle
that's reading what it offers and submitting claims (every charge still waits for your approval).
The IXO Memory plugin asks for all three memory permissions: `memory:read` (recall what you've
stored), `memory:write` (remember new things and import) and `memory:delete` (forget one thing, or
erase everything). A connection has less only when the app asks for less — for example
`memory:read` alone makes it read-only. Through the plugin, the assistant only ever reads, writes
and deletes your own memory. It can also read the knowledge your IXO Companion publishes for
everyone, but it can't add to that, and it never sees the Companion's private knowledge. Each
sign-in works only at the one service it was made for.

## What you can install

### Oracles

| Plugin | What it decides | Network |
| --- | --- | --- |
| [`ixo-swiftdrop-devnet`](plugins/ixo-swiftdrop-devnet) | Proof of delivery for SwiftDrop Express couriers | devnet — for testing |

More are coming. Each oracle is its own plugin, because your sign-in for one oracle only ever works
at that oracle — so you install only the ones you actually use.

### Memory

| Plugin | What it does | Network |
| --- | --- | --- |
| [`ixo-memory`](plugins/ixo-memory) | Your IXO Companion's memory — remember, recall and import what matters | mainnet |
| [`ixo-memory-testnet`](plugins/ixo-memory-testnet) | The same, on the test network | testnet — for testing |
| [`ixo-memory-devnet`](plugins/ixo-memory-devnet) | The same, on the development network | devnet — for testing |

One plugin per network: devnet, testnet and mainnet memories are separate, and so are their
sign-ins. Install `ixo-memory` unless you are testing.

## Then just ask

> *"Am I set up to get SwiftDrop decisions?"* — checks your sign-in and what it costs, without
> paying anything.
>
> *"Submit a delivery for order ORD-1042: delivered, code 7420, here's the photo: https://…"*
>
> *"Is the receipt for that claim genuine?"*

The plugin comes with three skills that teach the assistant how to do this properly:
**submit-claim**, **verify-decision**, and **can-we-pay** (which only reads — it never submits or
pays).

With IXO Memory:

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

## Your money, your call

This is about oracle plugins, where a decision has a fee. Nothing gets charged without you.

- **You approve every claim.** Before anything costs money, IXO shows you the oracle, the app and
  the exact price on its own page. You click **Approve** there — the assistant can't do it for you.
- **Or set your own limits.** Where the oracle allows it, you can tick *"don't ask again"* on the
  approve page for a trusted app, with a per-claim limit, a total (up to $100) and an end date (up to 7 days). You can change
  it or turn it off any time.
- **There's a daily ceiling.** An app never spends more than $20 a day through IXO.
- **You can cut an app off.** Disconnect it from IXO's *Connected apps* page.

The fee pays for the decision. It's not a payout to anyone — and a decision on its own doesn't mean
anyone is allowed to act on it. That's still up to your own rules.

## What the assistant can do

### With an oracle

| Tool | In plain words |
| --- | --- |
| `list_protocols` | What you can submit and what it costs — or exactly what one kind of claim needs. |
| `upload_file` | Gives a one-time link to upload a file for a claim, with a **Choose file** card. |
| `submit_claim` | Sends a claim and waits up to 90 seconds for the decision. Asks for your approval first. Safe to retry. |
| `get_decision` | Looks up a decision, any review that's pending, and the payment. Never shows your answers back. |
| `verify_receipt` | Checks a decision's signed receipt, by claim id or from a receipt you already have. |

### With IXO Memory

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

- **No cards, or a tool seems to be missing.** Your app loads the oracle's tools when it connects.
  After an update (new tools or cards), reconnect once: quit and reopen the app, or run `/mcp` and
  reconnect in Claude Code. A new chat alone isn't enough, and you stay signed in.
- **It needs a photo.** Give it a link (`https://…`), or let it upload one: it shows a card with
  **Choose file** (in Claude Code or Codex it can upload a file from your machine itself).
- **It shows you an "approve" link.** Open it, check the price, approve, then tell it to carry on.
- **The app won't run `submit_claim`.** Some apps hold back tools that might spend money. Allow just
  that one tool (in Claude Code: `/permissions` → Allow →
  `mcp__plugin_ixo-swiftdrop-devnet_ixo-shipment-delivery__submit_claim`). Please don't switch your
  app's safety checks off — you don't need to, since every charge still waits for you anyway.
- **"Choose a source."** You belong to more than one workspace on that oracle — tell it which one.
- **"No source."** You need a workspace on that oracle that you own. Create one in its Decision
  Console.
- **Your card wants 3-D Secure.** Open the bank's link it shows you, confirm, and tell it to continue.
- **Sign-in fails.** Run `/mcp` (Claude Code) or `codex mcp login` (Codex) again. You'll need an IXO
  account.
- **Memory can recall but won't remember or forget (or the memory tools are missing).** The
  connection was made without that permission: the app didn't ask for it (`memory:write` to
  remember, `memory:delete` to forget). Reconnect the plugin's memory server (`ixo-memory`, or
  `ixo-memory-testnet` / `ixo-memory-devnet`) and approve again.

## For oracle operators

Every oracle plugin here is built from the same skills in [`template/oracle`](template/oracle).
Adding yours is one command:

```bash
bun run add-oracle --name <plugin-name> --title "<Your oracle>" \
  --url https://<your oracle>/v1/mcp --description "<one line about what it decides>"
bun run validate
```

That writes `plugins/<plugin-name>/` with everything Claude Code and Codex need, and lists it in
both marketplaces. A plugin only ever holds your oracle's public URL — never a key. See
[CONTRIBUTING.md](CONTRIBUTING.md), then open a pull request and the IXO team will review it.

## For other IXO services

Plugins come in kinds — today `oracle` and `memory` — each with its own template under
[`template/`](template). Any IXO service that signs people in with IXO can have one. Your service
needs to:

- publish OAuth protected-resource metadata (RFC 9728) for its MCP endpoint, naming IXO Auth Hub as
  the authorization server and listing its `scopes_supported`;
- be listed in Auth Hub's catalogue — ask the IXO team for an entry.

Then use an existing kind, or add one (see [CONTRIBUTING.md](CONTRIBUTING.md)), and run
`bun run add-plugin --kind <kind> …`.

## License

The plugins are free to install and use with your AI assistant. Everything else in this repository
is IXO's — please don't copy, modify or redistribute it. See [LICENSE](LICENSE).

## Security

Found something? Please report it privately — see [SECURITY.md](SECURITY.md).

---

<p align="center"><sub>Made by <a href="https://ixo.world">IXO</a>. Oracles don't decide anything themselves — IXO's decision engine does, against each protocol's published rules, and signs every result.</sub></p>
