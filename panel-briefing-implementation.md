# Panel Briefing: Implementation Plan Review

**To:** Expert Panel (Zenil, Mitchell, Shalizi, Margenstern, Sayama, Sporns)
**From:** Implementation Team
**Re:** Technical questions before building measurement suite

---

## Project Status

We have completed the theoretical framework (investigation-seed-v2.md, graded A-) and are now preparing to implement the measurement suite for Experiment 1: the 262,144 Life-like rule survey.

## Current Directory

```
cells/
├── index.html                  # Working CA simulation (Life, HighLife, Brian's Brain, etc.)
├── investigation-seed.md       # v1 theory document
├── investigation-seed-v2.md    # v2 theory document (current, incorporates panel feedback)
└── implementation-notes.md     # Implementation plan with success criteria
```

## What We're Building

A JavaScript measurement suite to compute (λ, D, γ) for all 262,144 Life-like rules:

1. **λ (damage spreading):** Perturb one cell, measure Hamming distance divergence
2. **D (box-counting):** Fractal dimension of spacetime pattern
3. **γ (BDM complexity):** Algorithmic complexity growth rate using 4×4 blocks

## Planned Parameters

| Parameter | Planned Value | Rationale |
|-----------|---------------|-----------|
| Grid size | 256×256 | Balance of pattern space vs compute time |
| Boundary | Toroidal | Eliminates edge effects, standard in literature |
| Initial density | 30% random | Empirically "interesting" starting point |
| Measurement times | t = 100, 1000, 10000 | Captures short, medium, long-term dynamics |
| Runs per rule | 3 | Reduces noise while keeping survey feasible |
| BDM block size | 4×4 | Per R14 (Zenil's recommendation) |

---

## Specific Questions for Panel

### Q1: Operational Definition of λ (For Mitchell, Shalizi)

**Proposed method:**
1. Initialize grid C₀ from random seed
2. Create C₀' by flipping one random cell
3. Run both for t steps
4. Compute h(t) = Hamming distance (differing cells)
5. λ = (1/t) × ln(h(t)/h(0)), where h(0) = 1

**Questions:**
- Is single-cell perturbation sufficient, or should we average over multiple perturbation sizes?
- Should we use h(0) = 1 or bootstrap from h(1)?
- Any recommended number of trials to average over for stable λ estimates?

---

### Q2: BDM Implementation Details (For Zenil)

**Proposed method:**
- Decompose grid into 4×4 non-overlapping blocks
- Look up each block's algorithmic probability from CTM (Coding Theorem Method) table
- Sum contributions: BDM(C) = Σ [log₂(n_i) + K(b_i)]
- γ = (BDM(C_t) - BDM(C_0)) / log(t)

**Questions:**
- Is the standard 4×4 CTM lookup table publicly available, or do we need to compute it?
- Should we use overlapping or non-overlapping blocks?
- For binary grids, are there known edge cases where BDM fails to discriminate?
- Is log(t) the right normalization for γ, or should it be linear in t?

---

### Q3: Grid Size and Finite-Size Effects (For Mitchell, Sporns)

**Concern:** 256×256 may be too small for some patterns to fully develop, or too large for efficient surveying.

**Questions:**
- Is 256×256 sufficient for reliable (λ, D, γ) estimates?
- Should we run a subset at multiple sizes (128, 256, 512) to check for finite-size effects?
- Are there known rules where small grids give misleading results?

---

### Q4: Measurement Timing (For Shalizi)

**Proposed:** Measure at t = 100, 1000, 10000

**Questions:**
- Is 10,000 steps sufficient to distinguish Class III (periodic) from Class IV (bounded aperiodic)?
- Should we detect periodicity explicitly (state hashing) rather than rely on γ?
- Any rules known to have transients longer than 10,000 steps?

---

### Q5: Survey Validation (For All)

**Proposed validation benchmarks:**
- Life (B3/S23): λ ≈ 0, D ≈ 1.5-1.8, γ ≈ 0
- Seeds (B2/S): λ > 0, D high, γ < 0
- B/S (empty): D = 0, γ = 0

**Questions:**
- Are these expected ranges correct?
- What other known rules should we include as validation checkpoints?
- Are there published (λ, D) values for Life-like rules we can compare against?

---

### Q6: Curvature Experiments - Existing Implementations (For Margenstern)

**For Experiment 3 (later):** We plan to test rules on hyperbolic grids.

**Questions:**
- Is Dmishin's hyperbolic CA implementation (GitHub) suitable for our measurements?
- What hyperbolic tiling would you recommend for comparison with flat hexagonal grids?
- Any gotchas when porting Life-like rules to hyperbolic space?

---

## What We're NOT Asking

- Code architecture (we'll handle that)
- Language choice (JavaScript for browser compatibility)
- Visualization approach (standard scatter plots)

## Requested Output

For each question, please provide:
1. Direct answer or recommendation
2. Any references to existing implementations/papers
3. Warnings about known pitfalls

---

## Timeline

- Implementation: ~20-25 hours
- Survey runtime: ~12-24 hours (overnight)
- Analysis: ~5-10 hours

We aim to have initial results within 1-2 weeks.

---

*Thank you for your continued guidance. The v2 document incorporated all 12 recommendations from Panel 1, and we want to ensure the implementation is equally rigorous.*
