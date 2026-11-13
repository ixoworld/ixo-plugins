---
name: bank-payouts
description: Install in Claude Code with "/plugin marketplace add ixoworld/ixo-plugins" then "/plugin install {{NAME}}@ixo-plugins". Set up bank payouts for the person's company on asks.world - the company's own payouts service, on its own Cloudflare account, paying workers from its own Stripe. Use when they say "set up bank payouts", "pay workers into their bank", "pay people with our Stripe", "set up our payouts service", or paste the setup prompt from their company's Payouts page. Needs an assistant that can run commands on their computer (Claude Code, Codex).
---

# Bank payouts for a company

The company pays workers into bank accounts from **its own payouts service**: it runs on the company's
own Cloudflare account and pays from the company's own Stripe. asks.world and IXO never hold its keys.
You do the setup in the terminal; the person only logs in, clicks and replies.

**Say this first, before anything else:** "This setup runs on your own computer, in Claude Code or
Codex, because it installs your payouts service into your own Cloudflare account. It takes about 15
minutes. You only sign in to Cloudflare and to asks.world, create one Stripe key, and save one file."

**Where to send the person, in this order:** their company's **Payouts** page,
`https://{{#TESTNET}}test.{{/TESTNET}}asks.world/org/<org>/settings` (the setup prompt with the company's
details, and the Ready check); then the full guide, `https://docs.ixo.world/payments/self-host-payouts`.
Only to learn more: `https://{{#TESTNET}}test.{{/TESTNET}}asks.world/payments`.

## Do this

1. No terminal here (claude.ai, ChatGPT or another chat app) → **Say:** "This runs on your own
   computer, so it needs Claude Code. On your computer: install Node.js 24 (the LTS version) from
   https://nodejs.org, then in a terminal run `npm install -g @anthropic-ai/claude-code` and then
   `claude`. In Claude Code, type `/plugin marketplace add ixoworld/ixo-plugins`, then
   `/plugin install {{NAME}}@ixo-plugins`, and say 'set up bank payouts'. The full guide is at
   https://docs.ixo.world/payments/self-host-payouts." and stop.
2. They pasted the setup prompt from their company's Payouts page → it already holds their details.
   Follow its steps, with the rules here.
3. Otherwise run the steps below in order. No company yet? Step 3 creates it, and they become its
   owner.
4. Finish with the check (step 9), the backup (step 10) and the Payouts page (step 11).

## Rules

- Run every command yourself, one at a time, exactly as written here. Never ask the person to type
  one. If one fails, say what is missing in one plain sentence and stop.
- **Secrets never go into the chat.** Never open, print or summarise a key, the sign-in file or the
  secrets file. If a key appears in the chat, tell them to delete it in Stripe and make a new one.
- **Preview first.** Where a command has a preview, run it, say in one sentence what it will do, and
  go on when they say yes.
- **Check, act, check.** Start each step with its check; already done → say so and move on. That is
  what lets a re-run carry on after a break.
- At each **Stop**, open the page for them (`open <url>` on macOS, `xdg-open <url>` on Linux), say
  exactly what to do and wait.
- Plain words: **your payouts service**, **your company**, **the verifier**. Money in dollars.
- Never sign in or sign anything as another person.

## The details

| Name here | What it is |
| --- | --- |
| `<company>` | the company's name, as they say it |
| `<org>` | the company's id (starts with `did:ixo:entity:`), printed by step 3 <!-- plain-ok --> |
| `<worker>` | `<company>` in lowercase letters, digits and dashes, then `-payouts` (`acme-ltd-payouts`) |
| `<verifier>` | the verifier the company uses, as its web id (starts with `did:web:`), from `list_checkers`; a new company with none yet: the Asks Oracle, Asks' own <!-- plain-ok --> |
| `<site>` | `https://{{#TESTNET}}test.{{/TESTNET}}asks.world` |
| `<url>` | the payouts service's address, printed by step 6 |

```sh
# The two tools, pinned. Write each command out in full: a shell shorthand does not run in zsh.
npx --yes @ixo/payouts-facilitator@0.2    # below: installer
npx --yes @ixo/decision-oracle@0.2        # below: sign-in
```

## The steps

### 1. The computer

```sh
node --version
```

It must say v24 or newer; else they install the LTS version from https://nodejs.org first.
**Say:** "The first run of each command downloads it, so it can sit for a minute or two with no
output. That's normal."

### 2. Sign in to asks.world (Stop)

Check who is signed in. Read only the address, exactly like this:

```sh
node -e 'try{console.log(JSON.parse(require("fs").readFileSync(require("os").homedir()+"/.ixo/publish-session-{{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}}.json","utf8")).address)}catch{console.log("no sign-in")}'
npx --yes @ixo/decision-oracle@0.2 login --network {{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}}    # only if no sign-in, or it is not theirs
```

**Say:** "A page opens. Sign in with the same email you use on asks.world and type your PIN." Note
whether this run signed in (step 11).

### 3. Your company

Ask: "What's your company's name? Pick the final one: it can't be changed later." The same command
creates the company, or prints the one this sign-in already owns by that name. Preview, then with
`--yes`:

```sh
npx --yes @ixo/decision-oracle@0.2 org create --network {{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}} --name "<company>"
npx --yes @ixo/decision-oracle@0.2 org create --network {{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}} --name "<company>" --yes
```

Its `entityDid` is `<org>`. **Say:** "<company> is on asks.world, and you are its owner."

### 4. Cloudflare (Stop)

```sh
npx --yes wrangler whoami
npx --yes wrangler login      # only if not logged in
```

**Say:** "A page opens. Sign in to Cloudflare (a free account is enough) and click **Allow**." More
than one account → ask which is the company's and put `CLOUDFLARE_ACCOUNT_ID=<its id>` in front of
every installer command.

### 5. Stripe (Stop)

1. Open `https://dashboard.stripe.com/{{#TESTNET}}test/{{/TESTNET}}connect`. **Say:** "Stripe must approve your company
   for Connect before it can pay people. If it hasn't, fill in Stripe's form. That can take days and
   is Stripe's decision; we carry on here when Stripe says yes." Not approved → stop.
2. Open `https://dashboard.stripe.com/{{#TESTNET}}test/{{/TESTNET}}apikeys/create`. **Say:** "Create a restricted key
   named `asks.world payouts`. Set Transfers **Write**, Balance **Read**, Connected accounts
   **Write**, Account links **Write**, Payouts **Read**, Balance transactions **Read**, Webhook <!-- plain-ok -->
   endpoints **Write**, everything else **None**. Click **Create key**, then copy it. Don't paste it
   anywhere. Tell me when it's copied." The key starts with `{{#TESTNET}}rk_test_{{/TESTNET}}{{^TESTNET}}rk_live_{{/TESTNET}}`.

### 6. Install the payouts service

Preview, then install, both with the key read straight from the clipboard (`pbpaste` on macOS;
`wl-paste` or `xclip -o` on Linux; `Get-Clipboard` in PowerShell): with the key, the preview can read
the Stripe account's country instead of saying it is missing. Then clear the clipboard:

```sh
STRIPE_SECRET_KEY="$(pbpaste)" npx --yes @ixo/payouts-facilitator@0.2 deploy --network {{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}} --name <worker> --entity <org> --rails stripe --payee-origins <site>
STRIPE_SECRET_KEY="$(pbpaste)" npx --yes @ixo/payouts-facilitator@0.2 deploy --network {{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}} --name <worker> --entity <org> --rails stripe --payee-origins <site> --stripe-webhook --yes --json
pbcopy < /dev/null
```

Keep the `url` from the last line: it is `<url>`. It takes about three minutes.

### 7. Link the service to the company

Preview, then with `--yes`, then install once more (the same flags, no key) so the service names its
link:

```sh
npx --yes @ixo/payouts-facilitator@0.2 anchor --network {{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}} --org <org> --facilitator-url <url> --session ~/.ixo/publish-session-{{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}}.json
npx --yes @ixo/payouts-facilitator@0.2 anchor --network {{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}} --org <org> --facilitator-url <url> --session ~/.ixo/publish-session-{{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}}.json --yes
npx --yes @ixo/payouts-facilitator@0.2 deploy --network {{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}} --name <worker> --entity <org> --rails stripe --payee-origins <site> --yes --json
```

### 8. The verifier and the payout limit (Stop)

**Say:** "What's the most one payout can be, in dollars? And above what amount do you want to approve
each payout yourself, or none?" Leave out `--approval-over` when they say none.

```sh
npx --yes @ixo/payouts-facilitator@0.2 admin oracles add <verifier> --url <url> --session ~/.ixo/publish-session-{{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}}.json --network {{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}}
npx --yes @ixo/payouts-facilitator@0.2 admin defaults set --max <most> --currency USD --approval-over <amount> --rails stripe --label "asks.world" --url <url> --session ~/.ixo/publish-session-{{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}}.json --network {{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}}
```

### 9. Check it

```sh
npx --yes @ixo/payouts-facilitator@0.2 trust-check --url <url> --org <org> --network {{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}}
```

It must end with `"ok":true`. If not, say each problem in plain words and stop.

### 10. Back up the secrets file (Stop)

**Say:** "The file `~/.config/ixo-payouts/<worker>.secrets.json` holds your payouts service's keys.
It exists only on this computer and at Cloudflare. Copy it into your password manager or another safe
place now. If it is lost, the service has to be set up again from scratch. Tell me when it's saved."
Never open it yourself.

### 11. Finish on asks.world (Stop)

1. Only if this run signed in at step 2: **Say:** "Shall I remove the sign-in on this computer, for
   safety?" On yes: `npx --yes @ixo/decision-oracle@0.2 logout --network {{#TESTNET}}testnet{{/TESTNET}}{{^TESTNET}}mainnet{{/TESTNET}}`.
2. **Do:** open `<site>/org/<org>/settings` for them. **Say:** "Choose **Bank payouts with your own
   Stripe**, paste <url> under **Your payouts service** and press **Check**. When it says **Ready**,
   it saves, and your asks can pay by bank."
3. **Say:** "Two things no setup can change: payouts are paid from your Stripe balance, so keep money
   in it; and Stripe pays workers in some countries only: your own country, or between the EEA, the
   US, the UK, Canada and Switzerland. For everyone else, pay in digital dollars."

## Later

- **"Is it working?"** → step 9, then their company's **Payouts** page.
- **Change the limit** → step 8's second command with the new amounts.
- **A new computer** → restore the secrets file from the backup first; never install without it.
