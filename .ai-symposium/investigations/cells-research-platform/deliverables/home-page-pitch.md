# Cells - Home Page Content

**Version:** v0.1 (based on Panel 01 recommendations)
**Last Updated:** 2026-01-23

---

## HERO SECTION

**Visual:** Full-width animated canvas showing Rule B368/S245 (HighLife) evolving from random seed
- Animation loops every 30 seconds
- Subtle controls: pause, restart, change seed
- Clean, minimal aesthetic (not garish or cyberpunk)

**Caption (overlaid on animation):**
```
Rule B368/S245 (HighLife)
One of 262,144 Life-like cellular automata
```

**Subheading:**
```
Most of this space has never been systematically explored.
We're mapping it.
```

---

## SECTION 1: THE SPACE

### Heading: "Mapping the Life-Like Universe"

The Game of Life is famous, but it's just one rule in a vast space of possibilities.

Life-like cellular automata follow the same grid-based structure: cells live or die based on how many neighbors they have. But vary the birth and survival conditions, and you get entirely different universes.

With 9 possible neighbor counts (0-8), there are 2^18 = **262,144 distinct rules**. Some produce stable patterns that freeze. Others oscillate endlessly. Some grow chaotic and noisy. And a rare few generate gliders, spaceships, and complex emergent structures.

Which ones? We can't predict. We have to run them and find out.

---

## SECTION 2: THE METHOD

### Heading: "Systematic Survey"

We're systematically surveying this rule space, running each rule for 1000 steps from random initial conditions and measuring:

- **Lambda (λ)** - Expected cell density
- **Gamma (γ)** - Activity rate (how much changes each step)
- **Dimension (D)** - How boundaries scale (complexity measure)
- **Period** - Cycle length (stability vs chaos)

**So far: 22,590 rules surveyed (8.6% coverage)**

Each measurement helps us understand which regions of rule space produce complexity, and which collapse into order or chaos.

---

## SECTION 3: THE VISION

### Heading: "Understanding Emergence"

Our goal isn't just to find beautiful patterns (though we've found many). It's to understand **why** certain rules produce complexity while others don't.

**Questions we're exploring:**

- Why do some rules generate gliders while others never do?
- How does the topology of space (flat, toroidal, spherical) affect emergence?
- What about hexagonal tiling vs square grids?
- Can we detect hierarchical patterns—patterns made of patterns made of patterns?

By systematically varying the fundamental rules of the universe—birth/survival conditions, topology, grid tiling—we can understand how these design choices affect what kinds of complexity can exist.

**Patterns on patterns on patterns.**

---

## SECTION 4: THE INVITATION

### Heading: "Explore, Discover, Contribute"

**Three ways to engage:**

1. **Explore the Atlas** - Browse 22,590+ surveyed rules as an interactive 2D scatter plot. Click any rule to see it evolve.

2. **Deep-dive any rule** - Watch animations, see measured metrics, add your own notes. Discover what makes each rule unique.

3. **Expand the survey** - Run the Lab on your device to measure more rules. Every contribution grows our understanding.

**Call-to-action buttons:**
```
[Explore Atlas]  [About the Research]  [Run Lab]
```

---

## FOOTER LINKS

- About the Research (separate page explaining computational irreducibility, topology effects, hierarchical emergence)
- Data & Methods (technical details, CSV export, API docs)
- Source Code (GitHub link)
- Contact

---

## ABOUT THE RESEARCH (Separate Page)

**Title:** "Why We Survey"

### Computational Irreducibility

In 2002, Stephen Wolfram formalized a principle called **computational irreducibility**: for many computational systems, the only way to determine what they'll do is to run them. There are no shortcuts.

This applies to cellular automata. Just because a rule is simple (e.g., "birth on 3 neighbors, survival on 2-3") doesn't mean its behavior is simple. Game of Life proves this—a trivial rule specification produces Turing-complete complexity.

So we can't predict which of the 262,144 Life-like rules will be interesting. We have to measure them.

### Why Topology Matters

The "universe" a cellular automaton lives in isn't just its rules—it's also the shape of space itself.

- **Flat grid:** Cells at edges have fewer neighbors (boundary effects)
- **Toroidal (wrap-around):** Left edge connects to right, top to bottom (no boundaries)
- **Spherical:** Like a globe, cells at poles have different neighbor counts
- **Hyperbolic:** Negative curvature, more neighbors than Euclidean space

Research shows that the same rule on different topologies can behave completely differently. If we want to understand emergence, topology isn't optional—it's fundamental.

### Hierarchical Emergence

Some cellular automata produce "patterns made of patterns."

- **Level 0:** Individual cells
- **Level 1:** Stable structures (still lifes, oscillators, gliders)
- **Level 2:** Structures that generate other structures (glider guns, breeders)
- **Level 3:** Patterns of pattern-generators

This hierarchy is what makes certain rule spaces "rich" for engineering and discovery. Understanding how universe structure (rules, topology, tiling) affects this hierarchy is our core research question.

### Multi-Pass Analysis

As we learn more about the rule space, we ask deeper questions:

- **Pass 1 (initial survey):** Measure basic metrics (lambda, gamma, dimension, period) on all rules
- **Pass 2 (deeper analysis):** Run expensive computations (glider detection, hierarchy classification) on promising subsets
- **Pass 3 (curated study):** Deep investigation of the most interesting rules

Each pass narrows focus and increases depth. The Atlas lets you explore rules from any pass.

---

## DESIGN NOTES

**Visual Style:**
- Lived-in futurism (not sterile Apple minimalism, not cyberpunk dystopia)
- Calm technology (ambient, deferential, shows use)
- High contrast for readability, but warm not cold
- Animations are smooth, not janky
- "Weathered" not "factory fresh"

**Tone:**
- Direct, warm, intellectually honest
- No hype, no overselling
- Explain complexity without condescension
- Invite participation without pressure

**Accessibility:**
- Animations can be paused (motion sensitivity)
- High contrast text
- Keyboard navigable
- Alt text for all visuals
- No auto-play audio

---

**Status:** Ready for implementation in v0.1 Sprint 2
