/**
 * D - Fractal Dimension (Box-Counting Method)
 *
 * Measures structural complexity of the spatial pattern.
 *
 * Algorithm:
 * 1. Run simulation for T steps
 * 2. For each scale ε (box size):
 *    - Overlay grid of boxes of side length ε
 *    - Count N(ε) = boxes containing at least one live cell
 * 3. D = -slope of linear regression of ln(N) vs ln(ε)
 *
 * Interpretation:
 * - D ≈ 0: Empty or very sparse
 * - D ≈ 1: Linear structures
 * - D ≈ 2: Space-filling (solid or random noise)
 * - 1 < D < 2: Fractal structure
 *
 * Expected values:
 * - Life (B3/S23): 1.4 - 1.7
 * - Seeds (B2/S): 1.8 - 2.0
 */

import { Grid } from '../core/grid.js';

/**
 * Compute box-counting fractal dimension of a grid
 *
 * @param {Grid} grid - The grid to measure
 * @param {Object} options - Configuration options
 * @param {number[]} options.scales - Box sizes to use (default: powers of 2)
 * @returns {Object} { dimension, r_squared, data }
 */
export function measureDimension(grid, options = {}) {
  const maxScale = Math.min(grid.rows, grid.cols) / 2;

  // Default scales: powers of 2 from 1 to maxScale
  const defaultScales = [];
  for (let s = 1; s <= maxScale; s *= 2) {
    defaultScales.push(s);
  }

  const { scales = defaultScales } = options;

  // Count boxes at each scale
  const data = [];
  for (const scale of scales) {
    const count = countNonEmptyBoxes(grid, scale);
    if (count > 0) {
      data.push({
        scale,
        count,
        logScale: Math.log(scale),
        logCount: Math.log(count)
      });
    }
  }

  if (data.length < 2) {
    // Not enough data points for regression
    return {
      dimension: 0,
      r_squared: 0,
      data,
      error: 'Insufficient data points'
    };
  }

  // Linear regression: logCount = -D * logScale + c
  // So D = -slope
  const regression = linearRegression(
    data.map(d => d.logScale),
    data.map(d => d.logCount)
  );

  return {
    dimension: -regression.slope,  // D = negative slope
    r_squared: regression.r_squared,
    intercept: regression.intercept,
    data
  };
}

/**
 * Count non-empty boxes at given scale
 */
function countNonEmptyBoxes(grid, scale) {
  const boxRows = Math.ceil(grid.rows / scale);
  const boxCols = Math.ceil(grid.cols / scale);

  let count = 0;

  for (let br = 0; br < boxRows; br++) {
    for (let bc = 0; bc < boxCols; bc++) {
      // Check if any cell in this box is alive
      let hasLife = false;

      for (let r = br * scale; r < Math.min((br + 1) * scale, grid.rows) && !hasLife; r++) {
        for (let c = bc * scale; c < Math.min((bc + 1) * scale, grid.cols) && !hasLife; c++) {
          if (grid.cells[grid.idx(r, c)] > 0) {
            hasLife = true;
          }
        }
      }

      if (hasLife) count++;
    }
  }

  return count;
}

/**
 * Simple linear regression
 * Returns { slope, intercept, r_squared }
 */
function linearRegression(x, y) {
  const n = x.length;

  if (n === 0) {
    return { slope: 0, intercept: 0, r_squared: 0 };
  }

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const meanX = sumX / n;
  const meanY = sumY / n;

  const denominator = sumX2 - n * meanX * meanX;

  if (Math.abs(denominator) < 1e-10) {
    return { slope: 0, intercept: meanY, r_squared: 0 };
  }

  const slope = (sumXY - n * meanX * meanY) / denominator;
  const intercept = meanY - slope * meanX;

  // R-squared
  const ssRes = y.reduce((sum, yi, i) => {
    const predicted = slope * x[i] + intercept;
    return sum + (yi - predicted) ** 2;
  }, 0);

  const ssTot = y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0);

  const r_squared = ssTot > 0 ? 1 - ssRes / ssTot : 0;

  return { slope, intercept, r_squared };
}

/**
 * Measure dimension after running a rule for specified steps
 *
 * @param {Rule} rule - The CA rule
 * @param {Object} options - Configuration options
 * @returns {Object} { dimension, r_squared, data }
 */
export function measureDimensionAfterRun(rule, options = {}) {
  const {
    rows = 256,
    cols = 256,
    steps = 1000,
    density = 0.3,
    boundary = 'wrap',
    seed = Math.floor(Math.random() * 1000000)
  } = options;

  // Import stepper dynamically to avoid circular deps
  const { run } = require('../core/stepper.js');
  const { seededRandom } = require('../core/grid.js');

  // Initialize grid
  const grid = new Grid(rows, cols, boundary);
  const rng = seededRandom(seed);

  for (let i = 0; i < grid.cells.length; i++) {
    grid.cells[i] = rng() < density ? 1 : 0;
  }

  // Run simulation
  const finalGrid = run(grid, rule, steps);

  // Measure dimension
  return measureDimension(finalGrid);
}

/**
 * Measure dimension at multiple time points
 */
export function measureDimensionOverTime(grid, rule, options = {}) {
  const {
    steps = 1000,
    measureAt = [100, 500, 1000]
  } = options;

  // Import here to avoid circular deps at module load
  const { Grid } = require('../core/grid.js');
  const { stepInPlace } = require('../core/stepper.js');

  let current = grid.clone();
  let next = new Grid(grid.rows, grid.cols, grid.boundary);

  const results = [];
  let nextMeasureIndex = 0;

  // Measure at t=0
  if (measureAt.includes(0)) {
    results.push({
      t: 0,
      ...measureDimension(current)
    });
    if (measureAt[0] === 0) nextMeasureIndex++;
  }

  for (let t = 1; t <= steps; t++) {
    stepInPlace(current, next, rule);
    [current, next] = [next, current];

    if (nextMeasureIndex < measureAt.length && t === measureAt[nextMeasureIndex]) {
      results.push({
        t,
        ...measureDimension(current)
      });
      nextMeasureIndex++;
    }
  }

  return results;
}
