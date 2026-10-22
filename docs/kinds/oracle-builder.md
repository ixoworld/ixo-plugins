# Oracle Builder

For a person with no coding background who wants their own IXO evaluation oracle. They install one
plugin, say *I want to build my own IXO oracle*, and their AI agent explains the terms, checks what
they need, installs IXO's oracle package and takes them through the steps in order.

- **Kind:** `oracle-builder` (skills only: no MCP server). For Claude Code, Cowork and Codex,
  because the agent runs IXO's `decision-oracle` tool in a terminal on the person's computer.
- **Today:** [`ixo-oracle-builder`](../../plugins/ixo-oracle-builder/README.md).
- **What is in it:** two skills, `oracle-builder` (the guided setup) and `oracle-terms` (the
  glossary, the networks and what costs money).

## How it works with the package

`bunx @ixo/decision-oracle init <dir>` makes the project and copies the package's own detailed
skills into it (`create-rubric`, `publish-protocol`, `write-facts`, `create-oracle`,
`create-collection`, `decision-api-oracle`, `decision-api-client`, `add-openhands-support`). This
plugin doesn't repeat them: it explains, checks prerequisites and hands off to them by name, in
this order:

| # | Step | Package skill |
| --- | --- | --- |
| 1 | Install bun and Node.js if missing (with a yes), `init` the project | (this plugin) |
| 2 | Sign in to IXO (`decision-oracle login --network testnet`) | (this plugin) |
| 3 | Design the claim form and the rules | `create-rubric` |
| 4 | Publish the protocol | `publish-protocol` |
| 5 | Write the checks, if any | `write-facts` |
| 6 | Deploy the oracle (free `workers.dev` address; own domain optional), its identity, engine registration | `create-oracle` |
| 7 | Deed, collection, a test claim | `create-collection` |

Optional: the Decision API (`decision-api-oracle`) and Openhands hiring (`add-openhands-support`).

## Safety

It builds on testnet (play money); devnet only if asked, mainnet only when the person asks for it. Every chain write is run first without `--yes`, explained in plain words and
signed only after the person says yes. The agent never prints keys, mnemonics or the login session
files. The plugin carries no key and no server.
