import { forecast, money, type Scenario } from "./profit-model.ts";

const args = process.argv.slice(2);
const allowed = new Set([
  "route",
  "budget",
  "orders",
  "price",
  "unit-cost",
  "evaluation-fee",
  "setup",
  "share-percent",
]);
const options = new Map<string, string>();
for (let i = 0; i < args.length; i += 2) {
  const key = args[i]?.replace(/^--/, "");
  const value = args[i + 1];
  if (!key || !allowed.has(key) || value === undefined || options.has(key))
    throw new Error("Use each supported --option once, followed by a value.");
  options.set(key, value);
}
function numeric(key: string, fallback?: number) {
  const raw = options.get(key);
  if (raw === undefined && fallback !== undefined) return fallback;
  if (
    raw === undefined ||
    raw.trim() === "" ||
    !Number.isFinite(Number(raw)) ||
    Number(raw) < 0
  )
    throw new Error(`--${key} requires a nonnegative number.`);
  return Number(raw);
}
function cents(key: string, fallback?: number) {
  const value = numeric(key, fallback);
  if (Math.abs(value * 100 - Math.round(value * 100)) > 1e-7)
    throw new Error(`--${key} supports at most two decimal places.`);
  return Math.round(value * 100);
}
const route = options.get("route");
if (route !== "service" && route !== "oracle")
  throw new Error("--route must be service or oracle.");
const input: Scenario = {
  route,
  budgetCents: cents("budget"),
  orders: numeric("orders"),
  priceCents: cents("price"),
  unitCostCents: cents("unit-cost"),
  setupCents: cents("setup", 0),
  evaluationFeeCents: cents("evaluation-fee", 0),
  shareBps: Math.round(numeric("share-percent", 0) * 100),
};
const result = forecast(input);
process.stdout.write(
  JSON.stringify(
    {
      mode: "forecast-only",
      input,
      ...result,
      projectedProfit: money(result.profit),
      projectedClosingBudget: money(result.closingBudget),
      notice:
        "No account access, signatures, spending or actual earnings. Use verified quotes and receipts.",
    },
    null,
    2,
  ) + "\n",
);
