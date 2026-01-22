/**
 * Lambda (λ) - Damage Spreading Exponent
 *
 * Measures sensitivity to perturbation: how fast do nearby trajectories diverge?
 *
 * Panel specs (Q1):
 * - Single cell perturbation
 * - N = 10 trials, average over random perturbation locations
 * - t = 1000 steps
 * - Formula: λ = (1/t) × ln(h(t)/h(0)) where h(0) = 1
 * - Edge case: If h(t) = 0, set λ = -10 (sentinel for "healed")
 *
 * Interpretation:
 * - λ < 0: Ordered. Perturbations heal.
 * - λ ≈ 0: Critical. Perturbations neither grow nor shrink.
 * - λ > 0: Chaotic. Perturbations explode exponentially.
 *
 * Expected values:
 * - Life (B3/S23): 0.05 - 0.15
 * - Seeds (B2/S): 0.8 - 1.5
 */

import { Grid, seededRandom } from '../core/grid.js';
import { stepInPlace } from '../core/stepper.js';

/**
 * Compute damage spreading exponent for a rule
 *
 * @param {Rule} rule - The CA rule to measure
 * @param {Object} options - Configuration options
 * @param {number} options.rows - Grid rows (default 256)
 * @param {number} options.cols - Grid cols (default 256)
 * @param {number} options.trials - Number of trials to average (default 10)
 * @param {number} options.steps - Steps to run (default 1000)
 * @param {number} options.density - Initial fill density (default 0.3)
 * @param {string} options.boundary - Boundary type (default 'wrap')
 * @param {number} options.baseSeed - Base random seed (default random)
 * @returns {Object} { lambda, trials, raw }
 */
export function measureLambda(rule, options = {}) {
  const {
    rows = 256,
    cols = 256,
    trials = 10,
    steps = 1000,
    density = 0.3,
    boundary = 'wrap',
    baseSeed = Math.floor(Math.random() * 1000000)
  } = options;

  const lambdaValues = [];
  const rawData = [];

  for (let trial = 0; trial < trials; trial++) {
    const seed = baseSeed + trial;
    const result = runSingleTrial(rule, { rows, cols, steps, density, boundary, seed });

    lambdaValues.push(result.lambda);
    rawData.push(result);
  }

  // Compute mean and standard deviation
  const mean = lambdaValues.reduce((a, b) => a + b, 0) / lambdaValues.length;
  const variance = lambdaValues.reduce((sum, v) => sum + (v - mean) ** 2, 0) / lambdaValues.length;
  const stdDev = Math.sqrt(variance);

  return {
    lambda: mean,
    stdDev: stdDev,
    trials: lambdaValues,
    raw: rawData
  };
}

/**
 * Run a single damage spreading trial
 */
function runSingleTrial(rule, { rows, cols, steps, density, boundary, seed }) {
  const rng = seededRandom(seed);

  // Initialize two identical grids
  const grid1 = new Grid(rows, cols, boundary);
  const grid2 = new Grid(rows, cols, boundary);

  // Fill with same random pattern
  for (let i = 0; i < grid1.cells.length; i++) {
    const value = rng() < density ? 1 : 0;
    grid1.cells[i] = value;
    grid2.cells[i] = value;
  }

  // Flip one random cell in grid2
  const perturbRow = Math.floor(rng() * rows);
  const perturbCol = Math.floor(rng() * cols);
  grid2.flipCell(perturbRow, perturbCol);

  // Verify initial Hamming distance is 1
  const h0 = grid1.hammingDistance(grid2);
  if (h0 !== 1) {
    console.warn(`Initial Hamming distance should be 1, got ${h0}`);
  }

  // Create buffers for stepping
  let next1 = new Grid(rows, cols, boundary);
  let next2 = new Grid(rows, cols, boundary);

  let current1 = grid1;
  let current2 = grid2;

  // Record distances at key points
  const distanceLog = [{ t: 0, h: h0 }];

  // Run simulation
  for (let t = 1; t <= steps; t++) {
    stepInPlace(current1, next1, rule);
    stepInPlace(current2, next2, rule);

    // Swap buffers
    [current1, next1] = [next1, current1];
    [current2, next2] = [next2, current2];

    // Log at key timesteps
    if (t === 10 || t === 100 || t === steps) {
      const h = current1.hammingDistance(current2);
      distanceLog.push({ t, h });
    }
  }

  // Final Hamming distance
  const hFinal = current1.hammingDistance(current2);

  // Compute lambda
  let lambda;
  if (hFinal === 0) {
    // Perturbation healed completely - sentinel value
    lambda = -10;
  } else {
    // λ = (1/t) × ln(h(t)/h(0)) where h(0) = 1
    lambda = Math.log(hFinal) / steps;
  }

  return {
    lambda,
    h0,
    hFinal,
    distanceLog,
    perturbLocation: { row: perturbRow, col: perturbCol },
    seed
  };
}

/**
 * Quick lambda estimate with fewer trials (for survey)
 */
export function measureLambdaQuick(rule, options = {}) {
  return measureLambda(rule, {
    trials: 3,  // Fewer trials for speed
    steps: 1000,
    ...options
  });
}

/**
 * Detailed lambda analysis with distance curve
 */
export function measureLambdaDetailed(rule, options = {}) {
  const {
    rows = 256,
    cols = 256,
    steps = 1000,
    density = 0.3,
    boundary = 'wrap',
    seed = Math.floor(Math.random() * 1000000)
  } = options;

  const rng = seededRandom(seed);

  // Initialize grids
  const grid1 = new Grid(rows, cols, boundary);
  const grid2 = new Grid(rows, cols, boundary);

  for (let i = 0; i < grid1.cells.length; i++) {
    const value = rng() < density ? 1 : 0;
    grid1.cells[i] = value;
    grid2.cells[i] = value;
  }

  // Flip one cell
  const perturbRow = Math.floor(rng() * rows);
  const perturbCol = Math.floor(rng() * cols);
  grid2.flipCell(perturbRow, perturbCol);

  let next1 = new Grid(rows, cols, boundary);
  let next2 = new Grid(rows, cols, boundary);

  let current1 = grid1;
  let current2 = grid2;

  // Record distance at every step (for plotting)
  const distances = [current1.hammingDistance(current2)];

  for (let t = 1; t <= steps; t++) {
    stepInPlace(current1, next1, rule);
    stepInPlace(current2, next2, rule);
    [current1, next1] = [next1, current1];
    [current2, next2] = [next2, current2];
    distances.push(current1.hammingDistance(current2));
  }

  // Compute lambda from final distance
  const hFinal = distances[distances.length - 1];
  const lambda = hFinal === 0 ? -10 : Math.log(hFinal) / steps;

  return {
    lambda,
    distances,
    seed
  };
}
