import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const scenarios = JSON.parse(readFileSync(new URL('../src/data/scenarios.json', import.meta.url), 'utf-8'));
// Candles are stored rounded to 2 decimals while lastPrice / futureClose are not
const ROUNDING = 0.006;

test('scenario ids are unique', () => {
  assert.equal(new Set(scenarios.map(s => s.id)).size, scenarios.length);
});

test('each scenario has a 55-candle history and a 20-candle future on a continuous time axis', () => {
  for (const s of scenarios) {
    assert.equal(s.history.length, 55, s.id);
    assert.equal(s.future.length, 20, s.id);
    [...s.history, ...s.future].forEach((c, i) => assert.equal(c.time, i, s.id));
  }
});

test('candles are internally consistent (low <= open/close <= high)', () => {
  for (const s of scenarios) {
    for (const c of [...s.history, ...s.future]) {
      assert.ok(c.low <= Math.min(c.open, c.close) + ROUNDING, `${s.id} t=${c.time}`);
      assert.ok(c.high >= Math.max(c.open, c.close) - ROUNDING, `${s.id} t=${c.time}`);
    }
  }
});

test('lastPrice and futureClose match the candles they summarize', () => {
  for (const s of scenarios) {
    assert.ok(Math.abs(s.history.at(-1).close - s.lastPrice) <= ROUNDING, s.id);
    assert.ok(Math.abs(s.future.at(-1).close - s.outcome.futureClose) <= ROUNDING, s.id);
  }
});

test('outcome direction is the sign of the realized move', () => {
  for (const s of scenarios) {
    const expected = s.outcome.futureClose >= s.lastPrice ? 'LONG' : 'SHORT';
    assert.equal(s.outcome.direction, expected, s.id);
  }
});
