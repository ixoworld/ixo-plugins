---
name: oracle-builder
description: Guide a non-technical person through authoring governance and building or updating an IXO evaluation oracle with @ixo/decision-oracle — interview them about what they want checked, explain each term on first use, check the prerequisites (bun, Node.js, a terminal, a free Cloudflare account, an IXO login, gas, a subscription), build on testnet unless asked otherwise, run `bunx @ixo/decision-oracle init`, then hand off in order to the package's own skills (create-rubric, publish-protocol, write-facts, create-oracle, create-collection, and optionally decision-api-oracle and add-openhands-support), confirming before every chain write. Use when someone says "I want to build an oracle", "make my own evaluation oracle", "how do I start with IXO oracles", or picks up a half-finished oracle setup.
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
- **You run every command; the person never types or reads one.** Don't show them commands, command
  output, version numbers, file or folder names, or setting names. Say what happened in one plain
  sentence ("Your rules are checked and ready") and the one thing they must do next, if any.
- Keep the technical words to the few the person needs (oracle, rubric, protocol, claim), each
  explained once in plain words the first time; never use others (DID, denom, escrow, handler).

## Safety rules (never bend these)

- **Build on testnet** (play money). At the start, say plainly: "We're building on testnet: play
  money, nothing real is spent. Mainnet (real money) only when you ask for it." Devnet only if they
  ask for it by name; mainnet only when they ask, after testnet works end to end. Say "real money"
  out loud before any mainnet step.
- **Dry-run, explain, ask, then sign.** Every chain write in the `decision-oracle` tool signs
  nothing without `--yes`. Run it without `--yes` first, tell the person in plain words what it
  will do (what gets created, which network, what it costs), get a clear yes, then run the same
  line with `--yes`. One yes covers one command.
- **Never print, read out or paste secrets**: mnemonics, recovery phrases, private keys, API
  tokens, `.dev.vars` values, or the saved IXO login session files. Don't open or `cat`
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

## Professional service: author first, then resume deployment

Use this route for professionally operated services, whether starting a new domain or updating an
existing oracle. Offer `decision-oracle`, QiForge, or both as runtime targets; a QiForge-only service
uses its existing deployment tools instead of installing the decision-oracle package.

1. Discover `domain-author-pro-oracle` and its canonical `domain-author` dependency in the client's
   installed skills. Load both. The specialist lives in the `ixoworld/ixo-agent-skills` repository
   at `skills/domain-author-pro-oracle/SKILL.md`; install it together with its sibling base skill
   using the client's supported skill installation flow. This plugin does not bundle those skills
   or an authenticated Domain Runtime. If unavailable, retain the interview and explain that
   constitutional authoring cannot yet be validated; do not fabricate a substitute specification.
2. Reuse an existing interview, session, package revision, oracle identity, hosting account and
   deployment receipts. For an existing domain, read the current constitution and predecessor;
   never run `init` over an existing project or replace unrelated configuration. Keep the governed
   oracle entity, hosted service identity (`did:web`) and runtime signing account distinct.
3. Let the specialist guide the mandate, methods, evidence policy, conflicts, human review,
   appeals, privacy, incidents and amendment procedures. Keep professional source material
   private by default. New constitutional findings remain advisory, including incomplete
   implementation of a rule. Existing access, claim review and signing controls still apply.
4. In cloud ChatGPT or Claude, continue authoring and reviewing. Discover the connected Domain
   Runtime's content upload and status capabilities. Save through those tools when authorized,
   retaining durable session/revision references, validation results and readback receipts.
   When the runtime returns an authorization proposal, use its configured Portal review link. The
   operator reviews the exact permission and signs through the existing PIN flow, then returns here
   to retry with the same sign-in. OAuth alone grants no authoring rights. Keep private references
   and credentials out of the handoff. Never use a customer claim-attachment upload tool for
   governing documents. If hosted upload is unavailable, produce a downloadable draft and mark
   upload as pending.
5. Prepare a resumable handoff for Codex or Claude Code containing references, interview answers,
   selected runtimes, existing identities, completed steps and remaining work. Include no login
   tokens, hosting credentials or recovery material. A cloud client does not need a terminal
   until deployment. An exported draft is not an adoption or publication receipt.
6. In the coding agent, resume the relevant existing deployment tools against the operator's
   hosting account. Resolve final identities and document references before final adoption.
   Apply the current domain governance procedure, or independently verified founding authority.
   Require independent review only where that procedure requires it; the proposed constitution
   cannot authorize itself. Any later byte change creates another revision.
7. Publish and verify the exact adopted package through Domain Runtime. Track adoption, actual
   runtime loading, discovery, commercial registration, grants and test-claim receipts separately.
   Reconcile an uncertain publication before any retry. Continue existing deployment steps below
   where needed; no constitutional finding changes the engine verdict or adds a runtime gate.
8. Review observations with the operator and propose amendments through the applicable procedure.
   Never amend automatically, promote checks into blocking controls, or invoke new assessment
   calls on replay. Successful observation does not establish constitutional compliance.

Report each launch condition as verified, pending, failed or not run, with its evidence reference.
Status evidence recorded through Domain Runtime remains operator-reported unless separately verified.
A skill installation or local test does not establish a deployed hosted service. Mainnet promotion
remains a separate operator-authorized step.

## Step 0: what do you want checked?

**Say** first: "We're building on testnet: play money, nothing real is spent. Mainnet (real money)
only when you ask for it."

Ask, one at a time, and write the answers down (you'll need them in step 3):

1. What does a person claim? (a delivery, a planted tree, a finished survey)
2. What would they send as proof? (a form, a photo, a file, a tracking number)
3. When should it be approved, rejected, or looked at by a person?
4. Is there an outside service that can confirm it? (a courier API, a registry) Or should an AI
   look at a photo or document?
5. Who will send the claims, and which company owns them?
6. Should people be able to pick your oracle in the **Openhands** app (someone posts a task, a
   person or an agent does it, your oracle checks the answer)? Yes or no.
7. What's your oracle's logo? An image file on their computer (.png, .jpg, .webp or .svg, up to
   5 MB) or a link to one. It shows on the portal, the console and the Openhands app; step 6 uses
   it. No logo yet? Offer to make a simple one with them before step 6.

Then say back the plan in three or four plain sentences, and the path below, before you start.

## Step 1: check what they need, then install

**Say:** "First I'll check your computer has what we need."

Check and fix, one by one:

- **A terminal you can run.** If you can't run commands here (a chat-only app), **Say:** "This needs
  Claude Code (the Code tab in the Claude app, or the terminal) or Codex. Open one of those and ask
  me there with the saved authoring handoff." Complete the cloud authoring route above first,
  then pause only the deployment steps.
- **bun** (`bun --version`, needs 1.3 or newer). If missing or older, **Say:** "We need a free
  program called bun. Shall I install it?" On a yes, run the official installer:
  `curl -fsSL https://bun.sh/install | bash` (Windows: `powershell -c "irm bun.sh/install.ps1 | iex"`),
  then check `bun --version` again.
- **Node.js** (`node --version`, needs 22 or newer; Cloudflare's `wrangler` tool runs on it). If
  missing or older, **Say:** "We also need a free program called Node.js. Shall I install it?" On
  with a yes: macOS with Homebrew `brew install node@22` (then `brew link --overwrite node@22` if
`node` still isn't found); otherwise nvm,
`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash`, then `nvm install 22`;
Windows `winget install OpenJS.NodeJS.LTS`. Then check `node --version` again.
- **A free Cloudflare account.** Ask. The oracle runs on Cloudflare Workers, at a free address
  Cloudflare gives it: `<worker>.<account>.workers.dev`. No web address (domain) of their own is
  needed; one is optional, only if they want it. If they have no account, open
  https://dash.cloudflare.com/sign-up and walk them through it.
- **An IXO login, a little IXO for gas, and an IXO subscription.** Explained and handled in step 2
  and step 6; just mention them now.

For a new decision-oracle project, ask for a folder name (suggest `my-oracle`). If resuming an existing
project, inspect its saved receipts and configuration and skip initialization.

```bash
bunx @ixo/decision-oracle init my-oracle              # add --openhands if they said yes to question 6
cd my-oracle && bun install
```

With `--openhands`, the oracle also answers the Openhands app by itself: when someone posts a task
and picks this oracle, it gives itself permission on that task and starts checking the answers.
Nothing more to build for that.

`init` also copies the package's detailed skills into `my-oracle/.claude/skills/`: `create-oracle`,
`create-rubric`, `publish-protocol`, `create-collection`, `write-facts`, `decision-api-oracle`,
`decision-api-client`, `add-openhands-support`. From now on work inside `my-oracle`. If those
skills aren't listed yet, read them from that folder directly. Inside the project, the tool is
`bunx decision-oracle …`. After upgrading the package, `bunx decision-oracle skills sync`
refreshes those skills.

## Step 2: sign in to IXO

**Say:** "Now you sign in to IXO. A browser page will open; sign in there and come back."

```bash
bunx decision-oracle login --network testnet
```

The session is saved on their computer. Never open or show it. Explain **gas** (a few cents of
IXO per chain write; play IXO on testnet, free from https://faucet.testnet.ixo.earth: enter
their testnet address) and check their wallet can pay it as the package skills describe.
Use `--network testnet` in every command from here on (or the network they chose).

## Steps 3 to 7: hand off in order

For each step: say what it does in one or two sentences, then follow the named package skill.
Carry the person's answers from step 0 into it. Keep this skill's safety rules and way of talking
on top of whatever the package skill says.

| # | What it does, in plain words | Package skill |
| --- | --- | --- |
| 3 | Design the **claim form** and the **rubric** (the rules) from their answers, and check the rules with the engine. | `create-rubric` |
| 4 | Publish them on chain as a **protocol**, so claims and oracles can point at it. Chain write. | `publish-protocol` |
| 5 | Write the **checks** (handlers) the rules need that no ready-made check answers. Skip if every fact is stock. Test them on a sample claim. | `write-facts` |
| 6 | Put the **oracle** online on Cloudflare at its free `workers.dev` address (or their own domain, if they chose one): on `workers.dev`, `ORACLE_HOSTNAME` is that `<worker>.<account>.workers.dev` host and no custom-domain route is set, even where the package skill says Custom Domain. Then give it its IXO identity, and register it with the **decision engine**. Chain writes and a deploy. The engine needs the owner's IXO **subscription**: if it answers "payment required" (402), open the page it names so they can add credits, then try again. Ask first whether they will also **review** claims themselves: the login that registers an oracle can never review that oracle's claims, so if yes, register it with a separate company login. | `create-oracle` |
| 7 | Create the company's **deed** and **collection**, hire the oracle on it, and send a **test claim**. Then show them the verdict and its **receipt**. Chain writes. | `create-collection` |

After step 7, celebrate briefly, then say what they now have in two sentences.

## Optional, only if they ask

- **Claims over the web instead of on chain** (a business wants to plug its own app in):
  `decision-api-oracle`, and `decision-api-client` to test it from the customer side.
- **Get hired from the Openhands app** (asks, campaigns): if they said yes to question 6, `init
  --openhands` already did the code; `add-openhands-support` covers who pays for the checks and how
  the oracle shows up in the app's list. Otherwise it also shows how to add it to an existing
  oracle.
- **Move to mainnet** (or devnet): repeat steps 2 to 7 with `--network mainnet` (or
  `--network devnet`), as a separate, explicit decision, with "real money" said out loud for
  mainnet.

## If they stop part way

Run this skill again. Step 0 is skipped if you have their answers; every other step checks first
and says "Already done" when it is.
