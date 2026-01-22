/**
 * Gamma (γ) - Complexity Growth Rate using BDM
 *
 * Block Decomposition Method (BDM) approximates Kolmogorov complexity
 * by decomposing data into small blocks and estimating their algorithmic
 * probability using the Coding Theorem Method (CTM).
 *
 * Panel specs (Q2):
 * - 4×4 non-overlapping blocks
 * - CTM table from PyBDM (65,536 entries for 2^16 possible 4×4 binary patterns)
 * - Formula: BDM(C) = Σ [CTM(block_i) + log₂(count_i)]
 * - γ = (BDM(C_t) - BDM(C_0)) / t (linear normalization)
 * - Report as "bits per 1000 steps"
 *
 * Interpretation:
 * - γ < 0: Complexity decreasing (converging to simpler state)
 * - γ ≈ 0: Complexity stable (cycling or plateau)
 * - γ > 0: Complexity growing (novelty production)
 */

import { Grid } from '../core/grid.js';

// Block size for BDM
const BLOCK_SIZE = 4;

/**
 * CTM (Coding Theorem Method) lookup table for 4×4 binary blocks.
 *
 * This approximates K(block) - the Kolmogorov complexity of each block.
 * Values are pre-computed using the approach from Zenil et al.
 *
 * Since we can't load the full PyBDM table, we use a simplified approximation
 * based on Shannon entropy and structural properties.
 *
 * For production use, replace this with the actual CTM table exported from PyBDM.
 */
const ctmCache = new Map();

/**
 * Approximate CTM value for a 4×4 binary block
 *
 * This is a simplified approximation. For accurate results,
 * load the actual CTM table from PyBDM.
 *
 * The approximation combines:
 * 1. Shannon entropy of the block
 * 2. Structural complexity (edge count, pattern type)
 */
function getCTM(blockValue) {
  if (ctmCache.has(blockValue)) {
    return ctmCache.get(blockValue);
  }

  // Convert block value to 4×4 binary array
  const bits = [];
  for (let i = 0; i < 16; i++) {
    bits.push((blockValue >> i) & 1);
  }

  // Count ones
  const ones = bits.filter(b => b === 1).length;
  const zeros = 16 - ones;

  // Special cases: very simple blocks
  if (ones === 0) {
    // All zeros - minimal complexity
    ctmCache.set(blockValue, 1);
    return 1;
  }
  if (ones === 16) {
    // All ones - minimal complexity
    ctmCache.set(blockValue, 1);
    return 1;
  }

  // Shannon entropy component
  const p1 = ones / 16;
  const p0 = zeros / 16;
  const entropy = -(p1 * Math.log2(p1) + p0 * Math.log2(p0));

  // Edge/structure complexity - count transitions
  let transitions = 0;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const idx = r * 4 + c;
      // Horizontal neighbor
      if (c < 3 && bits[idx] !== bits[idx + 1]) transitions++;
      // Vertical neighbor
      if (r < 3 && bits[idx] !== bits[idx + 4]) transitions++;
    }
  }

  // Symmetry check - symmetric patterns are simpler
  let isHSymmetric = true;
  let isVSymmetric = true;
  for (let r = 0; r < 4 && (isHSymmetric || isVSymmetric); r++) {
    for (let c = 0; c < 2; c++) {
      if (bits[r * 4 + c] !== bits[r * 4 + (3 - c)]) isHSymmetric = false;
      if (bits[c * 4 + r] !== bits[(3 - c) * 4 + r]) isVSymmetric = false;
    }
  }

  // Compute approximate complexity
  // Range roughly 1-16 bits
  let complexity = entropy * 4;  // Base: scaled entropy (0-4)
  complexity += transitions * 0.3;  // Structure contribution
  if (isHSymmetric) complexity -= 1;
  if (isVSymmetric) complexity -= 1;

  // Clamp to reasonable range
  complexity = Math.max(1, Math.min(16, complexity));

  ctmCache.set(blockValue, complexity);
  return complexity;
}

/**
 * Convert a 4×4 region of grid to a 16-bit integer
 */
function blockToValue(grid, startRow, startCol) {
  let value = 0;
  for (let r = 0; r < BLOCK_SIZE; r++) {
    for (let c = 0; c < BLOCK_SIZE; c++) {
      const row = startRow + r;
      const col = startCol + c;
      // Handle boundary - treat out-of-bounds as 0
      if (row < grid.rows && col < grid.cols) {
        const cellValue = grid.cells[grid.idx(row, col)] > 0 ? 1 : 0;
        value |= (cellValue << (r * BLOCK_SIZE + c));
      }
    }
  }
  return value;
}

/**
 * Compute BDM complexity of a grid
 *
 * BDM = Σ [CTM(block_i) + log₂(count_i)]
 *
 * Where count_i is how many times block_i appears
 */
export function computeBDM(grid) {
  const blockCounts = new Map();

  // Count occurrences of each unique block
  const blockRows = Math.ceil(grid.rows / BLOCK_SIZE);
  const blockCols = Math.ceil(grid.cols / BLOCK_SIZE);

  for (let br = 0; br < blockRows; br++) {
    for (let bc = 0; bc < blockCols; bc++) {
      const blockValue = blockToValue(grid, br * BLOCK_SIZE, bc * BLOCK_SIZE);
      blockCounts.set(blockValue, (blockCounts.get(blockValue) || 0) + 1);
    }
  }

  // Compute BDM
  let bdm = 0;
  for (const [blockValue, count] of blockCounts) {
    const ctm = getCTM(blockValue);
    bdm += ctm + Math.log2(count);
  }

  return {
    bdm,
    uniqueBlocks: blockCounts.size,
    totalBlocks: blockRows * blockCols,
    blockCounts
  };
}

/**
 * Measure complexity growth rate (gamma)
 *
 * @param {Rule} rule - The CA rule
 * @param {Object} options - Configuration options
 * @returns {Object} { gamma, bdm_initial, bdm_final, ... }
 */
export function measureGamma(rule, options = {}) {
  const {
    rows = 256,
    cols = 256,
    steps = 1000,
    density = 0.3,
    boundary = 'wrap',
    seed = Math.floor(Math.random() * 1000000)
  } = options;

  // Dynamic imports to avoid circular deps
  const { seededRandom } = require('../core/grid.js');
  const { run } = require('../core/stepper.js');

  // Initialize grid
  const grid = new Grid(rows, cols, boundary);
  const rng = seededRandom(seed);

  for (let i = 0; i < grid.cells.length; i++) {
    grid.cells[i] = rng() < density ? 1 : 0;
  }

  // Measure initial BDM
  const initial = computeBDM(grid);

  // Run simulation
  const finalGrid = run(grid, rule, steps);

  // Measure final BDM
  const final = computeBDM(finalGrid);

  // Compute gamma (bits per step, scaled to per 1000 steps)
  const gamma = ((final.bdm - initial.bdm) / steps) * 1000;

  return {
    gamma,
    bdm_initial: initial.bdm,
    bdm_final: final.bdm,
    uniqueBlocks_initial: initial.uniqueBlocks,
    uniqueBlocks_final: final.uniqueBlocks,
    steps,
    seed
  };
}

/**
 * Measure BDM at multiple time points
 */
export function measureBDMOverTime(grid, rule, options = {}) {
  const {
    steps = 1000,
    measureAt = [0, 100, 500, 1000]
  } = options;

  const { stepInPlace } = require('../core/stepper.js');

  let current = grid.clone();
  let next = new Grid(grid.rows, grid.cols, grid.boundary);

  const results = [];
  let nextMeasureIndex = 0;

  // Measure at t=0 if requested
  if (measureAt[0] === 0) {
    const bdmResult = computeBDM(current);
    results.push({ t: 0, ...bdmResult });
    nextMeasureIndex++;
  }

  for (let t = 1; t <= steps; t++) {
    stepInPlace(current, next, rule);
    [current, next] = [next, current];

    if (nextMeasureIndex < measureAt.length && t === measureAt[nextMeasureIndex]) {
      const bdmResult = computeBDM(current);
      results.push({ t, ...bdmResult });
      nextMeasureIndex++;
    }
  }

  return results;
}

/**
 * Quick gamma measurement with fewer steps (for survey)
 */
export function measureGammaQuick(rule, options = {}) {
  return measureGamma(rule, {
    steps: 1000,
    ...options
  });
}

/**
 * Load actual CTM table from JSON file
 * Call this at startup if you have the PyBDM export
 */
export function loadCTMTable(ctmData) {
  ctmCache.clear();
  for (const [key, value] of Object.entries(ctmData)) {
    ctmCache.set(parseInt(key), value);
  }
  console.log(`Loaded ${ctmCache.size} CTM entries`);
}

/**
 * Export current CTM cache (for debugging/verification)
 */
export function exportCTMCache() {
  return Object.fromEntries(ctmCache);
}
