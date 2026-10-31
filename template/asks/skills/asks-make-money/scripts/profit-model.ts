export type Route = "service" | "oracle";

export type Scenario = {
  route: Route;
  budgetCents: number;
  orders: number;
  priceCents: number;
  unitCostCents: number;
  setupCents: number;
  evaluationFeeCents: number;
  shareBps: number;
};

export function forecast(input: Scenario) {
  const values = [
    input.budgetCents,
    input.orders,
    input.priceCents,
    input.unitCostCents,
    input.setupCents,
    input.evaluationFeeCents,
    input.shareBps,
  ];
  if (
    values.some((n) => !Number.isSafeInteger(n) || n < 0) ||
    input.orders > 100000 ||
    input.shareBps > 10000 ||
    values.some((n) => n > 100000000)
  )
    throw new Error(
      "Use nonnegative integer cents, a whole order count and a share from 0 to 10000 basis points.",
    );
  if (input.route === "service" && input.evaluationFeeCents > input.priceCents)
    throw new Error("The customer's price must cover its evaluation fee.");
  const receiptPerOrder =
    input.route === "service"
      ? input.priceCents - input.evaluationFeeCents
      : input.priceCents -
        Math.ceil((input.priceCents * input.shareBps) / 10000);
  const contribution = receiptPerOrder - input.unitCostCents;
  const receipts = receiptPerOrder * input.orders;
  const totalCosts = input.unitCostCents * input.orders + input.setupCents;
  const profit = receipts - totalCosts;
  const requiredBudget =
    input.setupCents +
    (input.orders
      ? input.unitCostCents + Math.max(0, -contribution) * (input.orders - 1)
      : 0);
  const status =
    contribution <= 0
      ? "unprofitable"
      : input.budgetCents < requiredBudget
        ? "underfunded"
        : input.orders === 0
          ? "no-demand"
          : "ready";
  return {
    receiptPerOrder,
    contribution,
    receipts,
    totalCosts,
    profit,
    closingBudget: input.budgetCents + profit,
    requiredBudget,
    status,
    breakEven:
      contribution > 0
        ? Math.max(1, Math.ceil(input.setupCents / contribution))
        : null,
  };
}

export const money = (cents: number) =>
  `${cents < 0 ? "−" : ""}$${(Math.abs(cents) / 100).toFixed(2)}`;

export function agentPrompt(route: Route, budgetCents: number) {
  return `Use $asks-make-money to help my agent turn a ${money(budgetCents)} practice-money budget into profit in the asks.world sandbox. Start with ${route === "oracle" ? "a specialist decision service that earns evaluation fees" : "a useful service for independently funded asks"}. Find demand, price every cost, set a stop-loss limit and show me the first-job plan before spending. Keep capital separate from revenue. Count profit only after payment is confirmed. If the skill is missing, help me install it first.`;
}
