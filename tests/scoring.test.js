import { test } from 'node:test';
import assert from 'node:assert/strict';

import { evaluatePrediction, pickNextScenarioIndex, TARGET_TOLERANCE_PCT } from '../src/lib/scoring.js';

const scenario = { lastPrice: 100, outcome: { direction: 'LONG', futureClose: 110 } };

test('direction mode wins only on the correct direction', () => {
  assert.equal(evaluatePrediction(scenario, { direction: 'LONG' }), true);
  assert.equal(evaluatePrediction(scenario, { direction: 'SHORT' }), false);
});

test('target mode needs the right side and a target within tolerance', () => {
  assert.equal(evaluatePrediction(scenario, { targetPrice: 112 }), true);   // 2% off
  assert.equal(evaluatePrediction(scenario, { targetPrice: 110 + TARGET_TOLERANCE_PCT }), true);  // exactly at tolerance
  assert.equal(evaluatePrediction(scenario, { targetPrice: 125 }), false);  // right side, 15% off
  assert.equal(evaluatePrediction(scenario, { targetPrice: 99 }), false);   // wrong side of last price
});

test('next scenario never repeats the current one', () => {
  for (let current = 0; current < 5; current++) {
    for (const r of [0, 0.25, 0.5, 0.75, 0.999]) {
      const next = pickNextScenarioIndex(current, 5, () => r);
      assert.notEqual(next, current);
      assert.ok(next >= 0 && next < 5);
    }
  }
});

test('next scenario covers every other index', () => {
  const seen = new Set();
  for (let i = 0; i < 4; i++) seen.add(pickNextScenarioIndex(2, 5, () => i / 4));
  assert.deepEqual([...seen].sort(), [0, 1, 3, 4]);
});

test('single scenario pool stays on index 0', () => {
  assert.equal(pickNextScenarioIndex(0, 1), 0);
});
