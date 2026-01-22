# Investigation Seed: A Theory of Persistent Complexity in Discrete Computational Universes

*Document version: 0.1*
*Date: January 2025*

---

## Part I: How We Got Here

### Origin

This investigation began with a simple request: build a cellular automaton simulation like Conway's Game of Life. A working implementation was created with multiple rule systems (Life, Brian's Brain, Wireworld, etc.), visual features (cell aging, trails, population graphs), and interactive controls.

A question arose about Brian's Brain: does it run forever?

The answer depended on topology:
- On an infinite grid: always dies
- On a fixed boundary: always dies
- On a torus (wrapping): can persist indefinitely

This raised deeper questions. Why does the shape of space determine whether computation continues? What properties must a universe have to support ongoing complexity?

### The Path of Inquiry

The conversation evolved through several stages:

1. **Specific question about Brian's Brain** → realization that topology matters
2. **Why does topology matter?** → because wrapping allows signals to return and sustain activity
3. **What about other topologies?** → genus (number of holes), orientability (twists) might matter
4. **Can we generalize?** → seeking conditions for any (rule, topology) pair to support persistent complexity
5. **What existing research exists?** → survey of cellular automata theory, edge of chaos, self-replication, open-ended evolution
6. **Can we formalize this?** → development of theoretical framework
7. **What are the key variables?** → identification of (λ, D, γ) space

### Key Realizations Along the Way

- **Brian's Brain has no stable structures.** Every living cell must die. This is why it can't persist on infinite/bounded grids—activity can only propagate outward and dissipate.

- **Topology affects resonance.** On a torus, signals return. If the return time aligns with the rule's natural period, activity might sustain through constructive interference.

- **The "edge of chaos" is real but poorly understood.** Langton's lambda parameter was a crude attempt to measure it. It captured something true but was too simple—rules with identical lambda behave completely differently.

- **Complexity requires multiple conditions.** Not just one property, but a conjunction: irreducibility, memory, transmission, construction capacity, and non-dissipation. All are necessary; none alone is sufficient.

- **Topology might "tune" rules toward criticality.** A rule that's chaotic on infinite plane might be critical on torus. This is testable.

---

## Part II: The Theory (Summary)

### Core Thesis

Persistent, unbounded complexity in a discrete computational universe requires:

1. **Computational irreducibility** — no shortcut to predict the future
2. **Stable information storage** — patterns that persist (memory)
3. **Information transmission** — signals that propagate (communication)
4. **Construction capacity** — patterns that build other patterns
5. **Non-dissipation** — activity doesn't inevitably decay

Conditions 1-4 are properties of the rule R.
Condition 5 depends on both rule R and topology T.

### Classification of Long-Term Behavior

- **Class I (Extinction):** All activity dies
- **Class II (Fixed Point):** System freezes
- **Class III (Periodic):** System enters repeating cycle
- **Class IV (Bounded Aperiodic):** Ongoing change but bounded complexity
- **Class V (Unbounded Complexity):** Complexity grows without bound

Class V is what we seek. It may be where life, evolution, and open-ended computation live.

### The (λ, D, γ) Space

Three measurable quantities characterize a system's dynamics:

**λ (Lyapunov Exponent):** Sensitivity to perturbation
- λ < 0: stable, perturbations shrink
- λ = 0: critical, perturbations neither grow nor shrink
- λ > 0: chaotic, perturbations explode

**D (Fractal Dimension):** Structural complexity of spacetime pattern
- D ≈ 1: simple linear structures
- D ≈ 2: space-filling (noise or solid)
- 1 < D < 2: fractal, structured complexity

**γ (Complexity Growth Rate):** Rate of novelty production
- γ ≤ 0: complexity bounded or decreasing
- γ > 0: complexity genuinely growing

### The Critical Surface

The critical surface Σ is the region where interesting behavior lives:

$$\Sigma = \{(\lambda, D, \gamma) : |\lambda| < \epsilon, D \in (D_{min}, D_{max})\}$$

Empirically (to be determined): ε ≈ 0.05, D_min ≈ 1.4, D_max ≈ 1.8

**Conjecture:** Class V behavior occurs only on or near Σ with γ > 0.

### Topology's Role

Topology T acts as a transformation on (λ, D, γ) space.

**Conjectures:**
- Compact topologies push λ toward zero (stabilize chaotic rules, activate stable ones)
- Higher genus increases D (more interference patterns, richer structure)
- Non-orientable topologies enable/disable certain symmetric structures

---

## Part III: Open Questions

### Foundational Questions

**Q1:** Is Class V behavior achievable in any finite deterministic system, or does it require unbounded space?

**Q2:** Is there a minimum genus required for a given rule to exhibit Class V behavior?

**Q3:** Can the critical surface Σ be characterized analytically, or only empirically?

**Q4:** Is there a universal exponent governing complexity growth in Class V systems?

**Q5:** Does self-organized criticality occur in rule space—do evolving rules naturally approach Σ?

### Measurement Questions

**Q6:** Is compression a good proxy for Kolmogorov complexity? Which compressor? Should we ensemble?

**Q7:** How do finite-size effects influence (λ, D, γ) measurements?

**Q8:** What's the right definition of γ that captures "meaningful" complexity growth vs. mere change?

**Q9:** Should there be a fourth dimension? Candidates: entropy rate, autocorrelation time, replicator density.

**Q10:** How do we handle systems that never stabilize? T_max dependence?

### Topology Questions

**Q11:** Does genus actually matter, or only compactness vs. non-compactness?

**Q12:** Does orientability matter? How does the Klein bottle differ from the torus for symmetric rules?

**Q13:** Is there a "resonance condition" relating rule period to topology circumference?

**Q14:** Can topology alone push a non-computing rule into computing?

### Evolution Questions

**Q15:** What's the minimal rule supporting self-replication?

**Q16:** What's the minimal rule supporting open-ended evolution?

**Q17:** Why do all known systems eventually converge rather than evolve forever?

**Q18:** Can topology prevent convergence and enable true open-endedness?

---

## Part IV: Possible Experimental Setups

### Experiment 1: Brian's Brain Resonance Test

**Goal:** Test whether torus circumference affects survival time in a periodic pattern.

**Method:**
- Run Brian's Brain on toroidal grids of varying size (50×50 to 150×150)
- Same random initial conditions (scaled appropriately)
- Measure time to extinction (or mark "persistent" after N generations)
- Plot survival time vs. circumference
- Look for periodicity (does circumference mod 3 matter?)

**Prediction:** Survival time shows periodic dependence on grid size, with peaks when circumference/signal_speed ≡ 0 (mod 3).

### Experiment 2: Life-like Rule Survey

**Goal:** Map all 262,144 Life-like rules in (λ, D, γ) space.

**Method:**
- For each (B, S) pair where B, S ⊆ {0,1,2,3,4,5,6,7,8}
- Run 100 trials from random initial conditions
- Compute λ, D, γ for each
- Store results in database
- Visualize as 3D point cloud or 2D projections

**Analysis:**
- Identify clusters
- Locate known interesting rules (Life, HighLife, Day&Night)
- Find the empirical critical surface
- Search for unknown rules in promising regions

### Experiment 3: Topology Comparison

**Goal:** Measure how topology shifts rules in (λ, D, γ) space.

**Method:**
- Select ~100 rules spanning different regions of rule space
- For each rule, run on:
  - Torus (various sizes)
  - Klein bottle
  - Projective plane
  - Fixed boundary
  - Reflecting boundary
- Compute (λ, D, γ) for each (rule, topology) pair
- Visualize trajectories in (λ, D, γ) space as topology varies

**Analysis:**
- Do compact topologies systematically shift λ toward zero?
- Does non-orientability have consistent effect?
- Which rules are most sensitive to topology?

### Experiment 4: Genus Variation

**Goal:** Test the genus hypothesis.

**Method:**
- Implement higher-genus topologies (double torus, triple torus)
- Select rules near the critical surface
- Run on genus 1, 2, 3, 4 topologies
- Measure (λ, D, γ) and complexity plateau

**Prediction:** Higher genus increases complexity plateau for rules near Σ.

**Challenge:** Implementing higher-genus topologies in grid form is non-trivial. May require quotient space construction or explicit neighbor tables.

### Experiment 5: Self-Replicator Search

**Goal:** Find minimal rules supporting self-replication.

**Method:**
- Start with known self-replicating rules (Langton loops)
- Systematically simplify: reduce states, shrink neighborhood, remove rule entries
- Test if replication still occurs
- Map the boundary in rule space where replication becomes impossible

**Analysis:**
- What's the minimum states required?
- What's the minimum neighborhood?
- What rule properties correlate with replication capacity?

### Experiment 6: Open-Ended Evolution Attempt

**Goal:** Try to construct a system with non-converging evolution.

**Method:**
- Implement Flow-Lenia or similar continuous CA with:
  - Mass conservation
  - Localized parameters (genome-like)
  - Spatial structure (resource gradients, barriers)
- Run for very long times (10⁶+ generations)
- Track diversity metrics: number of distinct species, phenotype variance, novelty rate

**Question:** Can we delay or prevent convergence? What conditions extend it?

---

## Part V: Theoretical Lines of Inquiry

### Line 1: Analytical Characterization of Σ

Can we derive the critical surface from first principles rather than measuring empirically?

**Approach:**
- Study statistical mechanics of CA
- Relate λ to rule table structure (beyond crude lambda parameter)
- Connect D to information-theoretic properties of the rule
- Seek invariants that predict criticality

**Tools:** Transfer matrix methods, symbolic dynamics, graph theory on de Bruijn graphs.

### Line 2: Topology as Gauge Transformation

Borrow language from physics: topology T might act like a gauge transformation on rule dynamics.

**Approach:**
- Formalize how T transforms the effective rule
- Seek "gauge invariants"—properties unchanged by topology
- Identify what's gauge-dependent vs. gauge-invariant in (λ, D, γ)

**Goal:** Separate what's intrinsic to the rule from what's contributed by topology.

### Line 3: Information-Theoretic Reformulation

Reformulate conditions N1-N5 in information-theoretic terms.

**N1 (Irreducibility):** Mutual information between C₀ and Cₜ remains high for all t.

**N2 (Memory):** System has positive channel capacity for storage.

**N3 (Transmission):** System has positive channel capacity for spatial communication.

**N4 (Construction):** Conditional Kolmogorov complexity K(pattern | system) < K(pattern).

**N5 (Non-dissipation):** Entropy of active region doesn't decrease to zero.

**Goal:** Make conditions quantitative, potentially derive inequalities that must hold.

### Line 4: Category-Theoretic Framework

Formalize the space of computational universes as a category.

**Objects:** (S, R, T) triples—computational universes

**Morphisms:** Structure-preserving maps between universes (embeddings, projections, quotients)

**Goal:** Understand what properties are preserved under what transformations. When can one universe simulate another? What's the partial order of computational power?

### Line 5: Connection to Constructor Theory

David Deutsch's constructor theory asks: what transformations are possible vs. impossible?

**Application:** For a given (R, T), what patterns are constructible? Is there a "constructor" that can build arbitrary patterns? What's the "constructor-theoretic" characterization of Class V?

**Goal:** Reframe the question from "what happens?" to "what can be built?"

### Line 6: Universality Classes

In statistical mechanics, systems at phase transitions fall into universality classes—different systems with same critical exponents.

**Question:** Do Class V systems have universal properties? Is there a finite set of universality classes for open-ended complexity?

**Approach:** Measure critical exponents (scaling of correlation length, susceptibility analogs) for various rules near Σ. Look for clustering.

---

## Part VI: Motivation

### Why Does This Matter?

**For artificial life:** Understanding conditions for open-ended evolution could let us build systems that keep creating novelty forever—true artificial creativity.

**For origin of life:** The question "why did life arise?" might reduce to "what (R, T) pairs support Class V, and is our universe one of them?"

**For physics:** If spacetime is discrete at Planck scale, these results constrain what physical laws can exist in life-supporting universes.

**For computation:** Understanding the edge of chaos could improve algorithm design—systems that compute without being chaotic, persist without being frozen.

**For philosophy:** The question "why is there something rather than nothing complex?" gets a potential formal answer: only certain (R, T) pairs allow complexity to exist and persist.

### The Deep Question

At root, we're asking: **what makes a universe hospitable to ongoing complexity?**

Not just complexity appearing (that's common—random noise is complex).
Not just complexity persisting (that's also achievable—crystals persist).
But complexity *growing without bound*—that's rare and special.

Our universe does this. Stars form, planets coalesce, chemistry complexifies, life emerges, minds arise, civilizations build. 13.8 billion years and counting, still producing novelty.

Why?

---

## Part VII: What's Needed Next

### Immediate Needs

1. **Peer review of the theory.** Is this coherent? What's wrong? What's missing?

2. **Literature deep-dive.** Surely some of this has been done. What can we learn from prior work?

3. **Implementation of measurement tools.** Code to compute λ, D, γ reliably.

4. **Topology implementations.** Code for Klein bottle, projective plane, higher genus surfaces.

### Medium-Term Goals

5. **Run Experiment 1** (Brian's Brain resonance). Quick test of core hypothesis.

6. **Run Experiment 2** (Life-like survey). Generate the (λ, D, γ) map.

7. **Run Experiment 3** (topology comparison). Test topology conjectures.

### Long-Term Aspirations

8. **Find an analytical characterization of Σ.** Move from empirical to theoretical.

9. **Construct a Class V system with demonstrated unbounded complexity.** The holy grail.

10. **Connect to physics.** If we succeed, what does it say about our universe?

---

## Appendix A: Key Terms

**Cellular Automaton (CA):** A discrete computational system where cells on a grid update simultaneously based on local rules.

**Rule:** The transition function mapping neighborhood states to next state.

**Topology:** The global structure of space—how it wraps, whether it has boundaries, its genus and orientability.

**Torus:** A donut-shaped surface. In 2D grids, both dimensions wrap. Genus 1, orientable.

**Klein Bottle:** Like a torus but with a twist—one dimension wraps with reflection. Genus 1, non-orientable.

**Genus:** Number of "holes" in a surface. Sphere = 0, torus = 1, double torus = 2.

**Orientability:** Whether the surface has consistent "handedness." Torus is orientable; Klein bottle is not.

**Lyapunov Exponent (λ):** Measures rate of divergence between nearby trajectories. Positive = chaotic, zero = critical, negative = stable.

**Fractal Dimension (D):** Measures how a pattern fills space. Non-integer values indicate fractal structure.

**Kolmogorov Complexity (K):** The length of the shortest program producing a given output. Measures intrinsic complexity.

**Edge of Chaos:** The transition region between ordered and chaotic behavior, hypothesized to support computation.

**Class V:** Our term for systems exhibiting unbounded complexity growth.

**Critical Surface (Σ):** The region in (λ, D, γ) space where interesting dynamics live.

---

## Appendix B: Connections to Existing Work

**Langton (1990):** Lambda parameter, edge of chaos hypothesis. Our work extends this with richer measures.

**Wolfram (1984, 2002):** Classification of CA into four classes. Our Class V refines his Class IV.

**Mitchell, Crutchfield, Hraber (1993):** Critique of lambda parameter. Showed it's insufficient. Motivates our multi-dimensional approach.

**Sayama (1999):** Evoloops—demonstrated Darwinian evolution in deterministic CA. Proof of concept for complexity growth.

**Chan (2019-present):** Lenia, Flow-Lenia—continuous CA with lifelike dynamics. State of the art in open-ended evolution attempts.

**Cronin & Walker (2023):** Assembly theory—complexity as path length in construction space. Complementary perspective.

**Wolfram (2020-present):** Physics project—deriving physics from hypergraph rewriting. Different question (what are our universe's rules?) but related methods.

---

## Appendix C: The Simulation

The investigation began with a browser-based cellular automaton simulation supporting:

- Multiple rules: Conway's Life, HighLife, Day & Night, Seeds, Brian's Brain, Wireworld
- Visual features: cell age coloring, death trails, population graph
- Interaction: draw/erase, pan, zoom, speed control
- Topology: toroidal (wrap) and fixed boundary

Located at: `/Users/yianni/Documents/development/cells/index.html`

This serves as the experimental platform for testing theoretical predictions.

---

---

## Appendix D: The 262,144 Life-like Rules

### What is a Life-like Rule?

A Life-like rule is a 2D cellular automaton where:
- Cells have 2 states: dead (0) or alive (1)
- Each cell has 8 neighbors (Moore neighborhood)
- The rule depends only on: (a) whether the cell is currently alive, and (b) how many neighbors are alive

The rule is defined by two sets:
- **B (Birth):** If a dead cell has exactly this many live neighbors, it becomes alive
- **S (Survival):** If a live cell has exactly this many live neighbors, it stays alive; otherwise it dies

### Notation

Rules are written as B{birth numbers}/S{survival numbers}.

**Examples:**
- **B3/S23** — Conway's Game of Life. Dead cells with 3 neighbors are born. Live cells with 2 or 3 neighbors survive.
- **B36/S23** — HighLife. Same as Life but also birth on 6 neighbors. Supports a simple replicator.
- **B3678/S34678** — Day & Night. Symmetric rule (looks same if you swap alive/dead).
- **B2/S** — Seeds. Birth on 2, nothing survives. Explosive and chaotic.

### Counting the Rules

Each of B and S is a subset of {0, 1, 2, 3, 4, 5, 6, 7, 8}.

Number of possible B sets: 2⁹ = 512
Number of possible S sets: 2⁹ = 512

Total Life-like rules: 512 × 512 = **262,144**

### The Rule Space

We can think of rule space as a 262,144-point discrete space, or as an 18-dimensional binary hypercube (9 bits for B + 9 bits for S).

Each point in this space defines a different universe with different dynamics.

**Known interesting points:**
| Rule | B | S | Name | Notable Property |
|------|---|---|------|------------------|
| B3/S23 | {3} | {2,3} | Life | Turing complete, rich dynamics |
| B36/S23 | {3,6} | {2,3} | HighLife | Has a simple replicator |
| B3678/S34678 | {3,6,7,8} | {3,4,6,7,8} | Day & Night | Symmetric under inversion |
| B2/S | {2} | {} | Seeds | Explosive, chaotic |
| B1357/S1357 | {1,3,5,7} | {1,3,5,7} | Replicator | Everything replicates |
| B368/S245 | {3,6,8} | {2,4,5} | Morley | Chaotic but structured |

### Why Survey All 262,144?

Most rules are boring:
- Many kill everything immediately (B too restrictive)
- Many fill the grid solid (S too permissive)
- Many are chaotic noise (wrong balance)

But somewhere in this space are rules that:
- Support computation
- Enable self-replication
- Exhibit Class V behavior (unbounded complexity)

We don't know which rules have which properties until we measure them.

The goal of Experiment 2 is to map all 262,144 rules in (λ, D, γ) space and find the interesting regions.

### Beyond Life-like Rules

Life-like rules are just one family. Others include:

**More states:** 3-state (Brian's Brain), 4-state (Wireworld), n-state Generations rules

**Different neighborhoods:** Von Neumann (4 neighbors), extended Moore (24 neighbors), hexagonal

**Non-totalistic:** Rules that care about neighbor *positions*, not just counts

**Continuous:** Lenia and SmoothLife, where states are real numbers 0-1

The 262,144 Life-like rules are the simplest interesting family to survey completely.

---

## Appendix E: Understanding (λ, D, γ) — What They Are and Why

### The Core Idea

(λ, D, γ) are **measurements** — outputs you get after running a simulation. They are NOT inputs like rules or topology.

```
INPUTS                           OUTPUTS
┌─────────────────┐              ┌─────────────────┐
│ Rule R          │              │ λ (stability)   │
│ Topology T      │  ──[RUN]──►  │ D (structure)   │
│ Initial state   │              │ γ (growth)      │
└─────────────────┘              └─────────────────┘
```

The same rule on different topologies → different (λ, D, γ).
Different rules on same topology → different (λ, D, γ).

### λ — The Lyapunov Exponent

**What it measures:** How sensitive is the system to tiny changes?

**How to compute:**
1. Start with configuration C₀
2. Make a copy C₀' with exactly one cell flipped
3. Run both for t steps
4. Count how many cells differ between Cₜ and Cₜ'
5. λ = (1/t) × ln(difference count)

**Interpretation:**
- λ < 0: The difference shrinks. System is **stable**. Perturbations heal. Boring.
- λ = 0: The difference stays roughly constant. System is **critical**. Interesting.
- λ > 0: The difference explodes. System is **chaotic**. Noisy.

**Why it matters:** Systems at λ ≈ 0 are at the "edge of chaos" — stable enough for structure to persist, sensitive enough for information to process.

### D — The Fractal Dimension

**What it measures:** How richly structured is the spacetime pattern?

**How to compute:**
1. Run the simulation, recording state at each timestep
2. This gives a 2D image: x-axis is space, y-axis is time
3. Cover the image with boxes of size ε
4. Count boxes N(ε) containing at least one active cell
5. Repeat for different ε values
6. D = slope of ln(N) vs ln(1/ε)

**Interpretation:**
- D ≈ 1: Pattern is essentially lines. Simple trajectories.
- D ≈ 2: Pattern fills the space. Either solid activity or random noise.
- 1 < D < 2: **Fractal structure**. Complex, multi-scale patterns.

**Why it matters:** High D with low λ suggests structured complexity — the signature of interesting computation. D ≈ 1.5-1.8 seems to be the sweet spot.

### γ — The Complexity Growth Rate

**What it measures:** Is the system producing genuinely new structure, or just rearranging?

**How to compute:**
1. Run for t steps
2. Compress the configuration at each step (using gzip or similar)
3. γ = (compressed_size(Cₜ) - compressed_size(C₀)) / t

**Interpretation:**
- γ < 0: System is getting simpler. Converging to fixed point or simple cycle.
- γ = 0: System is cycling through similar complexity. Bounded but not growing.
- γ > 0: System is producing **genuinely new complexity**. This is what we seek.

**Why it matters:** λ and D can both be "good" but the system just cycles. γ catches whether novelty is actually being created.

### Why These Three?

They capture different essential aspects:

| Measure | Question | Failure mode if wrong |
|---------|----------|----------------------|
| λ | Is it stable enough? | Too stable = dead. Too chaotic = noise. |
| D | Is it structured? | Too simple = boring. Too complex = random. |
| γ | Is it growing? | No growth = eventual stagnation. |

Together, they locate a system in a space where we can identify the "interesting" region empirically.

### The Critical Surface Σ

We conjecture that Class V behavior (unbounded complexity) lives in a specific region:

$$\Sigma = \{ (\lambda, D, \gamma) : |\lambda| < 0.05, 1.4 < D < 1.8, \gamma > 0 \}$$

This is the **critical surface** — where rules are balanced enough to compute, structured enough to be interesting, and actually growing in complexity.

### An Analogy

Think of (λ, D, γ) space like a map of possible weathers:

- **λ** is like temperature stability. Too cold = frozen. Too hot = boiling chaos.
- **D** is like cloud structure. Clear sky = simple. Uniform overcast = boring. Fractal clouds = interesting.
- **γ** is like whether storms are developing or dissipating.

The "critical surface" is the weather pattern where interesting meteorology happens — structured storms that keep developing. Too far in any direction and you get boring stasis or chaotic noise.

---

## Appendix F: A Concrete Example

### Brian's Brain Across Topologies

Let's trace how one rule behaves on different topologies.

**The Rule (Brian's Brain):**
- 3 states: Dead (0), Firing (1), Refractory (2)
- Dead cell with exactly 2 firing neighbors → Firing
- Firing cell → Refractory (always)
- Refractory cell → Dead (always)

**Key property:** No stable structures possible. Every firing cell MUST die within 2 steps.

### On Infinite Grid

Activity propagates outward as waves. Interior cells cycle through firing→refractory→dead and stay dead (no neighbors to reignite them). The wavefront expands and thins.

**Result:** Always dies.

**Estimated (λ, D, γ):**
- λ ≈ 0 (waves propagate predictably)
- D ≈ 1.5 (fractal wave patterns, but transient)
- γ < 0 (complexity decreases as activity dissipates)

### On Fixed Boundary

Same as infinite, but waves also die when they hit edges.

**Result:** Always dies, usually faster than infinite.

**Estimated (λ, D, γ):** Similar to infinite, but lower D (less room for structure).

### On Torus (Wrapping)

Waves propagate, wrap around, and can re-enter regions that have recovered (returned to dead state). If timing works out, waves sustain each other.

**Result:** Can persist indefinitely. Creates beautiful spiral patterns.

**Estimated (λ, D, γ):**
- λ ≈ 0 (still predictable wave propagation)
- D ≈ 1.6 (sustained fractal spiral structure)
- γ ≈ 0 (complexity sustains but doesn't grow — it's Class IV, not Class V)

### The Lesson

Same rule, different topology, different (λ, D, γ), different fate.

Topology transformed Brian's Brain from Class I (extinction) to Class IV (bounded aperiodic).

**Open question:** Can any topology push Brian's Brain to Class V? Probably not — the rule lacks construction capacity (Condition N4). But this is testable.

---

*End of document.*
