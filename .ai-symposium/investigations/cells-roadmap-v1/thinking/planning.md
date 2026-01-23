# Planning - Cells Roadmap Investigation

## Investigation Goal
Answer Yianni's seven concrete questions about architecting the Cells research laboratory:
1. Is the sprint order correct?
2. What should the IndexedDB schema look like?
3. How to calculate an interest score?
4. What's the MVP for hierarchy detection?
5. Should Atlas be 2D or 3D?
6. How to handle incomplete survey (8.6% done)?
7. What's the simplest path to v0.1?

## Why Architecture Panel?
This is fundamentally a system design question. Not exploration (we know what we're building), not technical feasibility (already prototyped), not critical review. It's "what are the components and how do they fit together?"

Architecture Panel fits: need to design schema, sprint structure, component boundaries, and quality attributes (performance, extensibility).

## Expert Selection Strategy
Mix of:
- **System architects** (Brooks, Liskov) - structure and integrity
- **Data-first thinkers** (Hickey) - schema design
- **Minimalists** (Rams) - scope control
- **Visualization experts** (Tufte, Victor) - Atlas design
- **Domain specialist** (Wolfram) - CA research perspective

Expected tensions:
- Minimalism (Rams: ship 3 features) vs Completeness (Brooks: include context)
- 2D (Tufte: always better) vs 3D (Victor: interactive has value)
- Simple schema (Brooks: current needs) vs Flexible schema (Hickey: anticipate topology)

## Panel Structure
**Hours 1-6 (Grounding):** What is this system? What's the conceptual center?
**Hours 6-12 (Exploration):** Address each of the 7 questions systematically
**Hours 12-18 (Convergence):** Resolve tensions, synthesize recommendations
**Hours 18-24 (Recommendations):** Concrete, numbered recommendations

## Research Done
- Searched for CA exploration tools (Golly, MCell precedents)
- Searched for IndexedDB performance patterns (Dexie best practices)
- Searched for 3D scatter libraries (Plotly, Scatter-GL, Regl, Deck.gl)
- Documented in sources.json and research-log.md

## Expected Outcomes
- 8-10 concrete recommendations (R1-R10)
- 3-4 tensions preserved (T1-T4)
- Clear sprint plan for v0.1
- Schema specification
- Library choice guidance (or spike recommendation)
- Scope boundary (what's in v0.1 vs v0.2)

## Success Criteria
- All 7 questions answered concretely
- Recommendations are actionable (not abstract principles)
- Sprint plan is implementable (no hand-waving)
- Schema can be coded immediately
- Tensions are steelmanned (both sides have merit)
