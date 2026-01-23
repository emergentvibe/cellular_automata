# Findings - Cells Roadmap Architecture

**Investigation:** cells-roadmap-v1
**Panel:** Architecture Panel (Panel 01)
**Date:** 2026-01-23

---

## Executive Summary

The panel converged on a **four-sprint v0.1 plan** delivering four core user flows: (1) understand the research (Home), (2) explore surveyed rules (Atlas), (3) deep-dive individual rules (Detail), (4) resume survey (Lab). Everything else (Collections, Compare, 3D visualization, topology) deferred to v0.2.

**Key decisions:**
- Simple two-store IndexedDB schema (rules, collections) with additive extension path
- 2D Atlas (lambda vs dimension, colored by gamma) using Plotly.js or Scatter-GL (spike both)
- Hierarchy detection MVP = period + free-text notes (algorithmic detection deferred)
- No interest scoring in v0.1 (visual exploration + filters sufficient)
- Home page included in Sprint 2 for accessibility (despite minimalist objections)

**Timeline:** 6-8 weeks to v0.1 shipment.

---

## Recommendations (10 Total)

### R1: Four-Sprint v0.1 Plan
**Sprint 1 (1-2w):** Data layer (IndexedDB schema, migration, query API)
**Sprint 2 (2w):** Atlas 2D scatter + Home page
**Sprint 3 (1-2w):** Detail page (animation + metrics + notes)
**Sprint 4 (1-2w):** Lab resumable survey + progress tracking

**Stop and ship after Sprint 4.** Collections, Compare, 3D, hierarchy, topology are v0.2+.

### R2: IndexedDB Schema
```javascript
db.version(1).stores({
  rules: 'ruleId, lambda, dimension, gamma, classification',
  collections: '++id, name'
});
```

**Rule fields:** ruleId (PK), birth[], survival[], lambda, dimension, gamma, period, classification, measured_at, notes

**Extension path:** Add `topology: "flat-torus"` field in Sprint 8 (additive, no migration).

### R3: 2D Atlas First
- X-axis: lambda, Y-axis: dimension, Color: gamma (diverging colormap), Size: period
- Interactive: hover tooltips, click to Detail
- Defer 3D to v0.2+ (revisit based on user feedback)

### R4: Defer Interest Scoring
- No single score in v0.1
- Users explore visually with range filters (lambda, D, gamma sliders)
- Manual Collections for favorites
- v0.2: Consider user-adjustable scoring formula

### R5: Hierarchy MVP = Period + Notes
- Display detected period (already measured)
- Free-text notes field for manual annotation
- Sprint 5+: Algorithmic still life, oscillator, spaceship detection

### R6: Visualization Library Spike
- Benchmark Plotly.js (scattergl) vs Scatter-GL with 262k points
- Test: render time, interaction responsiveness, API ease, bundle size
- Default to Plotly if performance comparable (maturity advantage)

### R7: Communicate Incomplete Data
- Display "22,590 / 262,144 rules surveyed (8.6%)" prominently
- Tooltip: "Sparse sample. Clusters suggestive, not definitive."
- Sprint 4: Add ghost points for unsurveyed rules (greyed, clickable to queue)

### R8: Reordered Sprint Plan
**Original:** IndexedDB → Atlas → Home+Detail → Lab → Hierarchy → Collections → Polish → Topology

**Revised:** Data → Atlas+Home → Detail → Lab → Hierarchy+Collections → 3D+Polish → Topology

**Key changes:**
- Home moved to Sprint 2 (context first)
- Lab moved to Sprint 4 (after Atlas motivates contribution)
- 3D deferred to Sprint 6+ (start 2D)

### R9: v0.1 = Four User Flows
1. Read about research (Home)
2. Explore 22k+ rules visually (Atlas)
3. Deep-dive any rule (Detail)
4. Resume survey to grow dataset (Lab)

**Excluded:** Collections, Compare, advanced hierarchy detection, 3D, topology.

### R10: CSV Migration Strategy
- One-time migration script: parse CSV → batch insert (1000 at a time via bulkAdd)
- Verify count + spot-check (B3/S23 should exist with correct metrics)
- Post-migration: IndexedDB is source of truth (survey writes directly)
- Keep CSV export as backup option

---

## Tensions Preserved

### T1: Minimalism vs Completeness
- **Rams:** Ship 3 pages (Atlas, Detail, Lab), no Home
- **Brooks/Victor:** Ship 4 pages, include Home for context
- **Resolution:** Include Home, but lightweight (markdown only)

### T2: 2D vs 3D Visualization
- **Tufte:** 2D always better (no perspective distortion), use color for 3rd dimension
- **Victor:** 3D interactive has value for embodied exploration
- **Resolution:** Start 2D, defer 3D to v0.2, revisit based on user feedback

### T3: Schema Flexibility vs Simplicity
- **Liskov/Hickey:** Design for topology support now (future-proof)
- **Brooks/Rams:** Design for current needs only (YAGNI)
- **Resolution:** Simple schema with documented extension path (add topology field later)

### T4: Algorithmic vs Manual Hierarchy Detection
- **Wolfram:** Algorithmic detection required for research validity
- **Tufte/Rams:** Manual annotation faster and more honest
- **Resolution:** Start manual (notes field), add algorithmic in Sprint 5+

---

## Key Insights

1. **Conceptual Integrity:** The system is *one thing* - a database of measured rules with multiple views (Atlas, Detail, Lab). This clarity drives all design decisions.

2. **Progressive Disclosure:** User journey is context → explore → deep-dive → contribute. Sprint order mirrors this journey.

3. **Empirical Over Aesthetic:** Visualization library choice, 2D vs 3D, interest scoring - all resolved by "try it, measure it, decide." No armchair theorizing.

4. **Simplicity with Extension Path:** Don't over-engineer for hypothetical futures, but document how to extend when needed. "Additive, not breaking."

5. **Transparency About Incompleteness:** 8.6% survey coverage is valid for pattern detection if labeled honestly. Show coverage prominently.

6. **Manual Before Algorithmic:** Let usage reveal what matters before automating it. Hierarchy detection starts manual (notes field), structures later based on actual annotations.

---

## Research Grounded

**Sources consulted:**
- [S1] Golly v5.0: Reference CA explorer (hashlife, topology support)
- [S2] MCell: Web-based CA explorer (gallery-focused)
- [S3] Dexie.js Best Practices: Bulk operations, batch 1000, avoid offset()
- [S4] Dexie Performance Issues: Don't store table refs in objects (10-100x slowdown)
- [S5] Plotly.js: Mature, ~1M points, large bundle
- [S6] Scatter-GL: Google's embedding projector, purpose-built
- [S7] Regl-Scatterplot: Lower-level, performance-focused
- [S8] Deck.gl: 1M+ points @ 60 FPS, heavyweight

**Key findings:**
- IndexedDB with Dexie can handle 262k records efficiently if queried correctly (range queries on indexed fields, batch operations, avoid full scans)
- Both Plotly and Scatter-GL are viable for 262k points; empirical benchmark needed
- Existing CA explorers (Golly, MCell) are either power-user focused (everything exposed) or casual (preset gallery). Cells is survey-focused, a third niche.

---

## Next Steps

**For Yianni:**
1. **Sprint 1 (Start immediately):** Design IndexedDB schema, write migration script, migrate 22,590 CSV records
2. **Parallel task:** Draft Home page (markdown explaining research question)
3. **Sprint 2:** Spike Plotly vs Scatter-GL, build Atlas, integrate Home
4. **Sprint 3:** Build Detail page
5. **Sprint 4:** Make Lab resumable
6. **Ship v0.1** - gather user feedback
7. **Plan v0.2** based on feedback (Collections? 3D? Advanced hierarchy detection?)

**Investigation complete.** All seven original questions answered with concrete, actionable recommendations.
