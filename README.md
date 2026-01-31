# Cells

**A research platform for mapping the universe of Life-like cellular automata.**

262,144 rules. Three metrics. One question: *What makes a universe fertile for complexity?*

---

## The Problem

In 2002, Stephen Wolfram formalized **computational irreducibility**: for many systems, the only way to know what they'll do is to run them. There are no shortcuts.

This applies directly to cellular automata. The space of Life-like rules contains 262,144 possibilities (2^18 combinations of birth and survival conditions). We can't mathematically predict which rules will produce gliders, computation, or complex emergence. We have to simulate them all—and measure what happens.

**Cells** is a browser-based platform for systematically exploring this space.

---

## The Approach

### Multi-Pass Analysis

```
262,144 rules
    ↓ Pass 1: Fast survey (1000 steps, basic metrics)
~10,000 non-trivial rules
    ↓ Pass 2: Deep analysis (10-trial λ, autocorrelation)
~500 compelling rules
    ↓ Pass 3: Human curation
~50 rules worthy of study
```

Each pass narrows focus while deepening understanding.

### Three Core Metrics

| Metric | Symbol | Question | Interpretation |
|--------|--------|----------|----------------|
| **Damage Spreading** | λ (lambda) | How sensitive to perturbation? | λ < 0: ordered, λ ≈ 0: critical, λ > 0: chaotic |
| **Fractal Dimension** | D | How spatially structured? | D ≈ 1: filaments, D ≈ 2: space-filling |
| **Activity Rate** | γ (gamma) | How dynamic? | γ ≈ 0: static, γ > 0: active |

These metrics locate rules in a behavior space where interesting regions cluster.

---

## Pages

| Page | Purpose |
|------|---------|
| **Survey** | GPU-accelerated Pass 1 survey of all 262,144 rules |
| **Explore** | Filter and browse surveyed rules via scatter plot + gallery |
| **Analyze** | Deep Pass 2 analysis on filtered subsets |
| **Lab** | Real-time interactive simulator for single rules |
| **Data** | Import/export CSV data |
| **About** | Research context and methodology |

---

## Quick Start

1. Open `home.html` in a modern browser (Chrome/Edge recommended for WebGPU)
2. Navigate to **Survey** to start measuring rules
3. Use **Explore** to filter results and find interesting candidates
4. Open rules in **Lab** to watch them evolve in real-time

All data persists in your browser's IndexedDB. Export to CSV anytime.

---

## Technical Details

### Rule Encoding

Life-like rules use B/S notation:
- **B3/S23** = "Birth on 3 neighbors, Survive on 2 or 3 neighbors" (Conway's Life)
- Internally: `ruleId = birthMask * 512 + survivalMask`
- Range: 0 to 262,143

### Architecture

```
cells/
├── home.html          # Landing page with animated hero
├── survey.html        # Pass 1: GPU survey engine
├── explore.html       # Interactive filter + gallery
├── analyze.html       # Pass 2: Deep analysis
├── lab.html           # Real-time simulator
├── about.html         # Research background
├── data.html          # Import/export
└── shared/
    ├── db.js          # IndexedDB API (Dexie.js)
    ├── nav.js         # Navigation
    └── styles.css     # Shared styles
```

### Technologies

- **WebGPU**: GPU-accelerated simulation and measurement
- **IndexedDB**: Browser-based persistence for 262k+ records
- **Canvas 2D**: Visualization and rendering
- **Dexie.js**: IndexedDB wrapper

### Database Schema

```javascript
rules: {
  ruleId: number,           // 0-262143 (primary key)
  ruleString: string,       // "B3/S23"
  lambda: number,           // Damage spreading exponent
  dimension: number,        // Fractal dimension
  gamma: number,            // Activity rate
  classification: string,   // "extinct" | "fixed" | "periodic" | "aperiodic"
  period: number,           // Oscillation period (if periodic)
  passLevel: number,        // 1, 2, or 3
  topology: string,         // "torus" (default)
  notes: string,            // User annotations
}
```

---

## The Metrics Explained

### Lambda (λ) — Damage Spreading

**Algorithm:**
1. Create two identical grids, flip one cell in the second
2. Run both for 1000 steps
3. Measure final Hamming distance
4. λ = (1/T) × ln(h_final / h_initial)

**Interpretation:**
- λ < 0: Perturbations heal (ordered)
- λ ≈ 0: Edge of chaos (critical)
- λ > 0: Perturbations explode (chaotic)

### Dimension (D) — Fractal Dimension

**Algorithm:** Box-counting method
1. Overlay grids of boxes at scales ε = 1, 2, 4, 8...
2. Count boxes containing live cells: N(ε)
3. D = -slope of ln(N) vs ln(ε)

**Interpretation:**
- D ≈ 0: Sparse/empty
- D ≈ 1: Linear structures
- D ≈ 2: Space-filling

### Gamma (γ) — Activity Rate

Average number of cells changing state per step over the simulation run.

---

## Research Questions

1. **What defines "interesting" regions of rule space?** Where do λ, D, γ cluster for complex rules?

2. **How does topology affect emergence?** Do gliders exist on all topologies? (torus, sphere, hyperbolic)

3. **What enables hierarchical emergence?** Cells → still lifes → gliders → guns → computers

4. **Can we engineer rules with target properties?** Reverse-engineer desired behavior?

---

## The Vision

> "People can run surveys that append the database. If someone comes up with a new metric, they can implement it, run it, add more metadata. Multiple layers of analysis, filtering, deeper analysis—allowing us to find amazing cellular automata and understand how changing fundamental rules (locality, topology, grid tiling) affect possible complexity and emergence. Patterns on patterns on patterns."

This is a living research platform, not a static dataset. Every browser that runs a survey contributes to the shared understanding.

---

## Future Directions

- **Topology variations**: Sphere, hyperbolic, hex grids
- **Glider detection**: Automated pattern recognition
- **Evolutionary search**: Genetic algorithms to find rules with target properties
- **Extended metrics**: Lyapunov exponents, basin sizes, entanglement entropy
- **Pattern library**: Catalog and classify discovered structures

---

## References

- Wolfram, S. (2002). *A New Kind of Science*
- Langton, C. (1990). "Computation at the Edge of Chaos"
- Conway's Game of Life: B3/S23 (ruleId = 6152)
- HighLife: B36/S23 (ruleId = 6664) — has a replicator

---

## License

MIT

---

*Built for exploring the foundations of emergence.*
