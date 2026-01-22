/**
 * Measurement module exports
 *
 * Three measurements for characterizing CA dynamics:
 * - Lambda (λ): Damage spreading exponent (sensitivity to perturbation)
 * - D: Fractal dimension (structural complexity)
 * - Gamma (γ): Complexity growth rate (novelty production)
 */

export { measureLambda, measureLambdaQuick, measureLambdaDetailed } from './lambda.js';
export { measureDimension, measureDimensionOverTime } from './dimension.js';
export { computeBDM, measureGamma, measureGammaQuick, measureBDMOverTime, loadCTMTable } from './bdm.js';

/**
 * Measure all three quantities for a rule
 *
 * @param {Rule} rule - The CA rule to measure
 * @param {Object} options - Configuration options
 * @returns {Object} { lambda, D, gamma, ... }
 */
export async function measureAll(rule, options = {}) {
  const {
    rows = 256,
    cols = 256,
    steps = 1000,
    density = 0.3,
    boundary = 'wrap',
    seed = Math.floor(Math.random() * 1000000),
    lambdaTrials = 10
  } = options;

  // Import dynamically to work in both Node and browser
  const { Grid, seededRandom } = await import('../core/grid.js');
  const { stepInPlace } = await import('../core/stepper.js');
  const { measureLambda } = await import('./lambda.js');
  const { measureDimension } = await import('./dimension.js');
  const { computeBDM } = await import('./bdm.js');

  // Initialize grid
  const grid = new Grid(rows, cols, boundary);
  const rng = seededRandom(seed);
  for (let i = 0; i < grid.cells.length; i++) {
    grid.cells[i] = rng() < density ? 1 : 0;
  }

  // Measure initial BDM
  const bdmInitial = computeBDM(grid);

  // Run simulation
  let current = grid.clone();
  let next = new Grid(rows, cols, boundary);

  for (let t = 0; t < steps; t++) {
    stepInPlace(current, next, rule);
    [current, next] = [next, current];
  }

  // Measure final state
  const bdmFinal = computeBDM(current);
  const dimension = measureDimension(current);

  // Measure lambda (separate runs)
  const lambdaResult = measureLambda(rule, {
    rows,
    cols,
    trials: lambdaTrials,
    steps,
    density,
    boundary,
    baseSeed: seed + 1000000  // Different seed for lambda trials
  });

  // Compute gamma
  const gamma = ((bdmFinal.bdm - bdmInitial.bdm) / steps) * 1000;

  return {
    lambda: lambdaResult.lambda,
    lambda_stdDev: lambdaResult.stdDev,
    D: dimension.dimension,
    D_r_squared: dimension.r_squared,
    gamma,
    bdm_initial: bdmInitial.bdm,
    bdm_final: bdmFinal.bdm,
    population_final: current.population(),
    uniqueBlocks_final: bdmFinal.uniqueBlocks,
    seed
  };
}

/**
 * Quick measurement for survey (fewer trials, faster)
 */
export async function measureAllQuick(rule, options = {}) {
  return measureAll(rule, {
    lambdaTrials: 3,
    ...options
  });
}
