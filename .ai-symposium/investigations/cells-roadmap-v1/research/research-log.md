# Research Log - Cells Roadmap Investigation

## 2026-01-23: Pre-Panel Research

### Query 1: CA Exploration Tools
**Goal:** Understand existing CA explorer UX patterns and capabilities

**Key Findings:**
- Golly (v5.0, 2025) is the gold standard: supports hashlife (130B cell-gen/sec), multiple topologies, scriptable
- MCell (Mirek's) is web-based, gallery-focused
- Golly's approach: power-user focused, everything exposed
- MCell's approach: preset rules, visual gallery

**Implications for Cells:**
- We're somewhere between: survey-focused (like neither), but need exploration UX
- Golly users will expect topology support, scriptability (future)
- Web users expect instant gratification (MCell model)

### Query 2: IndexedDB Performance
**Goal:** Understand schema design for 262k records

**Key Findings:**
- Use bulk operations (bulkAdd, bulkPut) with batches of ~1000 items [S3]
- Avoid offset() for pagination - proportional to N [S3]
- 50k records can cause multi-second freezes on toArray() [S4]
- Critical gotcha: Don't store table references in objects (10-100x slowdown) [S4]
- Indexes are crucial for query performance but add maintenance overhead [S3]

**Implications for Cells:**
- Schema must support efficient queries: by rule ID, by metric ranges, by classification
- Need cursor-based pagination, not offset
- Lazy loading is mandatory, can't load all 262k at once
- Index on: ruleId (primary), lambda (range), dimension (range), gamma (range), classification

### Query 3: Dexie.js Best Practices
**Goal:** Validate Dexie as choice, understand optimization patterns

**Key Findings:**
- Dexie is performance-focused, doesn't expose operations that iterate entire tables [S3]
- Use transactions for multiple operations [S3]
- Collection.filter().toArray() faster than toArray() + JS filter [S4]
- Running two selectors on same table simultaneously causes huge freeze [S4]

**Implications for Cells:**
- Dexie is right choice vs raw IndexedDB
- Must design queries to avoid full scans
- One query at a time in UI (don't fire multiple filters simultaneously)

### Query 4: 3D Scatter Visualization
**Goal:** Choose visualization library for Atlas

**Key Findings:**
- **Plotly.js** [S5]: High-level, declarative, scattergl handles ~1M points, mature
- **Scatter-GL** [S6]: Google's solution for TensorFlow Projector embeddings, 10k-100k points
- **Regl-Scatterplot** [S7]: Lower-level, very performant
- **Deck.gl** [S8]: 1M+ points @ 60 FPS, but heavier weight

**Comparison:**
| Library | Points | API Level | Bundle Size | Use Case |
|---------|--------|-----------|-------------|----------|
| Plotly.js | ~1M | High | Large | Mature, declarative |
| Scatter-GL | 10-100k | Medium | Medium | Similar to our use case |
| Regl-Scatterplot | High | Low | Small | Max performance |
| Deck.gl | 1M+ | Medium | Large | Overkill for single viz |

**Recommendation Forming:**
- 262k points is right at the edge
- Plotly.js: easiest, mature, handles scale, but large bundle
- Scatter-GL: perfect use-case match (embedding projector ≈ rule space explorer)
- Regl-Scatterplot: if performance becomes issue

**Initial lean:** Start with Plotly.js (fastest to prototype), switch to Scatter-GL if needed

---

## Research Gaps Identified

1. **Hierarchy detection algorithms:** No search performed yet. Need to research:
   - Still life detection (equilibrium patterns)
   - Oscillator detection (period finding)
   - Spaceship detection (translational periodicity)

2. **Interest scoring:** No precedent found. May need to invent.

3. **Topology implementation:** Didn't research sphere/torus CA implementation. Defer to later sprint.
