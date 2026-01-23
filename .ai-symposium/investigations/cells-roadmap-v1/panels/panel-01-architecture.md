# Panel 01: Architecture Panel
## Cells Research Laboratory - System Design & Sprint Planning

**Panel Type:** Architecture
**Date:** 2026-01-23
**Duration:** 24 hours (simulated)

**Question:** How should the Cells research laboratory be architected? What is the correct sprint ordering, IndexedDB schema, visualization approach, hierarchy detection strategy, and minimum viable feature set?

**Experts Assembled:**
- Fred Brooks (System design, conceptual integrity)
- Rich Hickey (Data-first design, immutability)
- Barbara Liskov (Abstraction, interfaces)
- Dieter Rams (Functionalism, minimalism)
- Edward Tufte (Information visualization)
- Bret Victor (Tools for thought, explorability)
- Stephen Wolfram (CA research, empirical exploration)

---

## HOUR 1-6: GROUNDING - What Are We Actually Building?

**BROOKS:** Let me start by understanding the conceptual integrity here. What is the *one* thing this system does? Research laboratory suggests exploration, but you have a survey runner, an atlas, a gallery, detail pages... Where is the center?

**VICTOR:** I agree with Fred's concern. Let me rephrase: what is the *insight* you want users to have? Not "show them data" - what understanding should emerge from interacting with this system?

**WOLFRAM:** The insight is clear from the investigation-seed: some rules are interesting, most are not, and we don't know why. The system should help discover *what makes a rule interesting* and *where interesting rules cluster in rule space*.

**TUFTE:** Then the visualization should not be six separate pages. It should be one integrated view with small multiples. Show me the rule space, let me select a rule, show its behavior, show its metrics. All visible simultaneously.

**RAMS:** Wait. Edward is proposing the end-state. But Yianni asked about sprints - about *building* it. We must ask: what is the minimum system that provides value? Not the complete vision.

**HICKEY:** Good. Let's separate what exists from what should exist. Currently: 22,590 rules surveyed (8.6% complete), stored in CSV files, six HTML pages. The system is partially functional but incoherent.

**LISKOV:** The incoherence comes from no data layer. Each page reads CSV files independently. There's no abstraction. The first sprint should establish the data interface.

**BROOKS:** Barbara is right. Conceptual integrity demands: establish the data model first, build everything else on top. But Dieter asks the deeper question: what is the minimum *useful* system?

**VICTOR:** Let me challenge the premise. The proposed sprint plan treats the survey as separate from exploration. But discovery happens during surveying. The user should see patterns emerge as rules are tested, not afterwards.

**WOLFRAM:** Bret's point is excellent. When I explored CA space for NKS, the survey *was* the exploration tool. You watch rules being tested, you notice patterns, you pause to investigate. This separation between "Lab" (surveying) and "Atlas" (exploring results) is artificial.

**RAMS:** So the minimum useful system is: a survey runner that lets me watch rules being tested, pause when I see something interesting, and explore *that* rule. Everything else is decoration.

**TUFTE:** No, Dieter. Without the overview, you don't know where in rule space you are. You need both: the map (Atlas) and the magnifying glass (Detail). But you don't need Collections, Compare, or elaborate hierarchy detection initially.

**HICKEY:** Let me propose data as the unifying concept. The survey produces data. The Atlas consumes data. The Detail page consumes data. If we design the data schema correctly, all views are simply different queries and presentations of the same information.

**BROOKS:** Rich is describing the conceptual model. One thing: a database of rules and their measured properties. All pages are views into that database. This is clean.

**LISKOV:** Agreed. So Sprint 1 is: establish the database schema and migrate existing CSV data. Every subsequent sprint builds on this foundation.

**VICTOR:** But we haven't addressed the 8.6% problem. The survey is incomplete. How do we present incomplete data without misleading users?

**WOLFRAM:** You show the coverage explicitly. The Atlas visualizes what's been tested. Empty regions are visible gaps, not claims. This is standard in experimental science.

**TUFTE:** Exactly. Small multiples of sampled regions. The eye sees the structure even in sparse data. 22,590 points is sufficient to see clustering if it exists.

---

## HOUR 6-12: EXPLORATION - Dissecting the Seven Questions

**BROOKS:** Let's address Yianni's seven questions systematically. First: "Is this sprint order correct?"

### Question 1: Sprint Ordering

**HICKEY:** The proposed order is:
1. IndexedDB + migration
2. Atlas (3D scatter)
3. Home + Detail pages
4. Lab (resumable survey)
5. Hierarchy detection
6. Collections + Compare
7. Polish

**HICKEY:** This is backwards. Sprint 2 builds a visualization before Sprint 4 makes the survey resumable. So users see 8.6% data with no way to add more for 3-4 sprints. That's unmotivating.

**WOLFRAM:** Agreed. Prioritize making the survey completable. The value of incomplete data is limited. Reorder: 1) Data layer, 2) Resumable survey, 3) Atlas, 4) Detail.

**RAMS:** Simpler: combine sprints. Sprint 1 is data + basic Atlas (2D, not 3D). Sprint 2 is resumable survey + progress indicator. Sprint 3 is Detail page. Stop there for v0.1.

**VICTOR:** But "basic Atlas" misses the point. The Atlas should be *playable* from Sprint 1. Click a point, see the rule animate. No separate Detail page yet - just inline animation.

**BROOKS:** Bret is describing integrated functionality. This is good design but risks scope creep. Let me propose a principle: each sprint delivers one complete user flow, not one component.

**BROOKS:** Sprint 1: "I can see what's been surveyed" - data layer + minimal Atlas (2D scatter, static)
Sprint 2: "I can survey more rules" - resumable Lab + progress tracking
Sprint 3: "I can explore individual rules" - Detail page
Sprint 4: "I can compare rules" - Collections

**LISKOV:** Fred's proposal has the right structure. Each sprint is independently valuable. But I disagree with Sprint 1 deliverable. "See what's been surveyed" isn't valuable if the data is sparse and static. Make it dynamic: Atlas with hover tooltips showing rule notation.

**TUFTE:** Tooltips are interaction design detail. Let's agree on sprint structure first. I propose:

**Reordered Sprint Plan:**
1. Data layer (IndexedDB schema, migration, basic query API)
2. Lab + Atlas together (resumable survey, live updating scatter plot)
3. Detail page (single rule deep-dive)
4. Home page (research explanation) + hierarchy detection
5. Collections + Compare
6. 3D Atlas upgrade + topology support
7. Polish + performance optimization

**RAMS:** That's seven sprints. Too many. For v0.1:

**Minimal Sprint Plan:**
1. Data + Atlas (2D)
2. Lab (resumable) + live updates to Atlas
3. Detail page

Stop. Ship. That's v0.1. Everything else is v0.2+.

**HICKEY:** Dieter's minimalism is appealing but impractical. Sprint 2 requires Sprint 1's data layer. But Sprint 1 "Data + Atlas" is too large - schema design plus visualization is 2-3 weeks work.

**WOLFRAM:** Split it. Sprint 1A: schema + migration + basic query API (no UI). Sprint 1B: Atlas UI consuming that API. Sprint 2: Lab resumable. Sprint 3: Detail.

**BROOKS:** We're bikeshedding. Let me decide: Fred's original order stands with one change - Home page moves to Sprint 1. Users need context before exploring.

**VICTOR:** No. Home page is *storytelling*. It should come last, when you know what story to tell. Build the tool first, discover the insights, then explain them.

**TUFTE:** Bret is correct about sequencing, but Yianni needs to share this publicly. Without a Home page explaining the research, the Atlas is inscrutable to newcomers.

**CONSENSUS EMERGING:** Sprint order should be:
1. Data layer (schema + migration + query API)
2. Atlas (2D scatter explorer)
3. Lab (resumable survey with live Atlas updates)
4. Detail page (single rule deep-dive)
5. Home page (research explanation) - written after discoveries
6. Collections + hierarchy detection
7. Polish + 3D Atlas + topology

---

### Question 2: IndexedDB Schema

**HICKEY:** The schema question is: what do we store per rule?

**Current data:** ruleId, lambda, dimension, gamma, period, classification

**Future needs:** topology variations, hierarchy metrics, user tags/collections

**LISKOV:** Design for extension. The schema should accommodate future topologies without migration. Use a structure like:

```
RuleMeasurements:
  id (auto-increment)
  ruleId (indexed)
  topology (indexed: "flat-torus", "sphere", "hyperbolic")
  substrate (future: dimensions, neighborhood)
  metrics (object: {lambda, dimension, gamma, period})
  classification (indexed)
  measured_at (timestamp)
  version (schema version)
```

**HICKEY:** This is too normalized. Barbara is thinking SQL. In document stores, store the complete measurement. No joins.

```
Rules:
  ruleId (primary key, e.g., "B3/S23")
  notation (object: birth, survival arrays)
  measurements (array of measurement objects)
    [{topology: "flat-torus", metrics: {...}, timestamp: ...}]
  hierarchies (array, added later)
  tags (array, user-added)
  collections (array of collection IDs)
```

**WOLFRAM:** Rich's schema is denormalized and flexible, but storing measurements as a nested array complicates queries. Dexie can't index into arrays efficiently. You can't query "all rules where lambda > 0.5 on flat topology".

**HICKEY:** Then separate stores:

```
Rules:
  ruleId (primary)
  notation (object)
  tags (array)

Measurements:
  id (auto-increment)
  ruleId (indexed)
  topology (indexed)
  lambda (indexed)
  dimension (indexed)
  gamma (indexed)
  classification (indexed)
  period
  measured_at
```

**LISKOV:** This is what I proposed. Two stores: Rules (entities) and Measurements (observations). Clean separation of concerns.

**TUFTE:** From a visualization perspective, I need fast queries like "give me all flat-torus measurements where 0.4 < lambda < 0.6". Measurements must be in a separate store with composite indexes.

**BROOKS:** Consensus on two stores. But we're over-engineering for future topologies that aren't implemented. Yianni asked for a schema for 262k flat-torus rules. Start simple:

```
rules:
  ruleId (primary key, string: "B3/S23")
  birth (array: [3])
  survival (array: [2,3])
  lambda (indexed, number)
  dimension (indexed, number)
  gamma (indexed, number)
  period (number)
  classification (indexed, string)
  measured_at (timestamp)

collections:
  id (auto-increment)
  name (string)
  ruleIds (array of strings)
  created_at (timestamp)
```

**RAMS:** Perfect. This is sufficient for v0.1. When topology support is added in Sprint 8, add a topology field to rules store, default to "flat-torus". No migration needed - it's additive.

**VICTOR:** One addition: store raw simulation history for interesting rules. 10-20 timesteps, small grid (32x32). For instant playback in Atlas hover.

**WOLFRAM:** Bret's suggestion violates storage efficiency. 262k rules × 20 timesteps × 1KB = 5GB minimum. IndexedDB will choke.

**VICTOR:** Not all rules. Only flagged ones. Maybe 100-500 rules that look interesting. Call it a "preview" field, optional.

**HICKEY:** Reasonable compromise. Add to schema:

```
preview (optional, array of grids for animation)
```

**FINAL SCHEMA CONSENSUS:**

```javascript
const db = new Dexie('CellsDB');
db.version(1).stores({
  rules: 'ruleId, lambda, dimension, gamma, classification',
  collections: '++id, name'
});

// Rule object shape:
{
  ruleId: "B3/S23",
  birth: [3],
  survival: [2, 3],
  lambda: 0.52,
  dimension: 1.68,
  gamma: -0.03,
  period: 2,
  classification: "Class IV",
  measured_at: "2026-01-23T...",
  preview: [...grids...] // optional, ~100 rules
}

// Collection object shape:
{
  id: 1,
  name: "Promising Class IV",
  ruleIds: ["B3/S23", "B36/S23", ...],
  created_at: "2026-01-23T..."
}
```

---

### Question 3: Interest Scoring

**WOLFRAM:** "Interesting" is subjective, but we can quantify correlates. In NKS, I used: edge of chaos (lambda ≈ 0), fractal dimension (D ≈ 1.5), complex behavior sustained (gamma ≈ 0 but not negative).

**TUFTE:** That's three-dimensional. The Atlas *is* the interest score. Users explore the (lambda, D, gamma) space visually. Don't reduce it to a single number.

**VICTOR:** Edward is right for exploration, but wrong for search. A score helps answer "show me the top 10 most interesting rules I haven't seen yet".

**RAMS:** Do you need that feature in v0.1? Can it wait?

**HICKEY:** It can wait. But the question is answerable. Interest score = distance from boring regions. Boring = lambda < -1 (dies) or lambda > 1 (explodes) or D < 0.1 (empty) or D > 1.9 (solid).

**BROOKS:** Rich is proposing "interestingness = how close to the edge of chaos?" This is a hypothesis. It should be testable. Add a score field, make the formula adjustable, let users experiment.

**LISKOV:** If the formula is adjustable, it doesn't belong in the database. Compute it on demand during queries. Formula becomes a user preference.

**WOLFRAM:** Agreed. Store only measured quantities (lambda, D, gamma). Compute "interest score" in UI layer using user-defined weights.

**CONSENSUS:** No interest score in schema. Provide UI controls to filter/sort by metric ranges. Defer scoring algorithm to v0.2.

---

### Question 4: Hierarchy Detection

**WOLFRAM:** Hierarchy detection is expensive. For 262k rules, running deep analysis on each is infeasible. You need a two-pass approach: first pass (done) measures aggregate stats. Second pass (selective) runs long simulations on promising rules to detect still lifes, oscillators, gliders.

**VICTOR:** The detection should be incremental. As I explore a rule in the Detail page, the system should passively detect structures in the background and show me: "I found 3 stable patterns, 2 period-4 oscillators."

**BROOKS:** Bret is describing a feature for Sprint 5-6. Yianni asked about MVP. Minimum viable hierarchy detection is: period detection (already done) and manual tagging.

**TUFTE:** Visual detection is faster than algorithmic detection. Show me the rule evolving. I'll see gliders. Let me mark them: "this rule has spaceships." Crowdsource the detection.

**RAMS:** Edward's approach is minimal and honest. Don't promise AI-detected hierarchies if you don't have them. Provide manual annotation tools.

**HICKEY:** Annotation requires schema support:

```
annotations:
  id (auto-increment)
  ruleId (indexed)
  type ("still-life" | "oscillator" | "glider" | "other")
  description (string)
  pattern_data (optional, serialized pattern)
```

**WOLFRAM:** Or just add a notes field to rules and let users write free text. Structuring it too early constrains discovery.

**LISKOV:** Stephen makes a good point. We don't know what users will want to annotate. Start with unstructured notes, structure later based on actual usage.

**CONSENSUS:** Hierarchy detection MVP = period detection (done) + free-text notes field per rule. Advanced detection deferred to Sprint 5.

---

### Question 5: 2D vs 3D Atlas

**TUFTE:** I've written extensively about 3D visualizations. They are almost always worse than 2D small multiples. The perspective distortion obscures data. 3D is for ego, not insight.

**VICTOR:** Edward, you're fighting the last war. Static 3D charts on paper are bad. Interactive WebGL 3D that you can rotate, zoom, and slice is different. It's embodied exploration.

**TUFTE:** Rotation is not exploration. It's disorientation. Give me three 2D scatters: lambda vs D, lambda vs gamma, D vs gamma. All visible simultaneously. That's exploration.

**WOLFRAM:** Edward's approach shows pairwise relationships. Bret's shows the embedding in the full 3D space. Both have value. But for 262k points, 2D is easier to implement and performs better.

**RAMS:** Simplicity principle: start 2D. If users ask for 3D, add it later. Don't build features speculatively.

**BROOKS:** I agree with Dieter's process. But let me ask: is the 3D structure real or artificial? In the Mandelbrot set, the 2D plane is the natural space. For (lambda, D, gamma), are these three independent axes or projections of something deeper?

**HICKEY:** They're independent measurements. Lambda = sensitivity, D = space-filling, gamma = growth. No hidden dimension. 3D scatter is appropriate *if* the third dimension adds information.

**VICTOR:** It does. Lambda vs D might show a cluster, but adding gamma separates it into two sub-clusters. This is exactly when 3D helps.

**TUFTE:** Then show lambda-D colored by gamma. Color is a third dimension without the distortion of perspective.

**WOLFRAM:** Edward wins this one. Start with 2D: lambda vs D scatter, colored by gamma, point size by period. Add 3D in Sprint 6 if needed.

**CONSENSUS:** Atlas MVP = 2D scatter (lambda vs dimension), colored by gamma, sized by period, interactive (hover tooltips, click to Detail page). 3D deferred to Sprint 6.

---

### Question 6: Incomplete Survey (8.6%)

**BROOKS:** This isn't an architecture question, it's a communication question. How do you present incomplete data honestly?

**TUFTE:** Show the coverage explicitly. If 22,590 out of 262,144 rules are tested, display "Coverage: 8.6%". Show which regions of rule space are sampled. Sparse sampling can still reveal structure.

**WOLFRAM:** Exactly. The survey is stratified (random sampling across rule space). Even 10% sample is statistically valid for detecting clusters.

**VICTOR:** But users will want to fill gaps. The Atlas should show "surveyed" vs "not yet surveyed" distinctly. Click an empty region, add those rules to the survey queue.

**RAMS:** Bret is designing a feature for Sprint 2 (resumable survey). The question here is: how does Sprint 2's Atlas communicate partial data? Edward answered: show coverage percentage and distribution.

**HICKEY:** Add a toggle: "Show only surveyed rules" vs "Show all rules (surveyed + ghost)". Ghost points are greyed out, clickable to add to survey queue.

**LISKOV:** This requires schema support. How do you represent an unsurveyed rule?

**WOLFRAM:** You don't. The rules database contains only measured rules. Unsurveyed rules are generated algorithmically (all 262k rule IDs are enumerable). The UI generates them on demand.

**CONSENSUS:** Atlas shows only surveyed rules in Sprint 2. Display "22,590 / 262,144 rules surveyed (8.6%)" prominently. Sprint 4 adds ghost points for unsurveyed rules.

---

### Question 7: Simplest Path to v0.1

**RAMS:** We've been talking for hours. Let me summarize the minimum viable system:

**v0.1 Feature Set:**
1. Database of 22,590 surveyed rules (IndexedDB)
2. Atlas: 2D scatter plot (lambda vs D, colored by gamma)
3. Detail: Click a rule, see it animate with metrics
4. Lab: Resume survey from 8.6% to completion

That's it. Four features. Everything else is v0.2.

**BROOKS:** Dieter's list is clean. But it's not a user flow. Let me reframe as user stories:

**v0.1 User Flows:**
1. As a researcher, I can explore the 22k surveyed rules visually (Atlas)
2. As a researcher, I can click a rule to see its detailed behavior (Detail)
3. As a researcher, I can resume the survey to grow the dataset (Lab)
4. As a researcher, I can understand what this research is about (Home)

Four pages, four flows.

**VICTOR:** Fred added Home, which Dieter excluded. I side with Fred. Without context, the tool is inscrutable. Home page is cheap - it's just markdown explaining the research.

**HICKEY:** Home page is writing, not coding. Yianni can draft it while Sprint 1 (data layer) is being built. Parallelizable.

**TUFTE:** Agree. Home, Atlas, Detail, Lab. That's v0.1. Sprint breakdown:

**Recommended Sprint Plan:**
- Sprint 1 (Data Foundation): IndexedDB schema, CSV migration, query API
- Sprint 2 (Exploration): Atlas 2D scatter + Home page (context)
- Sprint 3 (Deep Dive): Detail page (single rule simulation + metrics)
- Sprint 4 (Growth): Lab resumable survey with progress tracking

**Stop there. Ship v0.1.**

**WOLFRAM:** That's conservative but correct. After v0.1 ships and users interact, you'll discover what Sprint 5 should be. Don't plan beyond v0.1 now.

**CONSENSUS REACHED.**

---

## HOUR 12-18: CONVERGENCE - Resolving Tensions

**BROOKS:** Let me identify the tensions that remain:

**Tension 1: Sprint Scope**
- Dieter/Rams: Radically minimal (3 pages, no Home)
- Brooks/Victor: Contextual (4 pages, include Home)
- Resolution: Include Home, but as lightweight markdown, not complex page.

**Tension 2: 2D vs 3D Atlas**
- Tufte: 2D small multiples, always
- Victor: 3D interactive when the dimensions are real
- Resolution: Start 2D, defer 3D to v0.2+. Use color for third dimension.

**Tension 3: Schema Flexibility vs Simplicity**
- Hickey: Flexible schema anticipating topology support
- Brooks/Rams: Simple schema for current needs only
- Resolution: Simple schema with additive extension path (add topology field later).

**Tension 4: Survey Before Atlas vs Atlas Before Survey**
- Hickey/Wolfram: Finish survey first, then visualize
- Victor: Visualize partial data, incentivize survey completion
- Resolution: Atlas in Sprint 2 showing partial data, Survey in Sprint 4 (later than originally planned).

**LISKOV:** These aren't tensions, they're trade-offs with clear resolutions. We've converged.

**HICKEY:** One unresolved question: visualization library. We researched Plotly.js (easiest), Scatter-GL (Google's embedding projector), Regl-scatterplot (performance). No recommendation yet.

**TUFTE:** Plotly.js. It's mature, handles 262k points, and is declarative. Don't optimize prematurely.

**VICTOR:** I prefer Scatter-GL. It's specifically designed for this use case (embedding exploration). Plotly is a charting library; Scatter-GL is an exploration tool.

**WOLFRAM:** Benchmark both with 262k points. Whichever is faster and more responsive wins. This is empirical, not aesthetic.

**BROOKS:** Stephen is right. Make it a spike task in Sprint 2: try Plotly, try Scatter-GL, choose based on performance and API fit.

**CONSENSUS:** Spike both libraries in Sprint 2, choose based on performance benchmark.

---

**TUFTE:** One more design principle for the Atlas: don't hide the data. Show all 262k points (once surveyed). No artificial clustering or aggregation. Raw data, explorable.

**RAMS:** Agreed. Aggregation is a crutch for bad visualization. If 262k points are too many, the user isn't zooming enough.

**VICTOR:** Interaction is the solution to scale. Pan, zoom, filter. Provide sliders: "Show only rules where 0.3 < lambda < 0.7". The dataset shrinks dynamically.

**HICKEY:** Filters are queries. The schema must support efficient range queries. That's why lambda, dimension, gamma are indexed.

**LISKOV:** Correct. The architecture is: UI (filters) → Query API (Dexie range queries) → IndexedDB (indexed scans). Clean layers.

**BROOKS:** Conceptual integrity achieved. The system is: a database of measured rules, with views (Atlas, Detail, Lab) that query and present that data differently.

---

## HOUR 18-24: RECOMMENDATIONS - What Should Be Built

**BROOKS:** Let me synthesize 24 hours of discussion into concrete recommendations. I'll number them for tracking.

### R1: Adopt Four-Sprint v0.1 Plan

**Sprint 1: Data Foundation (1-2 weeks)**
- Design and implement IndexedDB schema (two stores: rules, collections)
- Migrate existing 22,590 CSV records to IndexedDB
- Build query API layer (get by ID, range queries on metrics, filter by classification)
- Write unit tests for queries

**Sprint 2: Exploration UI (2 weeks)**
- Implement Atlas: 2D scatter plot (lambda vs dimension, colored by gamma)
- Spike Plotly.js vs Scatter-GL, choose based on performance with 262k points
- Add interaction: hover tooltips (show rule notation + metrics), click to Detail
- Add filters: range sliders for lambda, D, gamma
- Create Home page: markdown explaining research question, link to Atlas

**Sprint 3: Deep Dive (1-2 weeks)**
- Build Detail page: given ruleId, show:
  - Animated simulation (reuse existing stepper.js)
  - Metrics table (lambda, D, gamma, period, classification)
  - Rule notation (B/S format)
  - Free-text notes field (editable, saved to DB)
- Add navigation: back to Atlas, previous/next rule in dataset

**Sprint 4: Survey Growth (1-2 weeks)**
- Make Lab page resumable: read from IndexedDB which rules are done
- Add progress tracking: "22,590 / 262,144 rules surveyed (8.6%)"
- Implement "add rules to queue" from Atlas (click unsurveyed region)
- Add WebGPU survey to write directly to IndexedDB (skip CSV export)

**Total: v0.1 in 6-8 weeks**

**RAMS:** Endorsed. This is minimal and complete.

---

### R2: Use This IndexedDB Schema

```javascript
const db = new Dexie('CellsDB');
db.version(1).stores({
  rules: 'ruleId, lambda, dimension, gamma, classification',
  collections: '++id, name'
});

// Rule object:
{
  ruleId: "B3/S23",           // Primary key
  birth: [3],                  // Array of birth counts
  survival: [2, 3],            // Array of survival counts
  lambda: 0.52,                // Indexed: damage spreading
  dimension: 1.68,             // Indexed: fractal dimension
  gamma: -0.03,                // Indexed: complexity growth
  period: 2,                   // Detected period
  classification: "Class IV",  // Indexed: I, II, III, IV
  measured_at: "2026-01-23T...", // ISO timestamp
  notes: ""                    // Free-text user annotations
}

// Collection object:
{
  id: 1,                       // Auto-increment
  name: "Promising Class IV",
  ruleIds: ["B3/S23", ...],
  created_at: "2026-01-23T..."
}
```

**Extension path for topology support (Sprint 8):**
Add `topology: "flat-torus"` field to rules, default for existing records. No migration needed.

**HICKEY:** Endorsed. This is simple, extensible, and query-efficient.

---

### R3: Start with 2D Atlas, Defer 3D

**Atlas MVP (Sprint 2):**
- 2D scatter: lambda (x-axis) vs dimension (y-axis)
- Color: gamma (diverging colormap: blue = negative, white = zero, red = positive)
- Point size: period (larger = longer period)
- Interaction: hover tooltip (rule notation + metrics), click to Detail page
- Filters: range sliders for lambda, D, gamma (constrain visible points)

**Defer to v0.2:**
- 3D scatter (if user testing shows it's needed)
- Multiple linked views (small multiples)
- Custom axis selection

**TUFTE:** Endorsed. Color is sufficient for the third dimension.

---

### R4: Defer Interest Scoring to v0.2

Don't compute a single "interest score" in v0.1. Instead:
- Let users explore (lambda, D, gamma) space visually
- Provide filters to isolate regions (e.g., "edge of chaos": -0.1 < lambda < 0.1)
- Add manual Collections for rules users find interesting

In v0.2, consider:
- User-adjustable scoring formula (weighted distance from boring regions)
- "Surprise detection" (rules that behave unlike neighbors in rule space)

**WOLFRAM:** Endorsed. Let empirical exploration guide the scoring algorithm.

---

### R5: Hierarchy Detection MVP = Period + Notes

Sprint 3 hierarchy detection:
- Display detected period (already measured in survey)
- Provide free-text notes field for manual annotation
- Example annotations: "Has gliders", "Block + blinker still life", "Oscillators period 3"

Sprint 5+ (deferred):
- Algorithmic still life detection (find stable patterns)
- Oscillator catalog (extract and store repeating patterns)
- Spaceship detection (translational periodicity)

**BROOKS:** Endorsed. Manual annotation is honest and cheap.

---

### R6: Visualization Library Spike

In Sprint 2, benchmark both:
- **Plotly.js** (scattergl trace): Mature, declarative, large bundle (~3MB)
- **Scatter-GL** (Google PAIR): Purpose-built for embedding exploration, smaller bundle

**Test criteria:**
- Render time for 262k points
- Interaction responsiveness (pan, zoom, hover)
- API ease-of-use (setup complexity)
- Bundle size impact

Choose based on performance. Default to Plotly if performance is comparable (maturity wins).

**WOLFRAM:** Endorsed. Empirical choice.

---

### R7: Communicate Incomplete Data Clearly

In Atlas (Sprint 2-3):
- Display coverage: "22,590 / 262,144 rules surveyed (8.6%)"
- Show only surveyed rules initially
- Add tooltip: "This is a sparse sample. Clusters are suggestive, not definitive."

In Lab (Sprint 4):
- Show progress bar
- Allow user to prioritize regions: "Survey more rules near B3/S23"

In Atlas (Sprint 4+):
- Add "ghost points" for unsurveyed rules (greyed out, clickable to add to queue)

**TUFTE:** Endorsed. Transparency about data coverage is essential.

---

### R8: Reorder Original Sprint Plan

**Original plan:** IndexedDB → Atlas → Home+Detail → Lab → Hierarchy → Collections → Polish → Topology

**Revised plan:**
1. Data layer (IndexedDB + migration)
2. Atlas + Home (exploration context)
3. Detail (deep dive)
4. Lab (resumable survey)
5. Hierarchy detection + Collections
6. 3D Atlas (if needed) + Compare page
7. Polish + performance
8-10. Topology support + 3D visualization

**Key changes:**
- Home page moved to Sprint 2 (context first)
- Lab moved to Sprint 4 (after Atlas + Detail, to motivate survey completion)
- 3D Atlas deferred (start 2D)
- Hierarchy detection stays Sprint 5 (not earlier)

**RAMS:** Endorsed. Each sprint delivers user value.

---

### R9: v0.1 Success Criteria

Ship when these four user flows work:
1. I can read about the research and understand the question (Home)
2. I can explore 22k+ surveyed rules visually (Atlas)
3. I can deep-dive any rule to see its behavior (Detail)
4. I can resume the survey to grow the dataset (Lab)

**Don't ship:**
- Collections (manually managing favorites)
- Compare (side-by-side rule comparison)
- Hierarchy detection (beyond period)
- 3D visualization
- Topology support

These are v0.2.

**BROOKS:** Endorsed. Conceptual integrity = four flows, no more.

---

### R10: Migration Strategy for CSV to IndexedDB

Sprint 1 must migrate existing `survey-results.csv` (22,590 rules) to IndexedDB.

**Approach:**
1. Write a one-time migration script (run in browser console or as npm script)
2. Parse CSV using Papa Parse or similar
3. Batch insert into Dexie using `bulkAdd()` in chunks of 1000 (avoid memory issues)
4. Verify: check count, spot-check rules (B3/S23 should exist with correct metrics)

**Post-migration:**
- Keep CSV export as backup option (File → Export CSV)
- Survey runner writes to IndexedDB directly (no more CSV intermediate)

**HICKEY:** Endorsed. One-time migration, then IndexedDB is source of truth.

---

**VICTOR:** One final principle: the tool should be *delightful to use*. Not just functional. When I hover a rule, show me a tiny animation preview. When I click, animate the transition to Detail page. Small touches matter.

**RAMS:** Bret, delight is not opposed to minimalism. It's the absence of friction. Fast interactions, clear feedback, no waiting. That's delightful.

**TUFTE:** And beautiful data. The Atlas should be aesthetically coherent. Choose a colormap carefully - not rainbow (perceptually dishonest), but a diverging scale that maps to meaning.

**BROOKS:** Agreed. Conceptual integrity includes aesthetic integrity. But these are implementation details, not architecture decisions.

**WOLFRAM:** Let me close with this: you're mapping a space. The map becomes the tool for navigation. When the survey completes, the Atlas reveals where complexity lives in rule space. That's the goal.

**ALL:** Endorsed.

---

## Summary of Recommendations

1. **Four-Sprint v0.1 Plan**: Data → Atlas+Home → Detail → Lab (6-8 weeks)
2. **IndexedDB Schema**: Two stores (rules, collections), extensible for topology
3. **2D Atlas First**: Lambda vs Dimension, colored by gamma, defer 3D
4. **No Interest Scoring in v0.1**: Manual exploration, add scoring later
5. **Hierarchy MVP**: Period detection + free-text notes
6. **Spike Plotly vs Scatter-GL**: Choose based on performance benchmark
7. **Communicate Incomplete Data**: Show coverage %, transparency about sparse sampling
8. **Reordered Sprint Plan**: Home earlier (Sprint 2), Lab later (Sprint 4)
9. **v0.1 = Four User Flows**: Home, Atlas, Detail, Lab - ship when these work
10. **CSV Migration**: One-time batch import, then IndexedDB as source of truth

---

## Tensions Preserved

**T1: Minimalism vs Completeness**
- Rams: Ship 3 pages (Atlas, Detail, Lab)
- Brooks: Ship 4 pages (add Home for context)
- Resolution: Include Home, but keep it lightweight (markdown)

**T2: 2D vs 3D Visualization**
- Tufte: 2D small multiples always better
- Victor: 3D interactive has value for embodied exploration
- Resolution: Start 2D, revisit 3D in v0.2 based on user feedback

**T3: Schema Flexibility vs Simplicity**
- Liskov: Design for multiple topologies now
- Rams: Design for current needs only
- Resolution: Simple schema with documented extension path (additive, no migration)

**T4: Algorithmic vs Manual Hierarchy Detection**
- Wolfram: Algorithmic detection required for research validity
- Tufte: Manual annotation is faster and more honest
- Resolution: Start manual, add algorithmic in Sprint 5

---

**Panel Concludes.**
