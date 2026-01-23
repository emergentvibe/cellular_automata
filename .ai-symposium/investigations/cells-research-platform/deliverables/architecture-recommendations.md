# Cells - Architecture Recommendations

**Based on:** Panel 01 Exploration (cells-research-platform investigation)
**Date:** 2026-01-23
**Experts Consulted:** Wolfram, Bateson, Victor, Kay, Hickey, Brooks, Rams

---

## Core Architectural Decisions

These five decisions form the foundation of the Cells research platform. Get these right, everything else is implementation detail.

---

## A1: Metrics as Versioned Data

### Decision
Treat metrics as first-class data entities with explicit versioning, not hardcoded logic.

### Schema
```javascript
// Metric definition (v0.2+)
{
  metricId: "glider-count",
  version: 1,  // glider-count-v1, glider-count-v2, etc
  name: "Glider Count",
  description: "Detects and counts 5-cell glider patterns in evolved grid",
  author: "yianni",
  created_at: "2026-02-15T...",

  cost: "expensive",  // cheap | moderate | expensive
  depends_on: ["period-v1"],  // run period detection first

  code: `
    function measure(rule, utils) {
      const grid = utils.simulate(rule, 1000, 256);
      const gliders = utils.detectPattern(grid, GLIDER_PATTERN);
      return {
        count: gliders.length,
        confidence: 0.95
      };
    }
  `,

  output_schema: {
    count: "number",
    confidence: "number"
  },

  tested: true  // passed 10-sample validation
}

// Rule object stores results keyed by metric ID + version
{
  ruleId: "B3/S23",
  // ... other fields
  metrics: {
    "glider-count-v1": {
      value: 2,
      confidence: 0.95,
      measured_at: "2026-02-20T..."
    },
    "glider-count-v2": {  // improved algorithm
      value: 3,  // found one more
      confidence: 0.98,
      measured_at: "2026-03-10T..."
    }
  }
}
```

### Rationale
- **Reproducibility:** Can compare results from different metric versions
- **Extensibility:** Adding new metrics doesn't require code changes, just data inserts
- **Attribution:** Track who defined which metrics
- **Evolution:** Metrics improve over time (v1 → v2 → v3) without invalidating old data

### Implementation Notes
- v0.1: Hardcoded metrics (lambda, gamma, dimension, period) stored as top-level fields for simplicity
- v0.2: Switch to metrics object for new metrics, keep old fields for backward compatibility
- Dependency graph: Use topological sort to ensure metrics run in correct order

### Source
Inspired by CAX library's modular architecture [S1]

---

## A2: Append-Only Database

### Decision
Never modify or delete existing records. Only add new attributes or new records.

### Examples

**Adding a field (v0.1 → v0.2):**
```javascript
// v0.1 rule
{
  ruleId: "B3/S23",
  lambda: 0.273,
  gamma: 0.145,
  // no metrics field yet
}

// v0.2 same rule (field added, old data unchanged)
{
  ruleId: "B3/S23",
  lambda: 0.273,  // unchanged
  gamma: 0.145,   // unchanged
  metrics: {      // NEW field
    "glider-count-v1": {value: 2, confidence: 0.95}
  }
}
```

**Adding topology data (v0.1 → v0.3):**
```javascript
// v0.1: All rules have topology='flat-torus'
{ruleId: "B3/S23", topology: "flat-torus", lambda: 0.273, ...}

// v0.3: Add NEW rules with different topology (old rules unchanged)
{ruleId: "B3/S23", topology: "sphere", lambda: 0.291, ...}  // different lambda!

// Now we have TWO rules: same birth/survival, different topology
```

**Updating analysis passes:**
```javascript
// v0.1: Rule measured in Pass 1 only
{ruleId: "B3/S23", passes: [1], lambda: 0.273, gamma: 0.145}

// v0.2: Same rule re-analyzed in Pass 2 (append to passes array)
{ruleId: "B3/S23", passes: [1, 2], lambda: 0.273, gamma: 0.145, metrics: {...}}
```

### Rationale
- **No migration needed:** Schema evolution is just adding fields
- **Data integrity:** Can't accidentally overwrite measurements
- **Research validity:** Can always trace back to original data
- **Rollback-friendly:** Bad metric? Just ignore that version, don't delete

### Implementation Notes
- Use Dexie.js `add()` for new records, never `put()` (which overwrites)
- For "updates," add timestamped fields: `updated_at`, `metrics_updated_at`
- For corrections, add versioned fields: `lambda-v2` if `lambda-v1` was wrong
- Delete is forbidden except for user-created content (collections, notes)

### Trade-offs
- Database size grows (but IndexedDB handles GB-scale fine)
- Queries need to filter for "latest version" (but this is explicit, which is good)

---

## A3: Sandboxed Metric Execution (v0.2+)

### Decision
User-contributed metrics run in isolated WebWorkers with strict constraints.

### Sandbox Constraints
```javascript
// WebWorker environment
{
  // ALLOWED:
  - Pure computation (loops, math, logic)
  - Standard utils API (simulate, detectPattern, analyzePeriod)
  - Read-only access to rule data

  // FORBIDDEN:
  - Network access (fetch, WebSocket)
  - DOM access (document, window)
  - Database access (IndexedDB, localStorage)
  - Infinite loops (30s timeout enforced)
  - Excessive memory (256MB limit)
}
```

### Standard Utils API
```javascript
// Provided to all user metrics
const utils = {
  // Simulate CA evolution
  simulate(rule, steps, gridSize) → Uint8Array,

  // Pattern detection
  detectPattern(grid, pattern) → [{x, y}, ...],

  // Period analysis
  analyzePeriod(grid, maxSteps) → number,

  // Neighborhood queries
  getNeighborhood(x, y, grid, topology) → number,

  // Grid utilities
  gridToString(grid) → string,  // for hashing
  countLiveCells(grid) → number
};
```

### Execution Flow
```javascript
// 1. User defines metric (UI form + code editor)
const metric = {
  metricId: "my-metric",
  code: `function measure(rule, utils) { ... }`
};

// 2. Test on 10 sample rules (validation)
const samples = getRandomRules(10);
for (const rule of samples) {
  const result = runInSandbox(metric.code, rule, utils);
  validateOutput(result, metric.output_schema);
}

// 3. Queue execution on full ruleset
const rulesToMeasure = getRules({passes: [1], gamma: {$gt: 0.1}});  // 5k rules
for (const rule of rulesToMeasure) {
  queueTask({
    metricId: metric.metricId,
    version: metric.version,
    ruleId: rule.ruleId,
    timeout: 30000  // 30s max
  });
}

// 4. Background worker processes queue
worker.onmessage = (result) => {
  if (result.success) {
    updateRule(result.ruleId, {
      [`metrics.${metric.metricId}-v${metric.version}`]: {
        value: result.value,
        measured_at: Date.now()
      },
      updated_at: Date.now()
    });
  } else {
    logError(result.error);
  }
};
```

### Security Measures
- **Time limit:** 30s per rule (prevents infinite loops)
- **Memory limit:** 256MB (prevents memory bombs)
- **No network:** WebWorker has no fetch API
- **No DOM:** No access to page content
- **Validation:** Output must match declared schema
- **Review queue:** Metrics can be flagged for manual review before running on full dataset

### Rationale
- **Power:** Users can define complex metrics (e.g., glider detection requires simulation + pattern matching)
- **Safety:** Sandbox prevents malicious code from stealing data or crashing browser
- **Performance:** WebWorkers don't block main thread

### Trade-offs
- Sophisticated users might hit time/memory limits (can expand limits in v0.3 if needed)
- Can't use external libraries (no npm imports) - must use provided utils
- Code review burden (if accepting community contributions to core)

### Source
Inspired by Observable's sandboxed notebooks, CodeSandbox's execution model

---

## A4: Topology as First-Class Attribute

### Decision
topology, tiling, neighborhood are rule attributes, not configuration.

### Schema
```javascript
{
  ruleId: "B3/S23",
  birth: [3],
  survival: [2, 3],

  // Universe structure (first-class attributes)
  topology: "flat-torus",    // flat-torus | sphere | klein | hyperbolic
  tiling: "square",          // square | hex | triangle
  neighborhood: "moore",     // moore | von-neumann | extended

  // ... metrics
}
```

### Queries
```javascript
// All rules on spherical topology
db.rules.where('topology').equals('sphere').toArray()

// Compare same rule across topologies
db.rules.where('birth').equals([3])
        .and(r => r.survival.equals([2,3]))
        .toArray()
// Returns multiple rules: one per topology surveyed

// Statistical analysis
const flatRules = await db.rules.where('topology').equals('flat-torus').toArray();
const sphereRules = await db.rules.where('topology').equals('sphere').toArray();
const avgGammaFlat = mean(flatRules.map(r => r.gamma));
const avgGammaSphere = mean(sphereRules.map(r => r.gamma));
// t-test: Does topology affect gamma?
```

### Rationale
- **Research validity:** Topology affects emergence [S3], must be explicit
- **Future-proof:** Can add new topologies without schema migration (just insert new rules)
- **Queryable:** Can filter/compare by topology
- **Honest:** Makes clear that all v0.1 data is single-topology (educational)

### Implementation Notes
- v0.1: All 22,590 rules have topology='flat-torus', tiling='square', neighborhood='moore'
- v0.2: Lab gains topology selector, users can queue surveys on other topologies
- v0.3: Survey 5k rules on 3 additional topologies (15k new rules)
- Rule uniqueness: (ruleId + topology) is the composite key

### v0.1 Display
Even though all v0.1 rules have same topology, **display it**:
```
Detail Page:
  Rule: B3/S23
  Topology: flat-torus
  Tiling: square
  Neighborhood: moore
```
This educates users that topology is variable, sets expectation for v0.3.

### Source
Validated by Warne (2013): topology fundamentally alters rule space distributions [S3]

---

## A5: Pass-Based Analysis Pipeline

### Decision
Structure analysis as multi-pass funnel: cheap metrics on all rules → expensive metrics on promising subset → deep study of best rules.

### Pass Schema
```javascript
{
  id: 1,
  pass_number: 1,
  description: "Initial survey - basic metrics",
  metrics_used: ["lambda-v1", "gamma-v1", "dimension-v1", "period-v1"],
  rules_analyzed: 22590,
  filter_criteria: null,  // no filter, all rules
  started_at: "2025-12-01T...",
  completed_at: "2026-01-15T..."
}

{
  id: 2,
  pass_number: 2,
  description: "Expensive metrics on promising rules",
  metrics_used: ["glider-count-v1", "hierarchy-score-v1", "complexity-v1"],
  rules_analyzed: 5234,
  filter_criteria: {gamma: {$gt: 0.1}, dimension: {$gt: 1.3}},
  started_at: "2026-02-20T...",
  completed_at: "2026-03-10T..."
}
```

### Rule Tracking
```javascript
{
  ruleId: "B3/S23",
  passes: [1, 2],  // analyzed in Pass 1 and Pass 2
  // ... metrics from both passes
}
```

### UI Affordances
```javascript
// Atlas filter
<select>
  <option>All rules (22,590)</option>
  <option>Pass 1 only (22,590)</option>
  <option>Pass 2 only (5,234)</option>
  <option>Pass 3 only (200)</option>
</select>

// Pass visualization page (funnel)
Pass 1: ████████████████████ 22,590 rules
           ↓ Filter: gamma > 0.1, dimension > 1.3
Pass 2:      ████████ 5,234 rules
                ↓ Filter: glider-count > 0, hierarchy-score > 0.5
Pass 3:        ██ 200 rules (gems)
```

### Workflow
1. **Pass 1 (v0.1):** Survey all 262k rules with cheap metrics (lambda, gamma, dimension, period)
2. **Pass 2 (v0.2):** Filter to promising ~5k rules, run expensive metrics (glider detection, hierarchy classification)
3. **Pass 3 (v0.3+):** Deep study of ~200 most interesting rules (manual annotation, external research, comparison across topologies)

### Rationale
- **Computational efficiency:** Don't run expensive metrics on all 262k rules (would take months)
- **Research validity:** Multi-pass is how real research works (coarse-graining) [S2]
- **User engagement:** Each pass reveals new patterns, keeps exploration fresh
- **Transparency:** Users see the funnel, understand why some rules have richer data

### Implementation Notes
- Rule.passes is an array: `[1, 2]` means analyzed in Pass 1 and 2
- Passes table tracks meta-info (when, which metrics, filter criteria)
- Atlas filter shows count: "Pass 2 only (5,234 rules)"
- Can run multiple Pass 2 analyses (different filter criteria) - that's fine, append to passes array

### Source
Inspired by Balduzzi (2011): emergence detection via coarse-graining [S2]

---

## Supporting Architectural Patterns

These patterns support the core decisions above.

---

## Data Query Patterns

### Efficient Queries (Dexie Best Practices)
```javascript
// GOOD: Use indexed fields
db.rules.where('gamma').above(0.5).toArray()
db.rules.where('topology').equals('sphere').toArray()

// BAD: Full table scan
db.rules.filter(r => r.gamma > 0.5).toArray()  // no index used

// GOOD: Compound index for common queries
db.version(1).stores({
  rules: 'ruleId, [topology+tiling], [passes+gamma]'
});
db.rules.where('[topology+tiling]').equals(['sphere', 'hex']).toArray()

// GOOD: Batch operations
const rules = [...]; // 1000 rules
await db.rules.bulkAdd(rules);  // fast

// BAD: Individual inserts
for (const rule of rules) {
  await db.rules.add(rule);  // 1000x slower
}
```

### Filtering Patterns
```javascript
// Range queries
db.rules.where('gamma').between(0.1, 0.5).toArray()

// Multiple conditions (chain)
db.rules.where('topology').equals('flat-torus')
        .and(r => r.gamma > 0.1)
        .and(r => r.passes.includes(2))
        .toArray()

// Export filtered subset
const filtered = await db.rules.where('gamma').above(0.5).toArray();
const csv = toCSV(filtered);
downloadFile('high-gamma-rules.csv', csv);
```

---

## Visualization Performance

### 2D Scatter (Atlas)
```javascript
// Spike in Sprint 2: Plotly.js vs Scatter-GL
const benchmarks = [
  {library: 'Plotly.js', points: 22590, renderTime: '?', interaction: '?', bundle: '~3MB'},
  {library: 'Scatter-GL', points: 22590, renderTime: '?', interaction: '?', bundle: '~200KB'}
];

// Choose based on:
// - Render time <2s
// - Interaction responsiveness <100ms
// - API ease (Plotly is more batteries-included)
// - Bundle size (Scatter-GL is lighter)

// Recommendation: Default to Plotly if performance acceptable (maturity advantage)
```

### Responsive Design
```javascript
// Adaptive point rendering
const pointCount = filteredRules.length;
const pointSize = pointCount < 1000 ? 8 :
                  pointCount < 10000 ? 4 :
                  2;  // smaller points for dense clusters

// Progressive loading
if (pointCount > 50000) {
  // Render 10k sample first, full dataset on user zoom/interaction
  renderSample(rules.slice(0, 10000));
  queueMicrotask(() => renderFull(rules));
}
```

---

## State Management

### URL as State
```javascript
// Atlas state in URL
/atlas?lambda=0.2-0.4&gamma=0.1-0.5&pass=2&topology=sphere

// Enables:
// - Shareable links
// - Browser back/forward
// - Bookmarking

// Detail state
/detail/B3/S23?topology=flat-torus&animate=true&speed=5
```

### Local State (Svelte Stores)
```javascript
// Global stores
import {writable} from 'svelte/store';

export const atlasFilters = writable({
  lambda: [0, 1],
  gamma: [0, 1],
  dimension: [1, 2],
  pass: 'all',
  topology: 'all'
});

export const surveyProgress = writable({
  current: 0,
  total: 0,
  rate: 0,
  eta: null
});

// Components subscribe
$: filteredRules = filterRules($atlasFilters);
```

---

## Testing Strategy

### Unit Tests
```javascript
// Data model
test('append-only: adding metric preserves old data', () => {
  const rule = {ruleId: 'B3/S23', lambda: 0.273};
  const updated = addMetric(rule, 'glider-count-v1', 2);
  expect(updated.lambda).toBe(0.273);  // unchanged
  expect(updated.metrics['glider-count-v1']).toBe(2);  // added
});

// Query API
test('topology filter returns only matching rules', async () => {
  await db.rules.bulkAdd([
    {ruleId: 'B3/S23', topology: 'flat-torus'},
    {ruleId: 'B3/S23', topology: 'sphere'}
  ]);
  const sphereRules = await db.rules.where('topology').equals('sphere').toArray();
  expect(sphereRules.length).toBe(1);
});
```

### Integration Tests
```javascript
// Survey flow
test('Lab: survey 100 rules, save to DB, appear in Atlas', async () => {
  const unsurveyed = getUnsurveyed(100);
  await runSurvey(unsurveyed);
  const dbCount = await db.rules.count();
  expect(dbCount).toBe(100);

  // Verify Atlas shows them
  const atlasRules = await getAtlasRules();
  expect(atlasRules.length).toBe(100);
});
```

### Performance Tests
```javascript
// Query benchmarks
test('Atlas query <100ms for 10k rules', async () => {
  await db.rules.bulkAdd(generate10kRules());
  const start = performance.now();
  const filtered = await db.rules.where('gamma').above(0.5).toArray();
  const elapsed = performance.now() - start;
  expect(elapsed).toBeLessThan(100);
});

// Render benchmarks
test('Atlas renders 22k points in <2s', async () => {
  const rules = await db.rules.toArray();
  const start = performance.now();
  renderAtlas(rules);
  const elapsed = performance.now() - start;
  expect(elapsed).toBeLessThan(2000);
});
```

---

## Migration Strategy (Future-Proofing)

### Schema Versioning
```javascript
// v0.1
db.version(1).stores({
  rules: 'ruleId, lambda, gamma',
  collections: '++id'
});

// v0.2 (add metrics table, no migration needed)
db.version(2).stores({
  rules: 'ruleId, lambda, gamma',  // unchanged
  collections: '++id',  // unchanged
  metrics: 'metricId',  // NEW
  passes: '++id'  // NEW
});

// v0.3 (add index, no data migration)
db.version(3).stores({
  rules: 'ruleId, lambda, gamma, [topology+tiling]',  // compound index added
  collections: '++id',
  metrics: 'metricId',
  passes: '++id'
});
```

### Data Backfill
```javascript
// If v0.2 needs to backfill v0.1 data
db.version(2).upgrade(async tx => {
  const rules = await tx.table('rules').toArray();
  for (const rule of rules) {
    if (!rule.passes) {
      rule.passes = [1];  // backfill: all v0.1 rules are Pass 1
      await tx.table('rules').put(rule);
    }
  }
});

// Better: avoid upgrades entirely via append-only design
// v0.2 code checks: if (!rule.passes) assume [1]
```

---

## Deployment Architecture

### Progressive Web App (PWA)
```javascript
// Service worker for offline capability
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('cells-v0.1').then((cache) => {
      return cache.addAll([
        '/',
        '/atlas',
        '/detail',
        '/lab',
        '/app.css',
        '/app.js'
      ]);
    })
  );
});

// IndexedDB persists across sessions (no server needed)
// Survey can run offline
```

### Static Hosting
```
cells.emergentvibe.com/
  ├── index.html (home)
  ├── atlas/
  ├── detail/
  ├── lab/
  ├── data/
  └── assets/
```

### CSV Export as Backup
```javascript
// Periodic export to CSV (backup)
async function backupData() {
  const rules = await db.rules.toArray();
  const csv = toCSV(rules);
  downloadFile(`cells-backup-${Date.now()}.csv`, csv);
}

// User can download any time
// Can re-import if IndexedDB corrupted
```

---

## Summary: Five Foundation Stones

1. **Metrics as Versioned Data** → Extensibility + reproducibility
2. **Append-Only Database** → Migration-free evolution
3. **Sandboxed Execution** → User code safety
4. **Topology as First-Class** → Research validity
5. **Pass-Based Pipeline** → Computational efficiency + transparency

Get these right in v0.1, everything else follows naturally.

---

**Status:** Ready for Sprint 1 implementation
**Next:** Begin schema design, write tests, migrate CSV data
