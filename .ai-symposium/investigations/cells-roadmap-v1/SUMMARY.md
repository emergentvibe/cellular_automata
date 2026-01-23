# Cells Roadmap - Architecture Panel Summary

**Investigation:** cells-roadmap-v1
**Panel Type:** Architecture
**Status:** Complete
**Date:** 2026-01-23

---

## TL;DR

**v0.1 in 4 sprints (6-8 weeks):**
1. Data layer (IndexedDB + migration)
2. Atlas 2D + Home page
3. Detail page
4. Resumable Lab

**Ship when these 4 user flows work:** Understand research → Explore rules → Deep-dive rule → Resume survey

**Everything else is v0.2:** Collections, Compare, 3D, advanced hierarchy detection, topology support.

---

## Critical Decisions

| Question | Answer | Rationale |
|----------|--------|-----------|
| Sprint order? | Data → Atlas+Home → Detail → Lab | Each sprint = independent user value |
| Schema? | Two stores: `rules` (ruleId PK) + `collections` | Simple, query-efficient, extensible |
| 2D or 3D? | 2D (lambda vs D, colored by gamma) | Start simple, defer 3D to v0.2 |
| Interest score? | Defer to v0.2 | Visual exploration sufficient for v0.1 |
| Hierarchy detection? | Period + free-text notes | Manual MVP, algorithmic later |
| Handle 8.6% data? | Show coverage prominently | Transparency prevents misleading |
| Simplest v0.1? | 4 pages: Home, Atlas, Detail, Lab | Stop after Sprint 4, ship |

---

## IndexedDB Schema (Copy-Paste Ready)

```javascript
const db = new Dexie('CellsDB');
db.version(1).stores({
  rules: 'ruleId, lambda, dimension, gamma, classification',
  collections: '++id, name'
});

// Rule object:
{
  ruleId: "B3/S23",           // Primary key (string)
  birth: [3],                  // Array
  survival: [2, 3],            // Array
  lambda: 0.52,                // Indexed float
  dimension: 1.68,             // Indexed float
  gamma: -0.03,                // Indexed float
  period: 2,                   // Integer
  classification: "Class IV",  // Indexed string
  measured_at: "2026-01-23...", // ISO timestamp
  notes: ""                    // Free-text user annotation
}

// Collection object:
{
  id: 1,                       // Auto-increment
  name: "Promising Class IV",  // String
  ruleIds: ["B3/S23", ...],   // Array of strings
  created_at: "2026-01-23..."  // ISO timestamp
}
```

---

## Sprint Breakdown

### Sprint 1: Data Foundation (1-2 weeks)
- [ ] Design schema (see above)
- [ ] Write CSV migration script (Papa Parse → bulkAdd in batches of 1000)
- [ ] Migrate 22,590 existing records
- [ ] Build query API (getById, range queries, filters)
- [ ] Unit tests for queries
- [ ] Verify: B3/S23 exists with correct metrics

**Parallel:** Draft Home page (markdown explaining research)

### Sprint 2: Exploration UI (2 weeks)
- [ ] Spike: Plotly.js vs Scatter-GL (benchmark 262k points)
- [ ] Choose library based on performance
- [ ] Build Atlas: 2D scatter (lambda x-axis, dimension y-axis, colored by gamma, sized by period)
- [ ] Add interaction: hover tooltips (rule notation + metrics), click → Detail
- [ ] Add filters: range sliders for lambda, D, gamma
- [ ] Integrate Home page
- [ ] Display coverage: "22,590 / 262,144 rules surveyed (8.6%)"

### Sprint 3: Deep Dive (1-2 weeks)
- [ ] Build Detail page route (e.g., `/rule/B3-S23`)
- [ ] Animated simulation (reuse stepper.js)
- [ ] Metrics display table
- [ ] Rule notation display (B/S format)
- [ ] Editable notes field (save to IndexedDB)
- [ ] Navigation: back to Atlas, prev/next rule

### Sprint 4: Survey Growth (1-2 weeks)
- [ ] Make Lab resumable (read which rules done from IndexedDB)
- [ ] Progress tracking: "X / 262,144 rules surveyed (Y%)"
- [ ] Survey runner writes directly to IndexedDB (skip CSV)
- [ ] (Optional) Add to queue from Atlas (click unsurveyed region)

**SHIP v0.1**

---

## Atlas Design Spec

**Chart type:** 2D scatter plot (WebGL-accelerated)

**Axes:**
- X: lambda (damage spreading), range typically [-1, 1]
- Y: dimension (fractal dimension), range [0, 2]

**Color:** gamma (complexity growth)
- Diverging colormap: blue (negative) ← white (zero) → red (positive)
- Recommend: ColorBrewer RdBu or similar

**Size:** period (detected period)
- Larger points = longer periods
- Range typically [0, 50+]

**Interaction:**
- Hover: Tooltip showing `{ruleId} | λ={lambda} D={dimension} γ={gamma}`
- Click: Navigate to Detail page (`/rule/{ruleId}`)

**Filters (range sliders):**
- Lambda: [-1, 1]
- Dimension: [0, 2]
- Gamma: [-1, 1]

**UI Elements:**
- Coverage display: "22,590 / 262,144 rules surveyed (8.6%)"
- Tooltip/info icon: "This is a sparse sample. Clusters are suggestive, not definitive."

---

## Deferred to v0.2+

| Feature | Why Deferred | When to Revisit |
|---------|--------------|-----------------|
| Collections | Not critical for exploration | After users request "save favorites" |
| Compare | Requires Collections first | v0.2 if users have multiple collections |
| 3D Atlas | 2D sufficient with color | v0.2 if users request or 2D proves limiting |
| Interest scoring | Premature quantification | v0.2 after users reveal what "interesting" means |
| Algorithmic hierarchy | Manual annotation faster | Sprint 5+ after manual annotations show patterns |
| Topology support | Requires substrate generalization | Sprint 8-10 per original plan |

---

## Preserved Tensions (Both Positions Valid)

**T1: Minimalism vs Completeness**
- Rams: Ship 3 pages, no Home (tools speak for themselves)
- Brooks: Ship 4 pages with Home (context is essential)
- **Decision:** Include Home, but lightweight

**T2: 2D vs 3D Visualization**
- Tufte: 2D always better (no distortion), use color
- Victor: 3D interactive reveals structure in full space
- **Decision:** Start 2D, revisit 3D in v0.2 based on user feedback

**T3: Schema Flexibility**
- Liskov: Design for topology support now
- Brooks: Design for current needs only (YAGNI)
- **Decision:** Simple schema with documented extension path

**T4: Hierarchy Detection**
- Wolfram: Algorithmic required for research validity
- Tufte: Manual faster and honest
- **Decision:** Start manual, add algorithmic in Sprint 5+

---

## Key Principles

1. **Conceptual Integrity:** Cells is one thing - a database of measured rules with multiple views
2. **Each Sprint Delivers Value:** Not components, but complete user flows
3. **Empirical Over Aesthetic:** Benchmark, measure, decide (don't argue taste)
4. **Simple with Extension Path:** Don't over-engineer, but document how to extend
5. **Transparency:** Show coverage, communicate incompleteness honestly

---

## Files Generated

Investigation workspace: `.ai-symposium/investigations/cells-roadmap-v1/`

- `panels/panel-01-architecture.md` - Full 24-hour deliberation transcript
- `findings.md` - Executive summary + all recommendations
- `research/sources.json` - 8 sources (Golly, Dexie, Plotly, Scatter-GL, etc.)
- `research/research-log.md` - Search queries + findings
- `artifacts/recommendations.json` - 10 recommendations (R1-R10)
- `artifacts/tensions.json` - 4 tensions (T1-T4)
- `artifacts/expert-registry.json` - Expert contributions
- `state.json` - Investigation state
- `thinking/expert-selection-panel-01.md` - Why these experts
- `thinking/planning.md` - Investigation strategy

---

## Quick Start

1. Read full transcript: `panels/panel-01-architecture.md`
2. See all recommendations: `artifacts/recommendations.json`
3. Copy schema: See "IndexedDB Schema" section above
4. Start Sprint 1: See "Sprint Breakdown" section above

---

**Investigation complete. All questions answered. Ready to implement.**
