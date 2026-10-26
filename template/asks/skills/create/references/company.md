# Set up a company, or post as one

You set the company up yourself, running each step as a terminal command. The person only answers
questions, signs in, clicks and sends money. Claude Code or Cowork only (it runs on their computer).

## Rules for this part

- Plain words: organisation → **your company**; its admin address → **your company's account**;
  oracle → **the reviewer**; facilitator → **your payouts service**; review billing → **your review
  budget**; PAY / Console credits → **review credits**, in dollars (1 PAY = $1); rails → **how you pay
  people**.
- Before each click, open the page yourself (`open <url>` on macOS, `xdg-open <url>` on Linux) and say
  exactly what to click, the button's words in **bold**.
- **Secrets never go into the chat.** A key the person copies goes from the clipboard straight into the
  command (`pbpaste | npx -y wrangler secret put <NAME> --name <worker>`; Linux `wl-paste` or
  `xclip -o`), then clear it (`pbcopy < /dev/null`). If a key appears in the chat, stop and tell them to
  delete it and make a new one.
- **Never sign as another person.** **Preview before `--yes`**: every command that changes something
  runs first without `--yes`; say what it will do, get a yes, then run it with `--yes`.
- **Check, act, check.** Each step starts with its check; if it passes, say "Already done" and move on.
  Never go on while a check fails. That is what lets a re-run carry on where it stopped.
- **No workarounds.** Run only the commands written here. If one is missing or fails, say what is
  missing in one plain sentence and stop. Never ask the person to type a command.
- Files: read only `~/.ixo/openhands-hq-<network>.json`. Never list, search or read anything else under
  `~/.ixo` or `~/.openhands`.
- Describe a reviewer only with what its card says. Examples use only the person's own brand and places.

## Commands

| Name here | What runs |
| --- | --- |
| `decision-oracle` | `npx -y @ixo/decision-oracle@0.2`. Always pass `--network <network>` (its own default is devnet). |
| `installer` | `npx -y @ixo/payouts-facilitator@0.1`. Ways B and C only. Prints its JSON result on the last line. |
| `wrangler` | `npx -y wrangler`. Ways B and C only. |
| `stripe` | the Stripe CLI (`brew install stripe/stripe-cli/stripe`; ask first). Way C only. |
| `<site>` | the asks.world website the tools' links point to |
| `<console>` | Decision Console: testnet `https://decision-console.testnet.ixo.earth`, mainnet `https://decision-console.ixo.earth` |

`<network>` is the network chosen for this task (`mainnet` or `testnet`): pass it as `network` to every
tool and as `--network` to every command. The computer needs Node.js 22.6 or newer.

**Notes:** keep answers and printed ids (never secrets) in `~/.ixo/openhands-hq-<network>.json`. Read it
at the start. The checks, not the notes, decide what is done.

## The steps

Always: 1, 2, 3, 4, 5b, 6, 10, 11, 12, 13. Step 5 when the reviewer bills per review (IXO's do). Steps
7 and 9 for ways B and C; step 8 for way C.

### 1. Questions (one at a time; write the answers in the notes)

1. "What's your company's name? Pick the final one: it can't be changed later." Read it back. A logo
   link (optional).
2. "In a sentence or two, what work do you want people to do?"
3. "How do you want to pay people? With nothing to run yourselves, pick **On chain** in IXO. To pay in
   dollars, pick **USDC on Base** or **Card**: that needs a small payouts service we set up together in
   your Cloudflare account (about 15 minutes)." One of: **A. On chain** (default, IXO from the
   company's account), **B. USDC on Base**, **C. Card (Stripe)**.
4. "Who should check the answers? IXO's ready-made reviewer, or one built for your own rules?"
5. "Which email should we use to reach the company? It must be an inbox you read." Read it back.
6. Way C only: the country of their Stripe account (two letters).

### 2. Sign in to IXO

**Check:** `~/.ixo/publish-session-<network>.json` exists and its address matches the notes (or the
person confirms it's theirs). **Never open, read or print this file.** Read only its address, exactly:
`node -e 'try{console.log(JSON.parse(require("fs").readFileSync(require("os").homedir()+"/.ixo/publish-session-<network>.json","utf8")).address)}catch{console.log("no sign-in")}'`
If it isn't clearly theirs, don't use it or delete it. **Say:** "This computer is signed in as someone
else. Ask them first, or use a different computer user." Log out only after an explicit "yes, remove it".
**Do:** `decision-oracle login --network <network>`; note `"signedInByThisRun": true`. If no page
opens, give the sign-in link on its own line. **Say:** "Open this link to sign in with your email, then
type your PIN. When the page says you can close it, tell me." Note the printed address and did.

### 3. Create the company

`decision-oracle org create --network <network> --name "<name>" [--logo <url>]` (preview), then with
`--yes`. Note `entityDid` (starts with `did:ixo:entity:`). **Say:** "Your company is on asks.world."

### 4. Reviewer

1. List the reviewers with one read: `curl -s <site>/api/oracles` → `{oracles:[{value, name, what,
   priceBase, perReview}]}` (`value` is the reviewer's DID). A reviewer's address (`<kit>`): read
   `<kit>/v1/info`. Never from memory, no scripts. For each that could fit, one line: what it checks
   for *their* work, what it can't, the price. Recommend IXO's Ask the World checker by default; the
   network's cleanup checker only for cleanups or work campaigns; their own reviewer when they have
   their own business rules (never a generic one as a stand-in).
2. **Their own reviewer:** **Say:** "IXO builds that for you. I'll send them your rules." Write a short
   spec (checks, pass/review/reject lines, limits, price) and pause until IXO says it's ready.
3. **Link it:** check `decision-oracle api sources --entity <org DID> --kit <kit> --network <network> --json`
   (`active` → done; `pending-link` → link with its id). Else
   `decision-oracle api source create --name "<company name>" --contact <email> --entity <org DID> --kit <kit> --network <network> --yes --json`
   (it prints a one-time secret: never show or note it; **Say:** "A one-time code was shown on screen.
   You won't need it."), then `decision-oracle api source link <source id> --kit <kit> --network <network> --yes`.
4. Note the reviewer's DID.

### 5. Review budget

**Check:** `review_billing_status` with the company's DID says a budget is needed. Only the company's
owner can approve it. **Say:** "Each review costs $<price> from your review credits. You approve a
review budget once. Let's start with $50 (about <50 ÷ price> reviews); you can raise it any time.
Shall I set it up here, or would you rather click it on the website?" (Skip the question if they
already said where and how much.)
- Here: `decision-oracle api review-billing enable --source <source id> --kit <kit> --network <network> --cap 50`
  (preview), then `--yes`. Check `... review-billing status ...` says `active`.
- Website: `<site>/org/<org DID>/settings#pay-for-reviews`. **Say:** "Change the budget to 50, then
  click **Allow reviews to be paid from my credits**."
- Decision Console: `<console>/billing/reviews`.
**Say:** "Done. Your budget is $<N>. You'll get an email at 80% and 95% used. A new budget starts from
zero." Raise = `enable` again with `--cap`; off = `review-billing disable` (preview, then `--yes`).
Credits: `<console>/billing/credits?topup=1&from=openhands`.

### 5b. Answers a person checks

**Say:** "Now and then an answer needs a person to look at it. It waits in the Decision Console, and if
nobody answers within 48 hours it's turned down. Let's make sure you hear about it."
**Do:** open `<console>/claims/review`. **Say:** "Sign in. In **Reviewer key and emails**, click
**Create and register a reviewer key** if it's there, and turn on **Email me when a claim needs my
review**. Then tell me."

### 6. Money in the company's account

`decision-oracle org balance --entity <org DID> --network <network>`. Way A needs reward × answers in
IXO (never PAY) plus ~0.1 IXO for fees; B and C pay rewards outside. If `post_ask` says the reviewer
takes its fee with the task, add price × answers in PAY.
**Do:** `decision-oracle org fund --entity <org DID> --amount <amount> --network <network>` (dry run).
**Say:** "Your company's account needs <amount> <coin> before the first task. Shall I move it from your
own account? The network fee is about 0.02 IXO." On yes, the same with `--yes --json`. If their own
account is short, give the company's address (they must send money to it) and point to the `account`
skill. Check the balance again until it covers it.

### 7. Payouts service (ways B and C)

**Say:** "Now we set up your payouts service in your Cloudflare account. It's free to start and takes
about 15 minutes." `<worker>` = `<company>-payouts`; `<rails>` = `usdc_base` (B) or `stripe` (C).
1. `npx -y wrangler whoami`; if not logged in `npx -y wrangler login`. **Say:** "If Cloudflare asks you
   to sign in or make a free account, do that. Then click **Allow**." Several accounts → ask which and
   set `CLOUDFLARE_ACCOUNT_ID`.
2. Check: notes hold the URL and `installer trust-check --url <url> --org <org DID> --network <network>`
   exits 0 → skip to step 8 (C) or 9 (B).
3. Way C: step 8 parts 1–3 first, so the Stripe key is on the clipboard.
4. Deploy (preview, then `--yes`): B `installer deploy --network <network> --name <worker> --entity <org DID> --rails usdc_base --console-origins <console> --yes --json`;
   C `STRIPE_SECRET_KEY="$(pbpaste)" installer deploy --network <network> --name <worker> --entity <org DID> --rails stripe --company-country <country> --console-origins <console> --yes --json`,
   then `pbcopy < /dev/null`. Note `url`.
5. `installer anchor --network <network> --org <org DID> --facilitator-url <url> --session ~/.ixo/publish-session-<network>.json --yes`.
6. Deploy again (C: without `STRIPE_SECRET_KEY` and `--company-country`).
7. Check `installer trust-check ...` exits 0; else say its `problems` plainly and stop.

### 8. Stripe (way C)

1. `stripe config --list` shows an account, else `stripe login --non-interactive` and open its link
   (**Say:** "Click **Allow access**."). Mainnet: add `--live` to every `stripe` command.
2. `stripe get /v1/account` shows `"details_submitted": true`, else open
   `https://dashboard.stripe.com/connect`. **Say:** "Click **Get started** and fill in Stripe's form
   about your business. Only you can do this part."
3. The key (skip if `npx -y wrangler secret list --name <worker>` lists `STRIPE_SECRET_KEY`): open
   `https://dashboard.stripe.com/apikeys/create`. **Say:** "Check the switch at the top: **Test mode**
   for a trial, **live** for real money. Choose **Building your own integration**, name it `asks.world
   payouts`. Set Transfers **Write**, Balance **Read**, Connected accounts **Write**, Account links
   **Write**, Payouts **Read**, Balance transactions **Read**, everything else **None**. Click **Create
   key**, then click the key to copy it. Don't paste it anywhere. Tell me when it's copied."
4. After step 7: `stripe webhook_endpoints list` shows `<url>/webhooks/stripe-connect`, else
   `stripe webhook_endpoints create --url <url>/webhooks/stripe-connect --connect=true --enabled-events account.updated --enabled-events payout.failed --confirm | jq -r .secret | npx -y wrangler secret put STRIPE_CONNECT_WEBHOOK_SECRET --name <worker>`.
5. **Say:** "Your Stripe balance pays people. Top it up in your Stripe dashboard."

### 9. Payout wallet and limits (ways B and C)

Way B: `installer payout-wallet --name <worker> --network <network> --check --json` → **Say:** "Send
USDC for the rewards, plus a little ETH for fees, to this address on Base: <address>." (testnet: Base
Sepolia). Check until both are there, then `installer trust-check ... --name <worker>` exits 0.
Limits, `<admin>` = `--url <url> --session ~/.ixo/publish-session-<network>.json --network <network>`:
`installer admin oracles list <admin>`; add each chosen reviewer missing (`installer admin oracles add <reviewer DID> <admin>`).
**Say:** "What's the most one payout can be? And above what amount do you want to approve each payout
yourself?" → `installer admin defaults set --max <n> --currency <USDC|USD> --approval-over <n> --rails <rails> <admin>`.

### 10. Offer to sign out

Only if this run created the sign-in: **Say:** "The setup is done. Shall I remove the sign-in on this
computer, for safety? You can sign in again any time." On yes `decision-oracle logout --network <network>`.
Otherwise say nothing about it.

### 11. Connect

`my_status` shows their account connected, else the `connect` skill.

### 12. Company payout settings

`set_payout_settings` without `confirm`: `orgDid`; `facilitator` (B, C); `rails` `["chain"]`,
`["usdc_base"]` or `["stripe"]`; `oracles`: the reviewer(s), default first; `currency`: A none, B
`USDC`, C `USD`. **Say:** "You pay people <how>; answers are checked by <reviewer>. OK?" → `confirm:
true`. "Reconnect needed" → step 11. "Not confirmed" → note it and check the company's **Payouts** page
before trying again. **Say:** "You can change this any time on your company's **Payouts** page."

### 13. First task

As [post-an-ask.md](post-an-ask.md), plus: `org` = the org DID; `oracle` = `{ did, url: <kit> }` (no
`url` for their own reviewer); their own rules → `create_campaign` first and pass `campaign`. Way A: no
`currency`. Ways B and C: `pay: 0` and `payout: { rail, amount, currency, facilitator: <url> }`, never
a reward on chain too. **Say:** "This task pays <reward> to each of <n> people, from your company's
account. Reviews come from your review budget. Post it?" Then for B and C:
`installer asks register <collectionId> --url <url> --network <network>` (best effort).
**Say:** "You're set up. From now on, just tell me what you need."

## Later, for a set-up company

- **Post as the company:** step 13. Not set up yet → "Your company isn't set up yet. It takes about 10
  minutes; shall we do it now?" Asked on behalf of a group → ask once: "Post this as yourself, or set
  <group> up so the checks come from it?"
- **Short for a task:** step 6. **Reviews paused or off:** step 5.
- **Change how it pays, or its reviewer:** step 12, or the company's **Payouts** page.
- **Refusals:** "the oracle's signing wallet could not be confirmed" → wait and retry; "USDC isn't
  available on <network>" → use IXO; "It will retry on its own" → nothing to do.
- No notes on this computer: ask them to open their company's **Payouts** page and read you the
  reviewer's name.
