// Plain-words check for the asks skills (same banned list as openhands-network app/lib/plainWords.ts).
// Backticked text (tool names, params) and code fences are skipped; everything else is read by or said to people.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const RULES: [string, RegExp][] = [
  ["verifier", /\b(?<!-)(?:reviewers?|checkers?|oracles?)\b(?!-)/i],
  ["network", /\b(?:testnet|mainnet|devnet|test network|main network)\b/i],
  ["chain", /\b(?:blockchain|on[- ]chain|off[- ]chain|the chain|a chain|crypto\w*|relayer)\b/i],
  ["coin", /\b(?:wallets?|tokens?|coins?|PAY|USDC|uixo|upay|denom|gas|fee ?grants?|mnemonic|seed phrase|escrow)\b|(?:\b\d[\d.,]*|<[^>]+>)\s?IXO\b|\bin IXO\b|\bIXO coins?\b/],
  ["jargon", /\bDID\b|\bdid:ixo\b|(?<![Nn]ever )(?<!not )\b[Cc]laims?\b(?! work)|\b(?:[Ee]ntity|[Cc]ollections?|[Rr]ubrics?|[Cc]redentials?|[Ii]ssuers?|Matrix|[Hh]omeservers?|tx|[Tt]ransactions?)\b/],
];
const NAMES = /\bAsky (?:Pro )?Checker\b/g;
const bad: string[] = [];
const walk = (d: string) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".md")) scan(p);
  }
};
function scan(p: string) {
  let fenced = false;
  readFileSync(p, "utf8").split("\n").forEach((line, i) => {
    if (/^\s*```/.test(line)) return void (fenced = !fenced);
    if (fenced || /^description:|^name:|plain-ok/.test(line)) return;
    const t = line.replace(/`[^`]*`/g, "").replace(/https?:\/\/\S+/g, "").replace(NAMES, "");
    for (const [id, re] of RULES) if (re.test(t)) bad.push(`${p}:${i + 1} [${id}] ${line.trim().slice(0, 110)}`);
  });
}
walk("template/asks");
if (bad.length) { console.error(bad.join("\n")); console.error(`${bad.length} plain-words findings`); process.exit(1); }
console.log("✓ asks skills: plain words");
