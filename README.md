<div align="center">

# IXO Plugins

**Independent, signed decisions on claims — inside your AI assistant.**

Ask your assistant to submit a claim to an IXO evaluation oracle. IXO's decision engine checks it,
decides `approve`, `reject` or `review`, and signs the result. You get a receipt anyone can verify.

Claude Code · Codex · and any app that speaks MCP

</div>

---

## What you get

Each plugin connects your assistant to **one IXO oracle** and teaches it how to use it:

| | |
| --- | --- |
| 🔐 **Sign in with IXO** | No API key, nothing to paste. Your assistant opens IXO's sign-in page once; you allow it. |
| ✅ **You approve every charge** | Before a claim costs anything, IXO shows you the oracle, the app and the exact price — you click **Approve**. Or set your own "don't ask again" limits. |
| 🧾 **Verifiable receipts** | Every decision is signed by IXO's decision engine. Anyone can check it — no need to trust the app that showed it to you. |
| 🧠 **Skills included** | `submit-claim`, `verify-decision`, and `can-we-pay` (a readiness check that never pays). |

## Available oracles

| Plugin | Oracle | Network |
| --- | --- | --- |
| [`ixo-swiftdrop-devnet`](plugins/ixo-swiftdrop-devnet) | **SwiftDrop Express** — proof of delivery for couriers | devnet (test network) |

> Each oracle is its own plugin on purpose: your IXO sign-in for one oracle only ever works at that
> oracle. Install the ones you need.

## Install

### Claude Code

```text
/plugin marketplace add ixoworld/ixo-plugins
/plugin install ixo-swiftdrop-devnet@ixo-plugins
```

Then connect it once: run `/mcp`, pick **plugin:ixo-swiftdrop-devnet:ixo-shipment-delivery**, choose
**Authenticate**, sign in with IXO in the browser and click **Allow**.

### Codex

```bash
codex plugin marketplace add ixoworld/ixo-plugins
codex plugin add ixo-swiftdrop-devnet@ixo-plugins
codex mcp login ixo-shipment-delivery
```

### Claude.ai, Claude Desktop, ChatGPT and other apps

No plugin needed — add the oracle as a remote MCP server (a "custom connector") with its URL, and
sign in when asked:

```text
https://shipment-delivery-oracle.devnet.ixo.earth/v1/mcp
```

- **Claude.ai / Claude Desktop:** Settings › Connectors › *Add custom connector*.
- **ChatGPT:** Settings › Apps & Connectors › developer mode › create a connector with the URL.

## How it works

```text
 You            Your assistant              IXO sign-in            IXO oracle + engine
  │  "submit this" ──▶ list_protocols ─────────────────────────────▶ work order (what it needs)
  │                   submit_claim ──────────────────────────────────▶ "approve this first" + link
  │ ◀── approval link ─┘
  │  Approve (you see oracle, app, price) ──▶ IXO signs a payment for this one claim
  │                   submit_claim (same request) ───────────────────▶ decided ✓  + signed receipt
  │ ◀── verdict, reasons, receipt ── verify_receipt ────────────────▶ valid ✓
```

- **Your sign-in** gives the app a short-lived token that works at that one oracle only.
- **Each submit** asks for your approval first. Approving signs a payment for **that one claim, at
  that price, to that oracle** — nothing more.
- **"Don't ask again"** (verified apps only): set a per-claim limit, a total (at most $100) and an
  end date (at most 7 days). Change or turn it off any time.
- **Disconnect** an app any time from IXO's *Connected apps* page or the Decision Console.

### Four things the assistant keeps apart

| Statement | Means |
| --- | --- |
| *The engine decided* | The verdict and its reasons. |
| *The receipt verifies* | The decision was signed by IXO's engine, unaltered. |
| *You may act* | Decided by your own rules — not by the plugin. |
| *Money moved* | Only what the claim's `payment` says. The evaluation fee pays for the decision; it is **not** a payout. |

## Tools

| Tool | What it does |
| --- | --- |
| `list_protocols` | The protocols you can submit under and their price — or one protocol's work order (answers, files, rules). |
| `submit_claim` | Submits a claim and waits up to 90 s for the decision. Asks for your approval first. Safe to retry. |
| `get_decision` | Reads a claim's decision, review tasks and payment. Never returns your answers. |
| `verify_receipt` | Verifies a decision's signed receipt — by claim id, or from a receipt you already hold. |

## Troubleshooting

| You see | Do this |
| --- | --- |
| The assistant asks you to **upload a photo** | Files go **by link**: give it an `https://` URL to the photo. |
| **"Approve this claim"** with a link | Open it, check the price, click **Approve**, then tell the assistant to continue. |
| The app **holds back `submit_claim`** | Allow just that tool — in Claude Code: `/permissions` › Allow › `mcp__plugin_ixo-swiftdrop-devnet_ixo-shipment-delivery__submit_claim`. Never turn safety checks off: every charge still needs your approval. |
| **"Choose a source"** | You belong to several workspaces on the oracle; tell the assistant which one. |
| **No source on this oracle** | Create one, or ask to be invited, in the oracle's Decision Console. |
| Sign-in fails | Run `/mcp` (Claude Code) or `codex mcp login <server>` (Codex) again. You need an IXO account. |

## Add an oracle

Every plugin is generated from the same skills in [`template/`](template). To add an oracle:

```bash
bun run add-oracle --name <plugin-name> --title "<Oracle title>" \
  --url https://<oracle host>/v1/mcp --description "<one line>"
bun run validate
```

This writes `plugins/<plugin-name>/` (Claude Code and Codex manifests, the MCP server, the skills)
and lists it in both marketplaces. Nothing secret is ever written: a plugin carries a URL, and users
sign in with IXO.

## About

Built by [IXO](https://ixo.world). Oracles decide nothing themselves — IXO's decision engine decides
against the protocol's published rubric and signs every result.
