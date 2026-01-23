# Findings - Cells Research Platform Vision

**Investigation:** cells-research-platform
**Panel:** Exploration Panel (Panel 01)
**Date:** 2026-01-23

---

## Executive Summary

The panel **validated and refined** Yianni's expanded vision for Cells. The system is not just a CA browser - it's a **research platform for understanding how universe structure affects emergence**, achieved through systematic survey, extensible metrics, and multi-pass analysis.

**Key Decisions:**

1. **Mental Model:** "Research database of systematically surveyed cellular automata, with multi-pass extensible analysis, designed to understand how universe structure (topology, tiling, neighborhood) affects emergent complexity."

2. **Roadmap:** 10-sprint plan across 3 versions:
   - **v0.1 (4 sprints, 6-8w):** Survey Explorer - browse + contribute
   - **v0.2 (3 sprints, 4-6w):** Research Platform - extensible metrics
   - **v0.3 (3 sprints, 6-8w):** Topology Explorer - comparative analysis

3. **Topology Strategy:** Include topology/tiling/neighborhood fields in v0.1 schema (future-proof), but defer surveying other topologies to v0.3 (expensive compute).

4. **Extensibility:** Defer to v0.2 (validate core first), but design data model for it in v0.1 (append-only, versioned metrics).

5. **Home Page:** Four sections - Hero (animated rule), The Space (262k possibilities), The Method (systematic survey), The Vision (emergence research), The Invitation (explore/contribute CTAs).

6. **Dual Goals:** Support both "find cool CAs" (explorers) and "understand fundamentals" (scientists) through progressive disclosure and layered UI affordances.

**Timeline:** v0.1 ships in 6-8 weeks (unchanged). v0.2 adds extensibility (+4-6w). v0.3 adds topology comparison (+6-8w).

---

## Recommendations (8 Total)

### R1: Rewrite Home Page Pitch
**Target:** v0.1 Sprint 2

**Structure:**
1. **Hero:** Animated surprising rule (not Game of Life) - "Rule B368/S245 - one of 262,144 possibilities"
2. **The Space:** "Game of Life is one rule in 262k Life-like CA. Most never explored. Some produce gliders, oscillators, complexity."
3. **The Method:** "Systematic survey: measure lambda, gamma, dimension, period. 22,590 rules so far (8.6%). Each survey expands understanding."
4. **The Vision:** "Why do some rules produce gliders? How does topology affect emergence? By varying universe rules, we understand what makes complexity possible. Patterns on patterns on patterns."
5. **The Invitation:** "Explore Atlas | About the Research | Run Lab"

**Rationale:** Lead with wonder, explain method, reveal vision, invite participation. Keep jargon minimal (link to 'About the Research' for computational irreducibility, etc).

### R2: Revised 10-Sprint Roadmap
**Target:** Overall plan

| Version | Sprints | Duration | Focus | Key Deliverables |
|---------|---------|----------|-------|------------------|
| v0.1 | 1-4 | 6-8w | Survey Explorer | Data layer (schema with topology fields), Home+Atlas, Detail, Lab |
| v0.2 | 5-7 | 4-6w | Research Platform | Metrics SDK (sandboxed execution), Pass 2 analysis, Compare+Export |
| v0.3 | 8-10 | 6-8w | Topology Explorer | Survey other topologies, comparative analysis UI, statistical tests |

**Rationale:** Each version ships independently valuable product. v0.1 validates survey explorer. v0.2 adds extensibility. v0.3 enables fundamental research (topology effects).

### R3: Extensible Metrics Architecture
**Target:** v0.2 Sprint 5

**Design:**
- Metrics as versioned data objects (metricId, version, code, dependencies, output_schema)
- Sandboxed execution: WebWorker, 30s timeout, no network/DOM, read-only rule data
- Standard utils API: simulate(rule, steps, gridSize), detectPattern(grid, pattern), analyzePeriod(grid)
- User flow: Define → Test on 10 samples → Queue execution → Results append to rule.metrics[metricId-v]

**Rationale:** Code-as-data enables powerful user-defined metrics (glider detection, hierarchy classification) while sandboxing ensures security. Versioning enables reproducibility.

**Source:** Inspired by CAX library architecture [S1]

### R4: Final Data Schema (Append-Only)
**Target:** v0.1 Sprint 1

```javascript
// Rules table (v0.1)
{
  ruleId: "B3/S23",
  birth: [3], survival: [2,3],

  // Universe structure (v0.1: all same, v0.3: varies)
  topology: "flat-torus",
  tiling: "square",
  neighborhood: "moore",

  // Pass 1 metrics (v0.1: built-in)
  lambda: 0.273, gamma: 0.145, dimension: 1.42, period: 1,

  // Pass 2+ metrics (v0.2: extensible, versioned)
  metrics: {
    "glider-count-v1": {value: 2, confidence: 0.95, measured_at: "..."},
    "hierarchy-score-v1": {value: 0.82, confidence: 0.88, measured_at: "..."}
  },

  // Tracking
  passes: [1, 2],
  notes: "",
  measured_at: "...", updated_at: "..."
}

// Metrics table (v0.2)
{
  metricId: "glider-count", version: 1,
  name: "Glider Count", description: "...",
  author: "yianni", cost: "expensive",
  depends_on: ["period-v1"],
  code: "function measure(rule, utils) {...}",
  output_schema: {count: "number", confidence: "number"}
}

// Passes table
{
  id: 1, pass_number: 1,
  description: "Initial survey - basic metrics",
  metrics_used: ["lambda-v1", "gamma-v1", "dimension-v1", "period-v1"],
  rules_analyzed: 22590
}
```

**Rationale:** Append-only design enables migration-free evolution. Versioned metrics enable reproducibility. Topology fields future-proof schema.

### R5: Topology Implementation Strategy
**Target:** v0.1 (schema), v0.3 (survey)

**Phase 1 (v0.1):** Add topology/tiling/neighborhood fields. All 22,590 rules = flat-torus/square/moore.

**Phase 2 (v0.2):** Lab supports topology selection. Users can queue surveys on other topologies. Results stored as new rules.

**Phase 3 (v0.3):** Survey 5k-10k rules on 2-3 additional topologies (sphere, hex-tiling). Comparative analysis UI. Statistical tests.

**Rationale:** Topology is fundamental research dimension [S3], not just a feature. Include in schema NOW (cheap, future-proof). Defer expensive surveying to v0.3 (months of compute). Detail page can preview other topologies client-side in v0.2.

### R6: Dual-Goal Support via Layered UI
**Target:** v0.1-v0.3 design principle

**For Explorers (casual):**
- Home: beautiful animation, inspiring pitch
- Atlas: visual browse, color/size encoding
- Detail: watch animation
- No jargon, no statistics

**For Scientists (researchers):**
- Home: "About the Research" link
- Atlas: statistical filters (gamma > 0.5), export subset
- Detail: full metrics, notes, classification
- Data page: CSV export, API

**Rationale:** Don't force users to choose. Support both modes through progressive disclosure. Same data, different affordances.

### R7: Success Metrics by Version
**Target:** Post-ship validation

- **v0.1:** 100+ Atlas users, 10+ Lab contributors, 5+ feature requests
- **v0.2:** 10+ custom metrics, 3+ contributed to core, 50+ Pass 2 explorers
- **v0.3:** 5k+ non-flat-torus rules, 1+ external research paper, statistical significance on topology effects

**Rationale:** These validate each version's value proposition. v0.1 = exploration. v0.2 = extensibility. v0.3 = research.

### R8: What NOT to Build
**Target:** Ongoing

**Defer to v0.4+:**
- Real-time collaboration
- ML prediction of interesting rules
- 3D cellular automata (different rule space)
- Mobile app
- Social features (comments, ratings)

**Rationale:** These are orthogonal to core vision. Ship v0.1-v0.3 first, validate research platform concept, THEN consider expansions. Resist feature creep.

---

## Tensions (4 Total)

### T1: When to Ship Extensibility
**Positions:**
- Wolfram/Kay: Include in v0.1 (core to vision)
- Brooks/Rams: Defer to v0.2 (validate core first)

**Resolution:** Defer to v0.2, but acknowledge extensibility in v0.1 home page pitch ("research platform" language). Data model supports extensibility from v0.1 (versioned metrics structure).

**Implication:** v0.1 timeline stays at 6-8w. Risk: users might not return for v0.2 if v0.1 doesn't deliver extensibility promise.

### T2: How Much to Explain on Home Page
**Positions:**
- Wolfram: Explain computational irreducibility (epistemological foundation)
- Rams/Brooks: Keep simple, link to depth (avoid jargon)

**Resolution:** Simple home page (Hook → Space → Method → Vision → Invitation). Separate "About the Research" page for computational irreducibility, topology effects, hierarchical emergence.

**Implication:** Home page appeals to wider audience. Scientists click through for depth. Progressive disclosure.

### T3: Schema Flexibility vs Simplicity
**Positions:**
- Wolfram/Kay/Bateson: Include topology fields now (future-proof, fundamental)
- Brooks/Rams: YAGNI - add later when needed

**Resolution:** Include topology/tiling/neighborhood fields in v0.1 schema. All rules initially = flat-torus/square/moore. Cheap (just columns), future-proof (no migration for v0.3), honest (makes universe structure explicit).

**Implication:** v0.1 schema slightly more complex, but migration-free. v0.3 adds sphere/hex rules without schema changes.

### T4: Code Extensibility vs Security
**Positions:**
- Rams: Turing-complete code too dangerous (infinite loops, data theft)
- Victor/Hickey/Kay: WebWorker sandbox sufficient

**Resolution:** WebWorker sandbox with constraints (30s timeout, no network/DOM, read-only data). Provide standard utils API. Test on 10 samples before queuing. Monitor for abuse.

**Implication:** v0.2 users can write powerful metrics but can't harm system. Trade-off: sophisticated users might hit limits. Can expand in v0.3 if needed.

---

## Key Insights

### 1. Computational Irreducibility Validates Survey Approach
Wolfram's principle: "You cannot predict which rules will be interesting - you must run them." [S5, S6] This isn't pragmatic, it's epistemological. Survey-driven research is scientifically necessary, not just convenient.

### 2. Topology is Fundamental, Not a Feature
Warne (2013) showed topology changes rule space distributions [S3]. If Cells is about "understanding how universe structure affects emergence," topology MUST be first-class. Not a v0.5 feature - core research dimension.

### 3. Emergence Formalized as Multi-Level
Balduzzi (2011): "Emergence is better expressed at coarser granularity" [S2]. MIT (2025): Self-replicating structures across TWO levels [S4]. "Patterns on patterns on patterns" is real, formalized research area. Layered analysis aligns with literature.

### 4. Extensibility Through Composition
CAX library shows path: modular architecture, composable functions, hardware acceleration [S1]. Cells can achieve extensibility + performance if design is right: metrics-as-data, sandboxed execution, append-only results.

### 5. Append-Only Enables Evolution
Never modify existing records. Add new attributes via new fields or new records. This enables schema evolution without migration, metric improvements without invalidating old data, research reproducibility over time.

### 6. Progressive Disclosure Resolves Dual Goals
"Find cool CAs" and "understand fundamentals" aren't opposed - they're different modes of the same system. Explorers browse visually. Scientists filter statistically. Same data, different UI affordances. Don't force users to choose.

---

## Research Grounding

**Sources consulted:**
- [S1] CAX: Cellular Automata Accelerated in JAX (2024) - Extensible architecture
- [S2] Balduzzi (2011): Detecting emergent processes - Coarse-graining formalism
- [S3] Warne (2013): Topology effects on CA rule spaces - Empirical validation
- [S4] MIT (2025): Self-replicating hierarchical structures - Multi-level emergence
- [S5] Wolfram (2002): A New Kind of Science - Computational irreducibility
- [S6] Wolfram MathWorld: Computational Irreducibility - Principle formalization
- [S7] Hierarchical CA Methods (Springer) - Abstraction hierarchies
- [S8] Wolfram (2025): Game of Life engineering - Richness from irreducibility

**Key Validation:**
- Extensible metrics: CAX shows feasible [S1]
- Layered analysis: Formalized by Balduzzi [S2], evidenced by MIT [S4]
- Topology as fundamental: Validated by Warne [S3]
- Survey necessity: Computational irreducibility [S5, S6, S8]

---

## Next Steps

**Immediate (for Yianni):**

1. **Decide:** Technical panel (deep-dive on extensibility), Design panel (UI for layered analysis), or Synthesis (conclude and ship)?

**If proceeding with v0.1:**

1. **Sprint 1 (start immediately):**
   - Implement final schema (with topology fields)
   - Migrate 22,590 CSV records
   - Test query API

2. **Sprint 2:**
   - Draft home page (use R1 structure)
   - Build Atlas with pass filtering
   - Integrate home page

3. **Sprint 3:** Detail page
4. **Sprint 4:** Lab (resumable)
5. **Ship v0.1** - gather feedback

**If running another panel:**

Options:
- **[A] Technical Panel:** Deep-dive on extensible metrics (sandboxing security, API design, performance benchmarks, dependency graphs)
- **[B] Design Panel:** UI/UX for layered analysis (how to visualize passes, metric selection, visual encoding, comparison views)
- **[S] Synthesis:** Conclude investigation, deliver final home page pitch + detailed sprint backlog + architecture docs

---

**Investigation Status:** Panel 1 complete. Ready for decision on next panel or proceed to implementation.
