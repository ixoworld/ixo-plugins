# {{TITLE}}

{{DESCRIPTION}}

## Who it's for

You want your own **evaluation oracle** on IXO: a small service that checks people's submissions
(a delivery, a photo of a planted tree, a finished task) and records a signed verdict. You don't
need to code. You tell your AI agent what you want checked, answer its questions, and click where
it tells you. The agent does the typing.

## What it does

- Skill `oracle-builder`: the guided setup. It asks what you want checked, explains each new word
  the first time it comes up, checks you have what you need, installs IXO's oracle package
  (`@ixo/decision-oracle`) into a new folder, and then takes you through the steps in order:
  sign in, design the form and the rules, publish them, write the checks, put your oracle online,
  and send a first test claim.
- Skill `oracle-terms`: the glossary, in plain words. What an oracle, a protocol, a rubric, a claim
  or a collection is, what is practice and what is real money, and what costs money.
- It builds on **testnet**: play money, nothing real is spent. Mainnet (real money) only when you
  ask for it. Nothing is signed on chain until you say yes,
  and the agent never shows your keys or recovery phrase.
- There is no server in this plugin. The agent runs IXO's `decision-oracle` tool in a terminal on
  your computer, and the package brings its own detailed skills for each step.

## Professional services and cloud authoring

The builder routes professional services through the separately installed `domain-author-pro-oracle`
and canonical `domain-author` skills from `ixoworld/ixo-agent-skills`. They prepare governed
documents for decision-oracle services, QiForge agents, or both. New constitutional checks remain
advisory; existing permissions, human claim review and signing requirements remain in force.

Cloud ChatGPT and Claude can prepare and review the documents. Upload and status tracking require
an authenticated Domain Runtime connection with content-upload support; this skills-only plugin
does not provide that server. Without it, keep a downloadable draft and mark upload pending.
Deployment resumes in Codex or Claude Code using a handoff with references and receipts, never
hosting credentials. Existing domains retain their identities and unrelated configuration.

## What you need

- A computer where your agent can use a terminal (Claude Code, Cowork or Codex), with
  [bun](https://bun.sh) and [Node.js](https://nodejs.org) 22 or newer (the agent offers to install
  them for you).
- A free Cloudflare account. Your oracle gets a free `workers.dev` address; your own domain is
  optional.
- An IXO login (the agent opens the sign-in page in your browser), a little IXO for fees, and an
  IXO subscription so the decision engine can bill you for decisions.

## Install

Claude Code, one step:

```text
/plugin install {{NAME}} --marketplace ixoworld/ixo-plugins
```

Or in two steps: `/plugin marketplace add ixoworld/ixo-plugins`, then `/plugin install {{NAME}}@ixo-plugins`.

Cowork: add the plugin marketplace `ixoworld/ixo-plugins`, then install `{{NAME}}`.

Codex:

```bash
codex plugin marketplace add ixoworld/ixo-plugins
codex plugin add {{NAME}}@ixo-plugins
```

## Start

Say: *I want to build my own IXO oracle.*

More: see [docs/kinds/oracle-builder.md](../../docs/kinds/oracle-builder.md).
