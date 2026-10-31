import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const planner = new URL('../plugins/asks/skills/asks-make-money/scripts/plan-profit.ts', import.meta.url);
function plan(overrides = {}) {
  const input = { route: 'service', budget: '15', orders: '3', price: '5', 'unit-cost': '2', 'evaluation-fee': '0.5', setup: '0', ...overrides };
  return spawnSync(process.execPath, ['--experimental-strip-types', planner.pathname, ...Object.entries(input).flatMap(([key, value]) => [`--${key}`, value])], { encoding: 'utf8' });
}
function result(overrides) {
  const run = plan(overrides);
  assert.equal(run.status, 0, run.stderr);
  return JSON.parse(run.stdout);
}
const oracle = { route: 'oracle', orders: '20', price: '0.5', 'unit-cost': '0.12', 'evaluation-fee': '0', setup: '3' };
test('service forecast separates initial capital, receipts, costs and profit', () => {
  const run = result();
  assert.equal(run.mode, 'forecast-only');
  assert.equal(run.receipts, 1350);
  assert.equal(run.totalCosts, 600);
  assert.equal(run.profit, 750);
  assert.equal(run.closingBudget, 2250);
  assert.equal(result({ budget: '100' }).profit, run.profit);
});
test('oracle launch cost and fee shares determine break-even and retained profit', () => {
  assert.equal(result(oracle).profit, 460);
  assert.equal(result(oracle).breakEven, 8);
  assert.equal(result({ ...oracle, 'share-percent': '20' }).profit, 260);
  assert.equal(result({ ...oracle, price: '0.51', 'share-percent': '10' }).receiptPerOrder, 45);
});
test('no demand retains the launch loss', () => {
  assert.equal(result({ ...oracle, orders: '0' }).profit, -300);
  assert.equal(result({ ...oracle, orders: '0' }).status, 'no-demand');
});
test('insufficient first-job capital holds the plan', () => {
  const run = result({ ...oracle, budget: '1' });
  assert.equal(run.status, 'underfunded');
  assert.equal(run.requiredBudget, 312);
});
test('negative contribution is not ready', () => {
  assert.equal(result({ 'unit-cost': '6' }).status, 'unprofitable');
});
for (const [name, overrides] of Object.entries({ 'unknown route': { route: 'other' }, 'fractional order count': { orders: '1.5' }, 'malformed price': { price: 'oops' }, 'excess fee share': { ...oracle, 'share-percent': '101' }, 'evaluation above price': { 'evaluation-fee': '6' } })) {
  test(`planner rejects ${name}`, () => assert.notEqual(plan(overrides).status, 0));
}

test('fee shares reject excess precision instead of silently rounding', () => {
  for (const share of ['100.004', '0.001']) assert.notEqual(plan({ ...oracle, 'share-percent': share }).status, 0);
  assert.equal(result({ ...oracle, 'share-percent': '12.34' }).input.shareBps, 1234);
});
