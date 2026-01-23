# Cells - Revised Sprint Backlog

**Based on:** Panel 01 Exploration (cells-research-platform investigation)
**Date:** 2026-01-23
**Versions:** v0.1 (4 sprints), v0.2 (3 sprints), v0.3 (3 sprints)

---

## VERSION 0.1: SURVEY EXPLORER (Ship: 6-8 weeks)

**Goal:** Deliver a usable survey explorer that lets users browse 22k+ rules, deep-dive any rule, and contribute more measurements via the Lab.

**Success Criteria:**
- 100+ users explore Atlas
- 10+ users contribute via Lab
- 5+ feature requests received

---

### SPRINT 1: Data Layer (1-2 weeks)

**Goal:** Establish the data foundation with future-proof schema

**Tasks:**

1. **Design IndexedDB Schema**
   ```javascript
   db.version(1).stores({
     rules: 'ruleId, lambda, gamma, dimension, topology, tiling, neighborhood, [passes+ruleId]',
     collections: '++id, name',
     metrics: 'metricId',
     passes: '++id, pass_number'
   });
   ```

2. **Implement Query API**
   - `getRules(filter)` - supports topology, pass, metric range filters
   - `getRule(ruleId)` - single rule lookup
   - `addRule(ruleData)` - insert with validation
   - `updateRule(ruleId, updates)` - append-only updates

3. **CSV Migration Script**
   - Parse existing 22,590 CSV records
   - Transform to new schema format
   - Set topology='flat-torus', tiling='square', neighborhood='moore' for all
   - Set passes=[1] for all
   - Batch insert (1000 at a time via bulkAdd)
   - Verify count + spot-check (B3/S23 should exist)

4. **Create Initial Pass Record**
   ```javascript
   {
     id: 1,
     pass_number: 1,
     description: "Initial survey - basic metrics (lambda, gamma, dimension, period)",
     metrics_used: ["lambda-v1", "gamma-v1", "dimension-v1", "period-v1"],
     rules_analyzed: 22590,
     started_at: "2025-12-01T...",
     completed_at: "2026-01-15T..."
   }
   ```

**Deliverables:**
- IndexedDB schema implemented
- Query API tested
- 22,590 rules migrated
- CSV export still works (backup)

**Success Metrics:**
- All 22,590 rules queryable
- Query performance: <100ms for 10k rule subsets
- B3/S23 spot-check passes (correct metrics)

---

### SPRINT 2: Home + Atlas (2 weeks)

**Goal:** Create compelling home page that explains vision + interactive Atlas for exploration

**Tasks:**

1. **Home Page Implementation**
   - Hero section: Animated HighLife (B368/S245) canvas
   - Section 1: "The Space" (262k rules explanation)
   - Section 2: "The Method" (survey metrics)
   - Section 3: "The Vision" (emergence research)
   - Section 4: "The Invitation" (CTAs: Explore Atlas, About Research, Run Lab)
   - Footer links

2. **About the Research Page**
   - Computational irreducibility explanation
   - Topology effects
   - Hierarchical emergence
   - Multi-pass analysis

3. **Atlas 2D Scatter Plot**
   - Spike: Benchmark Plotly.js vs Scatter-GL with 22,590 points
   - Choose based on: render time, interaction responsiveness, API ease, bundle size
   - X-axis: lambda, Y-axis: dimension
   - Color: gamma (diverging colormap: blue=low, red=high)
   - Size: period (larger = longer period)
   - Hover: tooltip with ruleId + basic metrics
   - Click: navigate to Detail page

4. **Atlas Filters (v0.1 MVP)**
   - Range sliders: lambda, gamma, dimension
   - Pass selector: "Pass 1" (only option in v0.1, but UI ready for future)
   - "Reset filters" button
   - Count display: "Showing 5,234 / 22,590 rules"

5. **Visual Design**
   - Lived-in futurism aesthetic
   - High contrast, warm colors
   - Animations smooth (60fps)
   - Pause controls for accessibility

**Deliverables:**
- Home page deployed
- About page deployed
- Atlas with 22,590 points interactive
- Filters functional
- Click → Detail navigation works

**Success Metrics:**
- Atlas renders in <2s
- Interactions feel responsive (<100ms)
- Home page Lighthouse score >90
- Accessible (keyboard nav, motion controls)

---

### SPRINT 3: Detail Page (1-2 weeks)

**Goal:** Deep-dive view for any rule - animation + metrics + notes

**Tasks:**

1. **Rule Animation**
   - WebGL or Canvas2D (benchmark both)
   - 256x256 grid (configurable)
   - Controls: play/pause, step, reset, change seed
   - Speed slider (1x, 2x, 5x, 10x, max)
   - Generation counter

2. **Metrics Display**
   - Panel showing all Pass 1 metrics:
     - Lambda (λ): {value} - "Expected density"
     - Gamma (γ): {value} - "Activity rate"
     - Dimension (D): {value} - "Boundary scaling"
     - Period: {value} - "Cycle length (1 = stable)"
   - Universe structure (v0.1: all same, but display):
     - Topology: flat-torus
     - Tiling: square
     - Neighborhood: moore

3. **Notes Field**
   - Free-text annotation (saved to rule.notes)
   - Markdown support
   - Auto-save on blur

4. **Collections (UI only, defer functionality)**
   - "Add to Collection" button (grayed out)
   - Tooltip: "Collections coming in v0.2"

5. **Navigation**
   - Back to Atlas (preserves filters)
   - "Random Rule" button (surprise me)
   - Breadcrumb: Home > Atlas > {ruleId}

**Deliverables:**
- Detail page for any ruleId
- Smooth animation (60fps target)
- Notes save to database
- Navigation functional

**Success Metrics:**
- Animation runs at 60fps on mid-range hardware
- Notes persist across sessions
- Page loads in <1s

---

### SPRINT 4: Lab (Resumable Survey) (1-2 weeks)

**Goal:** Enable users to contribute survey measurements, with progress tracking and resume capability

**Tasks:**

1. **Survey Queue Management**
   - Identify unsurveyed rules (262,144 total - 22,590 surveyed = 239,554 remaining)
   - Queue: random sample or user-specified range
   - Progress: X / Y rules measured (% complete)
   - Estimated time remaining

2. **WebGL Simulation**
   - Reuse Detail page animation code
   - Run headless (no rendering) for performance
   - 1000 steps per rule
   - Measure: lambda, gamma, dimension, period

3. **Background Execution**
   - Web Worker for non-blocking computation
   - Batch: measure 100 rules, save to DB, repeat
   - Pause/resume capability
   - "Close tab" warning if survey in progress

4. **Results Storage**
   - Save to rules table: new records for newly surveyed rules
   - All new rules: passes=[1], topology='flat-torus', tiling='square', neighborhood='moore'
   - Update pass record: increment rules_analyzed count

5. **Progress Visualization**
   - Real-time chart: rules/second, elapsed time, ETA
   - "Your contribution: +X rules to the database"
   - Social share: "I surveyed X rules for Cells!" (optional)

**Deliverables:**
- Lab page functional
- Users can survey new rules
- Progress persists (resume after close)
- Results appear in Atlas immediately

**Success Metrics:**
- Survey rate: >1 rule/second on mid-range hardware
- Resume works (close/reopen tab)
- New rules queryable in Atlas

---

## SHIP v0.1 (END OF SPRINT 4)

**Milestone:** Survey Explorer is live

**Features:**
- Home page explaining research vision
- Atlas: explore 22,590+ rules visually
- Detail: deep-dive any rule
- Lab: contribute more measurements

**User Flows:**
1. Curious visitor → Home → Inspired by animation → Explore Atlas → Click interesting rule → Watch in Detail
2. Researcher → About the Research → Understand vision → Atlas with filters → Export subset → Analyze externally
3. Contributor → Lab → Survey 1000 rules → See them appear in Atlas → Feel accomplished

**Post-Launch:**
- Gather feedback (survey, analytics, feature requests)
- Monitor Lab usage (how many contribute?)
- Validate: Do people care about this?

**Decision Point:** Proceed to v0.2 if:
- 100+ Atlas users (exploration validated)
- 10+ Lab contributors (survey contribution validated)
- 5+ requests for "I wish I could..." features (extensibility desired)

---

## VERSION 0.2: RESEARCH PLATFORM (Ship: +4-6 weeks)

**Goal:** Add extensible metrics, enabling users to define custom analysis and run multi-pass surveys

**Success Criteria:**
- 10+ custom metrics defined by users
- 3+ metrics contributed back to core
- 50+ users explore Pass 2 analyzed rules

---

### SPRINT 5: Metrics SDK (2 weeks)

**Goal:** Enable users to define, test, and run custom metrics in a sandboxed environment

**Tasks:**

1. **Metric Schema Design**
   - Create metrics table (metricId, version, name, description, author, cost, depends_on, code, output_schema)
   - Versioning: metricId-v1, metricId-v2, etc
   - Dependencies: DAG validation (no cycles)

2. **Standard Utils API**
   - `simulate(rule, steps, gridSize)` → grid state (Uint8Array)
   - `detectPattern(grid, pattern)` → matches (array of coordinates)
   - `analyzePeriod(grid, maxSteps)` → period (number)
   - `getNeighborhood(x, y, grid)` → count (number)
   - Documentation + examples

3. **Sandboxed Execution Environment**
   - WebWorker isolation
   - Time limit: 30s per rule
   - No network, no DOM, no database access
   - Input: rule object (read-only)
   - Output: JSON object validated against output_schema

4. **Metric Definition UI**
   - Form: name, description, cost estimate (cheap/moderate/expensive)
   - Code editor with syntax highlighting + autocomplete
   - "Test on 10 samples" button (validates before queuing)
   - Save → adds to metrics table

5. **Metric Execution Queue**
   - Select rules to measure (filter in Atlas)
   - Click "Run Metric: {metricName}"
   - Queue execution (Web Worker batch processing)
   - Progress bar + ETA
   - Results append to rule.metrics[metricId-v]

**Deliverables:**
- Metrics SDK functional
- Users can define metrics
- Test framework works (10-sample validation)
- Execution is sandboxed + time-limited
- Results stored with versioning

**Success Metrics:**
- User can define "glider-count" metric and run on 1000 rules in <10 minutes
- Sandbox prevents infinite loops (30s timeout works)
- No security vulnerabilities (penetration test)

---

### SPRINT 6: Pass 2 Analysis (2 weeks)

**Goal:** Define 3-5 expensive metrics and run them on a curated subset (Pass 2)

**Tasks:**

1. **Define Built-In Pass 2 Metrics**
   - **Glider Count:** Detect 5-cell glider patterns, count occurrences
   - **Hierarchy Score:** Analyze multi-level structure (still lifes → generators → generators of generators)
   - **Complexity Estimate:** Kolmogorov-style compression ratio
   - **Oscillator Detection:** Find periodic structures (period > 1)
   - **Spaceship Detection:** Find translating patterns

2. **Select Pass 2 Candidates**
   - Filter: gamma > 0.1 AND dimension > 1.3 (promising rules)
   - Result: ~5,000 rules
   - Create pass record: pass_number=2, description="Expensive metrics on promising subset"

3. **Run Pass 2 Survey**
   - Use Metrics SDK to run 5 metrics on 5k rules
   - Batch execution: 100 rules at a time
   - Results append to rule.metrics
   - Update passes array: rules now have passes=[1, 2]

4. **Atlas Enhancements**
   - Pass filter: "Show: All | Pass 1 | Pass 2"
   - Color by metric: dropdown (lambda, gamma, glider-count, hierarchy-score, etc)
   - Size by metric: dropdown
   - "Pass 2 rules" badge in tooltips

5. **Pass Visualization**
   - New page: "Analysis Passes"
   - Shows funnel: Pass 1 (22,590) → Pass 2 (5,000) → Pass 3 (TBD)
   - Click pass → filter Atlas to that pass

**Deliverables:**
- 5 expensive metrics defined
- 5,000 rules analyzed in Pass 2
- Atlas shows Pass 2 data
- Pass visualization page

**Success Metrics:**
- Pass 2 completes in <1 week (distributed across user contributions)
- Glider-count metric >90% accurate (manual spot-check)
- Users engage with Pass 2 filters (50+ users)

---

### SPRINT 7: Compare + Export (1-2 weeks)

**Goal:** Enable side-by-side rule comparison and data export for external analysis

**Tasks:**

1. **Compare View**
   - URL: /compare?rules=B3/S23,B368/S245
   - Side-by-side: 2-4 rules (animations + metrics)
   - Highlight differences (topology, metrics)
   - Share link

2. **Collections (Full Implementation)**
   - Create/edit/delete collections
   - Add rules to collections (checkbox in Atlas, button in Detail)
   - Collection page: grid of rule thumbnails + bulk actions

3. **CSV Export**
   - "Export" button in Atlas (exports filtered subset)
   - Format: ruleId, birth, survival, topology, lambda, gamma, dimension, period, metrics (JSON column)
   - Download as CSV

4. **API Documentation**
   - Document query API (for researchers)
   - Example: fetch all rules with gamma > 0.5 via JavaScript
   - Enable external analysis (R, Python, etc)

**Deliverables:**
- Compare view works for 2-4 rules
- Collections functional
- CSV export with metrics
- API docs published

**Success Metrics:**
- 20+ users create collections
- 10+ CSV exports downloaded
- 1+ external researcher uses API

---

## SHIP v0.2 (END OF SPRINT 7)

**Milestone:** Research Platform is live

**New Features:**
- Extensible metrics (users can define + run custom analysis)
- Pass 2 analysis (5k rules with expensive metrics)
- Compare view (side-by-side rule analysis)
- Collections (curate favorites)
- CSV export (for external analysis)

**Post-Launch:**
- Monitor metric contributions (how many new metrics?)
- Validate quality (are user metrics useful?)
- Gather requests for v0.3

**Decision Point:** Proceed to v0.3 if:
- 10+ custom metrics created
- 3+ metrics contributed to core (PR'd)
- Users request topology comparison ("I want to see how B3/S23 behaves on a sphere")

---

## VERSION 0.3: TOPOLOGY EXPLORER (Ship: +6-8 weeks)

**Goal:** Survey rules on multiple topologies, enable comparative analysis of how universe structure affects emergence

**Success Criteria:**
- 5,000+ rules surveyed on non-flat-torus topologies
- 1+ external researcher publishes using Cells data
- Statistical significance: topology affects gamma distribution (p<0.05)

---

### SPRINT 8: Topology Survey (3-4 weeks)

**Goal:** Survey 5k-10k rules on 2-3 additional topologies

**Tasks:**

1. **Implement Topology Variants**
   - Spherical: wrap-around with pole neighbor adjustments
   - Hexagonal tiling: 6-neighbor rules (requires rule translation)
   - Klein bottle: one-sided surface

2. **Lab Enhancements**
   - Topology selector: flat-torus | sphere | hex | klein
   - Note: "This will survey NEW rules (same birth/survival, different topology)"
   - Queue: top 5k rules by gamma (most interesting from Pass 1)

3. **Distributed Survey Campaign**
   - Encourage users to run surveys on non-flat-torus topologies
   - Progress tracker: "Sphere topology: 2,341 / 5,000 surveyed"
   - Gamification: "You contributed 500 sphere rules!"

4. **Data Storage**
   - New rules with topology='sphere', tiling='square' (or tiling='hex' for hexagonal)
   - Same birth/survival as flat-torus rules, different results
   - passes=[1] initially (Pass 1 metrics only)

**Deliverables:**
- 3 topology variants implemented
- 5k rules surveyed on each (15k new rules total)
- Lab supports topology selection

**Success Metrics:**
- 15k new rules with diverse topologies
- Survey completion in <4 weeks (distributed)
- No simulation bugs (spot-check accuracy)

---

### SPRINT 9: 3D Visualization (Optional, 2 weeks)

**Goal:** IF 2D Atlas proves limiting, add 3D view for exploring 4+ dimensions simultaneously

**Decision:** Based on v0.2 user feedback. If users request "I can't see patterns in 2D," implement. Otherwise, defer.

**Tasks:**

1. **3D Atlas (Three.js or Deck.gl)**
   - X: lambda, Y: gamma, Z: dimension
   - Color: topology
   - Size: glider-count
   - Interactive: rotate, zoom, click

2. **Performance Optimization**
   - Level-of-detail (render nearby points in full, distant as billboards)
   - Frustum culling
   - Target: 60fps with 30k+ points

**Deliverables:**
- 3D Atlas (if justified by feedback)
- Toggle: 2D ↔ 3D views

**Success Metrics:**
- 60fps on mid-range hardware
- Users report 3D helps discovery

---

### SPRINT 10: Comparative Analysis + Hierarchy Detection (2 weeks)

**Goal:** Enable topology comparison and algorithmic hierarchy detection

**Tasks:**

1. **Topology Comparison Page**
   - URL: /topology-compare?rule=B3/S23
   - Shows same rule across all surveyed topologies
   - Side-by-side animations
   - Metrics table (highlight differences)
   - Chart: metric distributions by topology

2. **Statistical Analysis**
   - Run t-tests: Does topology affect gamma? lambda? dimension?
   - Visualize: box plots, histograms
   - Report: "Spherical topology has 12% higher average gamma (p=0.003)"

3. **Algorithmic Hierarchy Detection**
   - Classify rules: static, oscillator, spaceship, chaotic, complex
   - Use period, glider-count, complexity metrics
   - Add classification field to rules
   - Atlas filter: "Show only: spaceships"

4. **Research Export**
   - Generate academic-ready datasets (JSON, CSV)
   - Include methodology notes
   - Citation: "Data from Cells v0.3 (2026)"

**Deliverables:**
- Topology comparison view
- Statistical analysis (t-tests, visualizations)
- Algorithmic classification
- Research-ready data export

**Success Metrics:**
- Statistical significance found (topology affects at least one metric, p<0.05)
- 1+ researcher downloads data for external analysis
- Classification accuracy >80% (manual validation)

---

## SHIP v0.3 (END OF SPRINT 10)

**Milestone:** Topology Explorer is live

**New Features:**
- 15k+ rules across 4 topologies (flat-torus, sphere, hex, klein)
- Topology comparison view
- Statistical analysis (topology effects)
- Algorithmic hierarchy detection
- Research-ready data export

**Research Validation:**
- Can answer: "Does topology affect emergence?" (Yes/No + statistical evidence)
- Can publish: Academic paper using Cells data
- Can discover: Surprising topology effects (e.g., rule X is chaotic on flat-torus but stable on sphere)

---

## WHAT NOT TO BUILD (Defer to v0.4+)

**Resist these tempting features until v0.1-v0.3 validated:**

1. **Real-time Collaboration**
   - Multi-user editing of collections
   - Shared annotations
   - Chat/comments

2. **Machine Learning**
   - Train model to predict interesting rules
   - Autogenerate rules with desired properties

3. **3D Cellular Automata**
   - Different rule space entirely (2^(3^3) rules)
   - Requires new simulation engine

4. **Mobile App**
   - Native iOS/Android
   - Web-first for now (responsive design)

5. **Social Features**
   - User profiles
   - Comments, ratings
   - Leaderboards

**Rationale:** These are exciting but orthogonal to core vision (understanding emergence through systematic survey). Ship v0.1-v0.3, validate research value, THEN expand.

---

## SUMMARY

| Version | Sprints | Duration | Key Goal | Ship Criteria |
|---------|---------|----------|----------|---------------|
| v0.1 | 1-4 | 6-8w | Survey Explorer | 100+ users, 10+ contributors |
| v0.2 | 5-7 | 4-6w | Extensible Metrics | 10+ custom metrics, 3+ contributed |
| v0.3 | 8-10 | 6-8w | Topology Comparison | 5k+ non-flat rules, statistical significance |

**Total:** 10 sprints, 16-22 weeks (4-5.5 months) to full research platform

**Incremental Value:** Each version ships independently useful product. Can pause after any version based on validation.

---

**Status:** Ready for Sprint 1 kickoff
