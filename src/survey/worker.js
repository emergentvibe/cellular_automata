/**
 * Web Worker for parallel rule testing
 *
 * Receives rule specifications, runs measurements, returns results.
 * This worker is spawned multiple times for parallel execution.
 */

// Import core modules (Web Workers use importScripts or dynamic import)
// For ES modules in workers, we need to be in a module worker

import { Grid, seededRandom } from '../core/grid.js';
import { Rule } from '../core/rule.js';
import { stepInPlace, runWithPeriodicity } from '../core/stepper.js';
import { measureDimension } from '../measure/dimension.js';
import { computeBDM } from '../measure/bdm.js';

/**
 * Measure a single rule and return results
 */
function measureRule(ruleId, options = {}) {
  const {
    rows = 256,
    cols = 256,
    steps = 1000,
    classificationSteps = 10000,
    density = 0.3,
    boundary = 'wrap',
    seed = Math.floor(Math.random() * 1000000),
    lambdaTrials = 3
  } = options;

  const rule = Rule.fromId(ruleId);
  const startTime = performance.now();

  // === Initialize grids ===
  const rng = seededRandom(seed);
  const grid = new Grid(rows, cols, boundary);
  for (let i = 0; i < grid.cells.length; i++) {
    grid.cells[i] = rng() < density ? 1 : 0;
  }

  // === Measure initial BDM ===
  const bdmInitial = computeBDM(grid);

  // === Run simulation with periodicity detection ===
  const periodicityResult = runWithPeriodicity(grid, rule, classificationSteps, 1000);
  const finalGrid = periodicityResult.finalGrid;

  // === Measure final state ===
  const bdmFinal = computeBDM(finalGrid);
  const dimension = measureDimension(finalGrid);

  // === Compute gamma ===
  const actualSteps = periodicityResult.generations || steps;
  const gamma = actualSteps > 0
    ? ((bdmFinal.bdm - bdmInitial.bdm) / actualSteps) * 1000
    : 0;

  // === Measure lambda (damage spreading) ===
  const lambdaValues = [];
  for (let trial = 0; trial < lambdaTrials; trial++) {
    const trialSeed = seed + 1000000 + trial;
    const trialRng = seededRandom(trialSeed);

    // Create two identical grids
    const grid1 = new Grid(rows, cols, boundary);
    const grid2 = new Grid(rows, cols, boundary);
    for (let i = 0; i < grid1.cells.length; i++) {
      const value = trialRng() < density ? 1 : 0;
      grid1.cells[i] = value;
      grid2.cells[i] = value;
    }

    // Flip one cell
    const perturbRow = Math.floor(trialRng() * rows);
    const perturbCol = Math.floor(trialRng() * cols);
    grid2.flipCell(perturbRow, perturbCol);

    // Run both
    let next1 = new Grid(rows, cols, boundary);
    let next2 = new Grid(rows, cols, boundary);
    let current1 = grid1;
    let current2 = grid2;

    for (let t = 0; t < steps; t++) {
      stepInPlace(current1, next1, rule);
      stepInPlace(current2, next2, rule);
      [current1, next1] = [next1, current1];
      [current2, next2] = [next2, current2];
    }

    const hFinal = current1.hammingDistance(current2);
    const lambda = hFinal === 0 ? -10 : Math.log(hFinal) / steps;
    lambdaValues.push(lambda);
  }

  const lambdaMean = lambdaValues.reduce((a, b) => a + b, 0) / lambdaValues.length;

  const endTime = performance.now();

  return {
    rule_id: ruleId,
    birth_mask: Math.floor(ruleId / 512),
    survival_mask: ruleId % 512,
    rule_string: rule.toString(),
    lambda: lambdaMean,
    D: dimension.dimension,
    D_r_squared: dimension.r_squared,
    gamma: gamma,
    bdm_initial: bdmInitial.bdm,
    bdm_final: bdmFinal.bdm,
    population_final: finalGrid.population(),
    period: periodicityResult.period,
    classification: periodicityResult.classification,
    generations: periodicityResult.generations,
    runtime_ms: endTime - startTime
  };
}

// Handle messages from main thread
self.onmessage = function(e) {
  const { type, data } = e.data;

  switch (type) {
    case 'measure':
      // Measure a single rule
      const result = measureRule(data.ruleId, data.options);
      self.postMessage({ type: 'result', data: result });
      break;

    case 'measureBatch':
      // Measure multiple rules
      const results = [];
      for (const ruleId of data.ruleIds) {
        const result = measureRule(ruleId, data.options);
        results.push(result);
        // Send progress update
        self.postMessage({ type: 'progress', data: { ruleId, completed: results.length, total: data.ruleIds.length } });
      }
      self.postMessage({ type: 'batchComplete', data: results });
      break;

    case 'ping':
      self.postMessage({ type: 'pong' });
      break;

    default:
      console.warn('Unknown message type:', type);
  }
};

// Signal that worker is ready
self.postMessage({ type: 'ready' });
