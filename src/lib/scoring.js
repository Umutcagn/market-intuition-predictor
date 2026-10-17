// Target-mode tolerance: the target must be on the right side of the last price and
// within this distance (as % of the last price) from the actual future close.
export const TARGET_TOLERANCE_PCT = 12.0;

export function evaluatePrediction(scenario, prediction) {
  const { outcome, lastPrice } = scenario;
  if (prediction.targetPrice) {
    const priceDiffPct = Math.abs((outcome.futureClose - prediction.targetPrice) / lastPrice) * 100;
    const predictedDir = prediction.targetPrice >= lastPrice ? 'LONG' : 'SHORT';
    return predictedDir === outcome.direction && priceDiffPct <= TARGET_TOLERANCE_PCT;
  }
  return prediction.direction === outcome.direction;
}

// Random next scenario index that never repeats the current one (when there is a choice)
export function pickNextScenarioIndex(currentIndex, count, random = Math.random) {
  if (count <= 1) return 0;
  const offset = 1 + Math.floor(random() * (count - 1));
  return (currentIndex + offset) % count;
}
