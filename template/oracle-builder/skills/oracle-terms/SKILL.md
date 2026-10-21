---
name: oracle-terms
description: Plain-English glossary for building an IXO evaluation oracle — what an oracle, protocol, rubric, claim, collection, decision engine, fact, handler, receipt, PAY, evaluation fee, did:web, delegation, payouts and the Decision API are, what devnet, testnet and mainnet mean, and what costs money. Use whenever a non-technical person asks what an IXO oracle word means, when the oracle-builder skill uses a term for the first time, or when someone asks "is this real money?" or "what will this cost me?".
---

# IXO oracle terms, in plain words

Use these words with the person. Explain a term the first time it comes up, in one sentence, with
the example in brackets if it helps. Don't recite the whole list. If they ask, explain more.

## The big picture in three sentences

People send **claims** ("I delivered this parcel"). Your **oracle** gathers the **facts** about
each claim (it calls a courier's API, or an AI looks at the photo) and hands them to IXO's
**decision engine**, which applies the published **rules** and signs the verdict. Your oracle then
records that signed verdict on the IXO chain, so anyone can check it later.

## Glossary

| Term | In plain words |
| --- | --- |
| **Oracle** | Your service that checks claims and records a signed verdict for each one. It runs on Cloudflare at your own web address. It gathers facts; it never decides by itself. |
| **Claim** | One person's submission: a form they filled in, maybe with photos or files. (A courier says "parcel 123 delivered", with a photo.) |
| **Protocol** | The published recipe for a kind of claim: the **claim form** (what people fill in) plus the **rubric** (the rules). Anyone can read it on chain. |
| **Claim form** | The questions a claim must answer and the files it may carry. |
| **Rubric** | The rules a claim is judged by. (Approve if the photo shows a parcel and the address matches; reject if it was already claimed; send to a person if unsure.) |
| **Collection** | A bucket of claims for one protocol, owned by a company. The company hires your oracle to check the claims in it. |
| **Deed** | The company's project on chain that a collection hangs off. It names which protocol its claims use. |
| **Decision engine** | IXO's independent judge. It takes your facts, applies the rubric and returns approve, reject or "needs a human review". Your oracle never makes that call. |
| **Facts** | The answers your oracle gathers for a claim, the ones the rubric asks for (is the tracking number real? does the photo show a parcel?). |
| **Handler** (or check) | A small piece of code that produces one fact. Many facts have a ready-made (stock) handler; you only write the ones nothing else can answer. Your agent writes them with you. |
| **Receipt** | The engine's signed proof of a decision. It is what goes on chain, so anyone can verify the verdict wasn't changed. |
| **Review** | When the rubric says "unsure", a person looks at the claim and answers a few questions; their answers complete the same decision. |
| **PAY** (`upay` on chain) | IXO's payment token for engine credits. 1 PAY is about 1 US dollar; 1 PAY is 1,000,000 upay. Only oracles IXO runs may charge their fee in PAY; yours charges in IXO or USDC. |
| **Subscription / credits** | Your IXO account's plan with the engine. The engine bills it per decision, so you need one before the engine will work for your oracle. |
| **Evaluation fee** | What a collection pays your oracle for checking each claim. It is your income, not a payout to the claimant. You set it in IXO (`uixo`) or, on mainnet, in USDC: the USDC IXO's on-ramp uses (USDC on Injective, shown as "USDC · Injective"). Devnet and testnet have no USDC, so use IXO there. |
| **Gas** | The small fee, in IXO, every chain transaction costs. A little IXO in your login's wallet covers it. |
| **did:web** | Your oracle's identity on the web, built from its address (`did:web:myoracle.example.com`). The engine knows your oracle by it. |
| **DID** | An identity on IXO (a person, a company, an oracle). Like an account name that can sign. |
| **Delegation** | A signed permission one identity gives another, limited to one job and a time. (The company lets your oracle read its claims.) |
| **AuthHub login** | IXO's sign-in. A browser page opens, you sign in, and the tool keeps a session file on your computer. Nobody ever needs to see that file. |
| **Payouts** | Paying people after their claim is approved. It goes through the company's own payouts service, not through your oracle's fee. |
| **Openhands checker** | An oracle people can pick in the Openhands app when they post a task. It sets itself up on each task that picks it and checks the answers. `init --openhands` makes one. |
| **Decision API** | Another way to send claims: over the web (HTTPS) straight to your oracle, instead of on chain. Useful for a business that wants to plug in its own app. |
| **Cloudflare Workers** | Where your oracle runs. Cloudflare hosts it at your domain; you pay Cloudflare for hosting, often nothing at small sizes. |

## Devnet, testnet, mainnet

| Network | What it is | Money |
| --- | --- | --- |
| **devnet** | IXO's practice network. Start here, break things, try again. | Play money. |
| **testnet** | The dress rehearsal, set up like the real thing. | Play money. |
| **mainnet** | The real network. Verdicts here count. | Real money. |

Everything starts on devnet. Moving to testnet or mainnet is a separate decision the person makes
out loud, after devnet works end to end.

## What costs money

- **Gas** for every chain write (publishing, creating a collection, recording a verdict): a little
  IXO each. Play IXO on devnet and testnet.
- **Engine credits** (PAY) for each decision, billed to the oracle owner's subscription.
- **Cloudflare** hosting and, if the rubric uses AI checks, the AI calls (from your Cloudflare
  credits, or an AI provider you choose).
- **Your domain**, if you don't have one yet.

What your oracle earns: the **evaluation fee** each collection pays per claim checked.

Always say the amount, the coin and the network before anything is signed, and get a yes.
