/**
 * CA stepper - advances grid state by one generation
 */

import { Grid } from './grid.js';

/**
 * Step a grid forward one generation using the given rule
 * Returns a new grid (does not modify input)
 */
export function step(grid, rule) {
  const next = new Grid(grid.rows, grid.cols, grid.boundary);

  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const current = grid.get(row, col);
      const neighbors = grid.countNeighbors(row, col);

      if (current > 0) {
        // Cell is alive
        if (rule.shouldSurvive(neighbors)) {
          // Survive - increment age (capped at 255 for Uint8Array)
          next.set(row, col, Math.min(current + 1, 255));
        } else {
          // Die
          next.set(row, col, 0);
        }
      } else {
        // Cell is dead
        if (rule.shouldBirth(neighbors)) {
          // Birth
          next.set(row, col, 1);
        } else {
          // Stay dead
          next.set(row, col, 0);
        }
      }
    }
  }

  return next;
}

/**
 * Step a grid in-place using double buffering
 * More memory efficient for repeated stepping
 */
export function stepInPlace(current, next, rule) {
  for (let row = 0; row < current.rows; row++) {
    for (let col = 0; col < current.cols; col++) {
      const state = current.get(row, col);
      const neighbors = current.countNeighbors(row, col);

      if (state > 0) {
        if (rule.shouldSurvive(neighbors)) {
          next.set(row, col, Math.min(state + 1, 255));
        } else {
          next.set(row, col, 0);
        }
      } else {
        if (rule.shouldBirth(neighbors)) {
          next.set(row, col, 1);
        } else {
          next.set(row, col, 0);
        }
      }
    }
  }
}

/**
 * Run simulation for n steps, returning final grid
 */
export function run(grid, rule, steps) {
  let current = grid.clone();
  let next = new Grid(grid.rows, grid.cols, grid.boundary);

  for (let i = 0; i < steps; i++) {
    stepInPlace(current, next, rule);
    // Swap buffers
    [current, next] = [next, current];
  }

  return current;
}

/**
 * Run simulation, recording state hashes for periodicity detection
 * Returns { finalGrid, period, classification, generations }
 *
 * Classifications:
 * - 'extinct': population = 0
 * - 'fixed': period = 1 (still life)
 * - 'periodic': period > 1
 * - 'aperiodic': no period detected within maxSteps
 */
export function runWithPeriodicity(grid, rule, maxSteps = 10000, hashWindow = 1000) {
  let current = grid.clone();
  let next = new Grid(grid.rows, grid.cols, grid.boundary);

  const hashes = new Map(); // hash -> generation when first seen
  let generation = 0;

  for (let i = 0; i < maxSteps; i++) {
    generation = i;

    // Check for extinction
    if (current.isEmpty()) {
      return {
        finalGrid: current,
        period: 0,
        classification: 'extinct',
        generations: generation
      };
    }

    // Check for periodicity
    const hash = current.hash();
    if (hashes.has(hash)) {
      const period = generation - hashes.get(hash);
      return {
        finalGrid: current,
        period: period,
        classification: period === 1 ? 'fixed' : 'periodic',
        generations: generation
      };
    }

    // Store hash (only keep last hashWindow to limit memory)
    hashes.set(hash, generation);
    if (hashes.size > hashWindow) {
      // Remove oldest entry
      const oldestKey = hashes.keys().next().value;
      hashes.delete(oldestKey);
    }

    // Step
    stepInPlace(current, next, rule);
    [current, next] = [next, current];
  }

  return {
    finalGrid: current,
    period: null,
    classification: 'aperiodic',
    generations: maxSteps
  };
}

/**
 * Run two grids in parallel for damage spreading calculation
 * Returns array of Hamming distances at each step
 */
export function runParallel(grid1, grid2, rule, steps) {
  let current1 = grid1.clone();
  let current2 = grid2.clone();
  let next1 = new Grid(grid1.rows, grid1.cols, grid1.boundary);
  let next2 = new Grid(grid2.rows, grid2.cols, grid2.boundary);

  const distances = [current1.hammingDistance(current2)];

  for (let i = 0; i < steps; i++) {
    stepInPlace(current1, next1, rule);
    stepInPlace(current2, next2, rule);

    [current1, next1] = [next1, current1];
    [current2, next2] = [next2, current2];

    distances.push(current1.hammingDistance(current2));
  }

  return {
    grid1: current1,
    grid2: current2,
    distances: distances
  };
}
