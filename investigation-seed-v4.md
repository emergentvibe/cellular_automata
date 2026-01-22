# Investigation Seed v4: Complexity Scaling in Toy Universes

*Version: 4.0*
*Date: January 2025*

---

## The Question

**What determines how complexity scales in a universe?**

Not just whether complexity exists, but how it behaves over time:
- Does it die? (Class I)
- Does it plateau? (Class II, III, IV)
- Does it grow without bound? (Class V - hypothetical)
- Does it oscillate? (Class III, or something new?)

We study toy universes (cellular automata) because they're simple enough to exhaust and rich enough to surprise.

---

## The Minimal Framework

A toy universe has only **two fundamental components**:

### 1. Substrate

The **graph structure of space**. This combines:
- **Dimensions** (1D, 2D, 3D)
- **Topology** (how edges connect: torus, sphere, hyperbolic, Klein bottle)
- **Locality** (which cells are neighbors: nearest, extended, irregular)

These aren't independent - they're all aspects of one thing: **the connectivity graph**.

A 2D torus with Moore neighborhood is just a graph where each node connects to 8 others in a specific pattern. A sphere with hexagonal tiling is a graph with mostly 6-connected nodes plus 12 nodes with 5 connections.

**The substrate is the stage.**

### 2. Rule

The **transition function**. Given a cell's state and its neighbors' states, what's the next state?

For binary cells: R: {0,1} × {0,1}^k → {0,1}

Where k = number of neighbors.

**The rule is the physics.**

---

## What About State Space?

Should "number of cell states" be a third fundamental variable?

**Maybe not.** Consider:
- Multiple states might emerge from binary rules on richer substrates
- Lenia (continuous states) can be approximated by discrete states
- Information content scales with log(states), so it's a quantitative not qualitative difference

**Working hypothesis:** Binary is sufficient. Richer state spaces are convenient but not fundamental. Test this later.

---

## The Five Classes of Complexity Scaling

| Class | Name | Complexity over time | Examples |
|-------|------|---------------------|----------|
| I | Death | → 0 | Most rules |
| II | Freeze | → constant | Still lifes |
| III | Oscillate | periodic | Blinkers, oscillators |
| IV | Plateau | bounded aperiodic | Life from most seeds |
| V | Growth | unbounded | **None proven** |

**The open question:** Does Class V exist? If so, under what (substrate, rule) conditions?

**New question you raised:** Is there a Class between III and IV where complexity oscillates aperiodically? Rises and falls without strict period?

---

## Hierarchical Emergence: What Class V Really Means

Class V isn't just "more complexity" - it's **patterns made of patterns made of patterns**, indefinitely.

### Levels of Organization

| Level | What exists | Effective rules | Example (our universe) |
|-------|-------------|-----------------|------------------------|
| 0 | Substrate | Given | Quantum fields |
| 1 | Particles | Emerge from L0 | Quarks, electrons |
| 2 | Composites | Emerge from L1 | Protons, atoms |
| 3 | Structures | Emerge from L2 | Molecules, crystals |
| 4 | Machines | Emerge from L3 | Cells, enzymes |
| 5 | Agents | Emerge from L4 | Organisms |
| 6 | Societies | Emerge from L5 | Ecosystems, civilizations |
| 7+ | ??? | ??? | ??? |

Each level has its own "physics" - rules that describe patterns at that level without needing to track every detail below. Chemistry doesn't compute quarks. Biology doesn't track atoms. Economics doesn't model neurons.

### What This Means for CAs

In Conway's Life (B3/S23):

| Level | What exists | How it got there |
|-------|-------------|------------------|
| 0 | Cells (0/1) | Given |
| 1 | Still lifes, blinkers | Spontaneous |
| 2 | Gliders, spaceships | Spontaneous |
| 3 | Glider guns | **Engineered** |
| 4 | Logic gates, computers | **Engineered** |

Life reaches level 2 spontaneously. Levels 3-4 require human engineering - carefully designed initial conditions.

**Class V would mean:** A system that spontaneously climbs levels forever. No engineering required. Patterns self-organize into meta-patterns that self-organize into meta-meta-patterns...

### The Key Property: Emergent Effective Rules

At each level, new "rules" emerge that govern patterns at that level:

- Level 1 rules: How still lifes interact (mostly they don't)
- Level 2 rules: How gliders collide (they can make new patterns)
- Level 3 rules: How guns interact (can build logic)
- Level 4 rules: Boolean logic, computation

**True Class V requires:** Each level's rules are rich enough to support the *next* level's emergence. The hierarchy bootstraps itself.

### Why This Might Be Impossible

In finite deterministic systems:
- State space is finite
- Eventually you revisit states (pigeonhole)
- True unbounded growth seems ruled out

**But:** Maybe "levels" aren't about state count but about *description length*. A level-5 pattern might revisit the same cells as before, but the *structure* is new.

### Why This Might Be Possible

Our universe does it. Either:
1. Our universe is infinite (no pigeonhole constraint)
2. Our universe is non-deterministic (quantum randomness adds novelty)
3. There's something about our (substrate, rule) that enables it
4. We're wrong about it being unbounded (there's a ceiling we haven't hit)

Option 3 is what we're testing.

---

## The Measurements

Three quantities characterize dynamics:

### λ (Lambda) - Damage Spreading

How sensitive is the system to small changes?

- λ < 0: Ordered. Perturbations heal.
- λ ≈ 0: Critical. Edge of chaos.
- λ > 0: Chaotic. Perturbations explode.

### D (Dimension) - Structural Richness

How space-filling is the pattern?

- D ≈ 0: Empty
- D ≈ 1: Lines
- D ≈ 1.5: Fractal
- D ≈ 2: Solid/random

### γ (Gamma) - Complexity Growth Rate

Is novelty being created or destroyed?

- γ < 0: Simplifying
- γ ≈ 0: Stable
- γ > 0: Growing (sustained γ > 0 would be Class V)

These map each (substrate, rule) pair to a point in (λ, D, γ) space.

---

## The Core Hypothesis

**Complexity Scaling Hypothesis:**

> The complexity scaling class of a universe depends on the interaction between substrate and rule, not on either alone.
>
> Specifically: some rules that plateau (Class IV) on flat substrates may grow (Class V) on curved substrates, or vice versa.

This is testable. The flat survey gives us baseline. Curved surveys test the hypothesis.

---

## What Emerges vs What We Put In

A key question: what must be specified vs what can emerge?

| Must specify | Can emerge |
|--------------|------------|
| Substrate graph | Particles (stable patterns) |
| Transition rule | Conservation laws (from rule symmetries) |
| Initial state | Charges/colors (pattern properties) |
| | Interactions (collision behaviors) |
| | Hierarchies (patterns of patterns) |

**The promise of Class V:** If complexity truly scales unboundedly, then arbitrarily rich structures emerge from minimal specifications. Particles, chemistry, life, mind - all emergent.

**The reality so far:** All known systems plateau. Class V remains hypothetical.

---

## The Mandelbrot Analogy

You noticed patterns in rule-space. This is real.

**Mandelbrot set:** Parameter c → iterate z² + c → escape time
**Rule space:** Rule R → iterate CA → complexity class

Both have:
- Vast boring regions (quick death / quick escape)
- Interesting boundaries (edge of chaos / edge of set)
- Self-similar structure (similar rules → similar dynamics, mostly)
- Surprises (small parameter change → qualitative shift)

The (λ, D, γ) survey is mapping this structure for CA rule space.

---

## The Experiments

### Experiment 1: Flat Survey [IN PROGRESS]

Map all 262,144 Life-like rules on flat torus.

**Output:** Distribution of rules in (λ, D, γ) space. Where are the interesting ones?

### Experiment 2: Topology Comparison

Take top candidates from Exp 1. Test on:
- Sphere (12 pentagon defects)
- Hyperbolic disk (expanding space)
- Klein bottle (orientation-reversing)

**Question:** Do any rules change complexity class with topology change?

### Experiment 3: The Class V Search

Specifically hunt for sustained γ > 0:
- Very long runs (10⁶+ steps)
- Track γ over time, not just endpoint
- Test on substrates with different expansion properties (hyperbolic)

**Question:** Does Class V exist anywhere?

### Experiment 4: Oscillation Analysis

Look for rules where complexity rises and falls:
- Track γ over time
- Look for quasiperiodic patterns
- Is there structure between Class III and IV?

---

## Connections (Brief)

### To Physics

Our universe has:
- 3+1 dimensions
- Nearly flat topology (but with local curvature from mass)
- Local interactions (speed of light limit)

If the Complexity Scaling Hypothesis is right, these aren't arbitrary - they're selected for (or necessary for) the complexity scaling we observe.

### To Consciousness (QRI)

QRI asks similar questions about neural substrates:
- What topology enables binding?
- What dynamics enable experience?
- Is there a "complexity scaling" for consciousness?

The structural parallels are suggestive, not conclusive.

### To the Fermi Paradox

Your reframe: maybe the answer isn't about probability of life, but about **complexity ceilings**.

- Some universes: complexity dies (Class I) - no observers
- Some universes: complexity plateaus (Class IV) - observers exist but don't scale
- Our universe: complexity scales (Class IV? V?) - observers keep growing

The question becomes: what (substrate, rule) combinations have high ceilings? Or no ceiling?

---

## What We're Not Doing

To keep this tractable:

1. **Not simulating real physics** - toy universes only
2. **Not claiming CAs are conscious** - structural parallels only
3. **Not assuming Class V exists** - empirical question
4. **Not optimizing for any outcome** - mapping the space
5. **Not exploring all variables** - substrate + rule is enough for now

---

## Open Questions (Ranked by Tractability)

### Answerable Now

1. What's the distribution of Life-like rules in (λ, D, γ) space?
2. Do rules cluster by complexity class?
3. Does topology shift rules in (λ, D, γ) space?

### Answerable Soon

4. Do any rules change class with topology change?
5. Is there structure between Class III and IV?
6. What's the simplest substrate supporting Class IV?

### Hard / Long-term

7. Does Class V exist in any finite deterministic system?
8. Can complexity scaling be predicted analytically from (substrate, rule)?
9. What does this imply about our universe's "rule"?

---

## Next Steps

1. **Complete flat survey** - get the baseline data
2. **Visualize rule space** - find the structure you're intuiting
3. **Implement sphere CA** - first topology comparison
4. **Track γ over time** - not just endpoint, but trajectory
5. **Look for oscillation** - is there a Class III.5?

---

## The Big Picture

We're asking: **Why does complexity exist at all, and why does it scale the way it does?**

Toy universes let us vary parameters that are fixed in our universe. By mapping which (substrate, rule) combinations allow complexity to scale, we might understand why our universe does.

If we find Class V, that's huge - it means unbounded complexity is achievable in principle.

If we prove Class V is impossible, that's also huge - it means our universe has a ceiling, and we should look for it.

Either way, we learn something fundamental.

---

*End of v4.*

---

**Change log:**
- v3 → v4: Radically simplified. Reduced to two fundamental variables (substrate, rule). Removed sprawling domain connections. Centered the complexity scaling question. Added oscillation as open question. Mandelbrot analogy. Kept only tractable experiments.
