---
name: oracle-builder
description: Guide a non-technical person through building their own IXO evaluation oracle from nothing with @ixo/decision-oracle — interview them about what they want checked, explain each term on first use, check the prerequisites (bun, a terminal, Cloudflare with their domain, an IXO login, gas, a subscription), run `bunx @ixo/decision-oracle init`, then hand off in order to the package's own skills (create-rubric, publish-protocol, write-facts, create-oracle, create-collection, and optionally decision-api-oracle and add-openhands-support), confirming before every chain write. Use when someone says "I want to build an oracle", "make my own evaluation oracle", "how do I start with IXO oracles", or picks up a half-finished oracle setup.
---

# Build an IXO oracle with a non-technical person

The person in front of you knows their business, not code or blockchains. You run every command.
They answer questions, sign in when a browser opens, and say yes or no. This skill is the front
door: it explains, checks and orders the work. The detailed steps live in the skills the package
installs into their project; you hand off to those by name and follow them.

## How you talk

- **Before each step, say in one or two sentences what it does and why**, then do it.
- **One question at a time.** Short sentences. Wait for the answer.
- **Explain a word the first time you use it**, in one sentence (the `oracle-terms` skill has the
  plain-word meaning of each). After that, just use it.
- **Offer the easy choice first** and say why in one line.
- **Before a click**, open the page for them and say exactly what to click, with the button's
  words in **bold**.
- No long IDs or addresses unless they ask, or they must send money to one.

## Safety rules (never bend these)

- **Start on devnet** (practice, play money). Testnet and mainnet only when the person asks for
  them by name, after devnet works end to end. Say "real money" out loud before any mainnet step.
- **Dry-run, explain, ask, then sign.** Every chain write in the `decision-oracle` tool signs
  nothing without `--yes`. Run it without `--yes` first, tell the person in plain words what it
  will do (what gets created, which network, what it costs), get a clear yes, then run the same
  line with `--yes`. One yes covers one command.
- **Never print, read out or paste secrets**: mnemonics, recovery phrases, private keys, API
  tokens, `.dev.vars` values, or the login session files under `~/.ixo/`. Don't open or `cat`
  those files. Secrets go from the tool straight into files or into Cloudflare
  (`wrangler secret put` from a file or stdin), never into the chat. If a secret ever shows up in
  the chat, stop and tell the person to replace it.
- **Never ask the person for a password, PIN or recovery phrase.** Sign-in happens in their
  browser.
- **Check before you act.** Each step starts by checking whether it is already done. If it is,
  say "Already done" and move on. That is how a re-run picks up where it stopped.
- **No improvising.** Use only the commands this skill and the package skills name. If one fails
  and the package skill has no answer, stop and tell the person in one plain sentence what is
  missing.

## Step 0: what do you want checked?

Ask, one at a time, and write the answers down (you'll need them in step 3):

1. What does a person claim? (a delivery, a planted tree, a finished survey)
2. What would they send as proof? (a form, a photo, a file, a tracking number)
3. When should it be approved, rejected, or looked at by a person?
4. Is there an outside service that can confirm it? (a courier API, a registry) Or should an AI
   look at a photo or document?
5. Who will send the claims, and which company owns them?

Then say back the plan in three or four plain sentences, and the path below, before you start.

## Step 1: check what they need, then install

**Say:** "First I'll check your computer has what we need."

Check and fix, one by one:

- **A terminal you can run.** If you can't run commands here (a chat-only app), say they need
  Claude Code, Cowork or Codex for this, and stop.
- **bun** (`bun --version`, needs 1.3 or newer). If missing, offer to install it from
  https://bun.sh and do so after a yes.
- **A Cloudflare account that owns their domain.** Ask. The oracle runs on Cloudflare Workers at
  an address on their domain (for example `oracle.theircompany.com`). If they don't have one, open
  https://dash.cloudflare.com/sign-up and walk them through it; adding the domain is their call.
- **An IXO login, a little IXO for gas, and an IXO subscription.** Explained and handled in step 2
  and step 6; just mention them now.

Then create the project. Ask for a folder name (suggest `my-oracle`).

```bash
bunx @ixo/decision-oracle init my-oracle
cd my-oracle && bun install
```

`init` also copies the package's detailed skills into `my-oracle/.claude/skills/`: `create-oracle`,
`create-rubric`, `publish-protocol`, `create-collection`, `write-facts`, `decision-api-oracle`,
`decision-api-client`, `add-openhands-support`. From now on work inside `my-oracle`. If those
skills aren't listed yet, read them from that folder directly. Inside the project, the tool is
`bunx decision-oracle …`. After upgrading the package, `bunx decision-oracle skills sync`
refreshes those skills.

## Step 2: sign in to IXO

**Say:** "Now you sign in to IXO. A browser page will open; sign in there and come back."

```bash
bunx decision-oracle login --network devnet
```

The session is saved on their computer. Never open or show it. Explain **gas** (a few cents of
IXO per chain write; play IXO on devnet) and check their wallet can pay it as the package skills
describe.

## Steps 3 to 7: hand off in order

For each step: say what it does in one or two sentences, then follow the named package skill.
Carry the person's answers from step 0 into it. Keep this skill's safety rules and way of talking
on top of whatever the package skill says.

| # | What it does, in plain words | Package skill |
| --- | --- | --- |
| 3 | Design the **claim form** and the **rubric** (the rules) from their answers, and check the rules with the engine. | `create-rubric` |
| 4 | Publish them on chain as a **protocol**, so claims and oracles can point at it. Chain write. | `publish-protocol` |
| 5 | Write the **checks** (handlers) the rules need that no ready-made check answers. Skip if every fact is stock. Test them on a sample claim. | `write-facts` |
| 6 | Put the **oracle** online on Cloudflare at their address, give it its IXO identity, and register it with the **decision engine**. Chain writes and a deploy. The engine needs the owner's IXO **subscription**: if it answers "payment required" (402), open the page it names so they can add credits, then try again. | `create-oracle` |
| 7 | Create the company's **deed** and **collection**, hire the oracle on it, and send a **test claim**. Then show them the verdict and its **receipt**. Chain writes. | `create-collection` |

After step 7, celebrate briefly, then say what they now have in two sentences.

## Optional, only if they ask

- **Claims over the web instead of on chain** (a business wants to plug its own app in):
  `decision-api-oracle`, and `decision-api-client` to test it from the customer side.
- **Get hired from the Openhands app** (asks, campaigns): `add-openhands-support`.
- **Move to testnet or mainnet**: repeat steps 2 to 7 with `--network testnet` or
  `--network mainnet`, as a separate, explicit decision, with "real money" said out loud for
  mainnet.

## If they stop part way

Run this skill again. Step 0 is skipped if you have their answers; every other step checks first
and says "Already done" when it is.
