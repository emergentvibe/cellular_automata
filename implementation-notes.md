# Implementation Notes: Complexity Measurement Suite

**Status**: IMPLEMENTED - Ready to Run Survey
**Target**: Experiment 1 (262,144 Life-like Rule Survey)
**Last Updated**: January 2025

---

## Implementation Complete

All measurement infrastructure has been built. Ready to run the survey.

### Files Created

```
cells/
├── index.html                    # Original CA simulation (preserved)
├── survey.html                   # Survey runner UI
├── test-measurements.html        # Validation test suite
├── results-viewer.html           # Results visualization
├── investigation-seed-v2.md      # Theory document (with Appendix G)
├── implementation-notes.md       # This file
├── panel-briefing-implementation.md  # Panel Q&A
└── src/
    ├── core/
    │   ├── grid.js               # Grid class with toroidal wrapping
    │   ├── rule.js               # Rule encoding/decoding (B/S notation)
    │   ├── stepper.js            # CA step function + periodicity detection
    │   └── index.js              # Module exports
    ├── measure/
    │   ├── lambda.js             # Damage spreading measurement
    │   ├── dimension.js          # Box-counting fractal dimension
    │   ├── bdm.js                # BDM complexity (4×4 blocks)
    │   └── index.js              # Module exports
    ├── survey/
    │   ├── runner.js             # Survey orchestration + checkpointing
    │   ├── worker.js             # Web Worker for parallel execution
    │   └── index.js              # Module exports
    └── viz/
        ├── scatter3d.js          # 3D scatter plot (Three.js)
        ├── heatmap.js            # Rule space heatmaps
        └── index.js              # Module exports
```

---

## Success Criteria

### Measurement Suite: COMPLETE

1. **Lambda (λ) - Damage Spreading Exponent**
   - [x] Perturb single cell in identical grids
   - [x] Measure Hamming distance at t=1000 (per panel Q1)
   - [x] Formula: λ = (1/t) × ln(H(t)/H(0)) where H(0)=1
   - [x] Sentinel value λ=-10 for healed perturbations
   - [x] 10 trials averaged per measurement

2. **D - Fractal Dimension (Box-Counting)**
   - [x] Run rule for N timesteps from random initial condition
   - [x] Box-counting at scales 1, 2, 4, 8, 16, 32, 64, 128
   - [x] Linear regression for slope
   - [x] R² reported for quality check

3. **Gamma (γ) - Complexity Growth Rate (BDM)**
   - [x] Use 4×4 non-overlapping blocks (per R14)
   - [x] Approximated CTM values (entropy + structure based)
   - [x] γ = (BDM(C_t) - BDM(C_0)) / t × 1000 (bits per 1000 steps)

4. **Validation**: Use test-measurements.html to verify
   - [x] Life (B3/S23): λ 0.05-0.15, D 1.4-1.7, γ ≈ 0
   - [x] Seeds (B2/S): λ > 0.3, D high, γ < 0
   - [x] HighLife (B36/S23): similar to Life

---

## Experiment 1: Life-like Rule Survey

### Parameters

- **Rule space**: 2^9 × 2^9 = 262,144 rules
- **Encoding**: B subset of {0-8}, S subset of {0-8}
- **Grid size**: 256×256 (toroidal boundary)
- **Initial condition**: 30% random fill (consistent seed)
- **Measurement times**: t = 100, 1000, 10000
- **Runs per rule**: 3 (average to reduce noise)

### Success Criteria

- [ ] All 262,144 rules tested
- [ ] Results in `results/lifelike-survey.csv`
- [ ] Runtime < 72 hours total (≈1 sec/rule)
- [ ] (λ, D, γ) scatter plots generated
- [ ] Clustering analysis identifies behavior classes
- [ ] Top 100 "interesting" rules identified (high D, |λ| < 0.1, γ > 0)
- [ ] Outliers flagged for manual inspection (per R18)

### Output Schema

```csv
rule_id, birth_mask, survival_mask, lambda_100, lambda_1000, lambda_10000,
D_100, D_1000, D_10000, gamma, final_population, classification
```

---

## Panel Recommendations Tracker

From Panel 2 (v2 review):

| ID  | Recommendation                                    | Status  | Notes |
|-----|---------------------------------------------------|---------|-------|
| R14 | BDM uses 4×4 blocks                               | Planned | Zenil's recommendation |
| R15 | Use Dmishin's hyperbolic CA code                  | Later   | For Experiment 3 |
| R16 | Consider N7 (spatial heterogeneity)               | Deferred| Medium priority |
| R17 | Consider Integrated Information (Φ)               | Deferred| Medium priority |
| R18 | Flag outlier rules for follow-up                  | Planned | Part of survey |
| R19 | Split curvature into pos/neg sub-hypotheses       | Later   | For Experiment 3 |
| R20 | Acknowledge logical depth as conceptual target    | Done    | In v2 |
| R21 | Experiment 5: minimum for N4 (construction)       | Later   | After survey |

---

## Technical Decisions

### Why JavaScript (not Python)?

- Existing simulation is JS
- Browser-based = no install friction
- Web Workers for parallel rule testing
- Canvas for visualization
- Can run overnight in browser tab

### Why 256×256?

- Large enough for pattern emergence
- Small enough for fast iteration
- Standard in CA literature
- Toroidal at this size has minimal edge effects

### Why 30% Initial Density?

- Too sparse = dies immediately for most rules
- Too dense = chaotic for most rules
- 30% is empirically "interesting" starting point
- Consistent across all rules for fair comparison

### Why Toroidal Boundary?

- Eliminates edge effects
- Allows patterns to wrap (important for some rules)
- Standard in literature
- Fixed boundary tested separately in Experiment 2

---

## Architecture

```
src/
├── core/
│   ├── grid.js         # Grid class with toroidal wrapping
│   ├── rule.js         # Rule encoding/decoding (B/S notation)
│   └── stepper.js      # Efficient state update
├── measure/
│   ├── lambda.js       # Damage spreading calculation
│   ├── dimension.js    # Box-counting fractal dimension
│   └── bdm.js          # Block Decomposition Method (4×4)
├── survey/
│   ├── runner.js       # Orchestrates rule testing
│   ├── worker.js       # Web Worker for parallel execution
│   └── results.js      # CSV export, statistics
└── viz/
    ├── scatter.js      # (λ, D, γ) 3D scatter plot
    └── heatmap.js      # Rule space visualization
```

---

## QRI Connections (Appendix G Reference)

Overlaps to track as we gather data:

1. **Criticality**: Do rules at λ ≈ 0 show properties analogous to neural annealing?
2. **Symmetry**: Does high D correlate with any symmetry measure?
3. **Harmonics**: Can we decompose CA states into spatial frequency modes?
4. **Geometry**: When we test hyperbolic grids (Exp 3), how does this relate to QRI's hyperbolic phenomenology hypotheses?

---

## Completed Actions

1. [x] Add QRI as Appendix G to investigation-seed-v2.md
2. [x] Implement `src/core/grid.js` with efficient toroidal wrapping
3. [x] Implement `src/measure/lambda.js` - damage spreading
4. [x] Validate λ measurement against known rules
5. [x] Implement `src/measure/dimension.js` - box counting
6. [x] Implement `src/measure/bdm.js` - 4×4 block complexity
7. [x] Build survey runner with Web Workers
8. [x] Build visualization tools (3D scatter, heatmaps, 2D projections)
9. [x] Create survey UI (survey.html)
10. [x] Create results viewer (results-viewer.html)

## Next Actions

1. [ ] **Run the survey** - Open survey.html in browser, click Start
2. [ ] Wait ~12-24 hours for completion (with 4 workers)
3. [ ] Download CSV when complete
4. [ ] Load CSV in results-viewer.html to analyze
5. [ ] Identify top 100 interesting rules
6. [ ] Write up findings

---

## How to Run

### Validation Tests
```
Open test-measurements.html in browser
Click "Run All Tests"
Verify Life, Seeds, HighLife fall in expected ranges
```

### Survey
```
Open survey.html in browser
Configure settings (256×256 grid, 4 workers recommended)
Click "Start Survey"
Survey checkpoints every 1000 rules (safe to close/resume)
Click "Download CSV" when complete
```

### View Results
```
Open results-viewer.html in browser
Drop the CSV file or load from checkpoint
Explore 3D scatter, heatmaps, top rules
```

---

## References

- Dmishin's hyperbolic CA: https://github.com/dmishin/hyperbolic-ca
- Zenil's BDM: https://www.algorithmicdynamics.net/
- Box-counting dimension: standard algorithm
- Life-like rule notation: https://conwaylife.com/wiki/Life-like_cellular_automaton
