# Investigation Planning - Cells Research Platform

## Context

Yianni completed an architecture investigation (cells-roadmap-v1) that resulted in a conservative v0.1 plan:
- 4 sprints: Data layer, Atlas+Home, Detail, Lab
- IndexedDB schema, 2D visualization, basic metrics
- Defer: Collections, 3D, topology, advanced hierarchy detection

**Now:** Yianni has articulated a much bigger vision:
- **Extensible surveys:** Users can add new metrics, not just run existing ones
- **Layered analysis:** Filter → Analyze → Filter deeper → Emerge patterns on patterns
- **Fundamental research:** Study how topology, locality, grid tiling affect emergence
- **Not just "find cool CAs"** - understand the design space of possible universes

## Questions to Answer

1. **Home page pitch:** How should this be communicated?
2. **Architecture:** What does "extensible surveys" mean technically?
3. **UI structure:** How is "layered analysis pipeline" represented?
4. **Sprint backlog:** Should v0.1 change, or is this v0.2+?
5. **Topology timing:** Move topology support earlier?
6. **Dual goals:** Balance "find gems" vs "understand fundamentals"

## Panel Plan

### Panel 1: Exploration (this panel)
**Goal:** Map the territory. What does this vision mean? What are the implications?

**Experts:** Wolfram, Bateson, Victor, Kay, Hickey, Brooks, Rams

**Questions:**
- What IS this system? (mental model)
- What does "extensible surveys" mean architecturally?
- How does "layered analysis" work?
- What's the right roadmap given this vision?

**Expected output:**
- Mental model clarity
- Architecture directions (not detailed design)
- Revised sprint structure
- Home page messaging framework

### Panel 2: Technical (likely next)
**Goal:** Assess feasibility. How is extensibility actually implemented?

**Possible focus:**
- Metrics-as-code vs metrics-as-config
- Plugin architecture
- Security/sandboxing
- Performance implications

### Panel 3: TBD
Options:
- Critical panel (stress-test the vision)
- Design panel (UI for layered analysis)
- Synthesis (if 2 panels are enough)

## Success Criteria

Investigation succeeds if:
1. Clear mental model for what Cells is
2. Home page pitch that captures the vision
3. Concrete architecture approach for extensibility
4. Revised sprint backlog with rationale
5. Decision on topology timing (now vs later)

## Constraints

- Yianni is solo dev on sabbatical
- Current codebase is Svelte + IndexedDB + WebGL
- 22,590 rules already surveyed (8.6% of Life-like space)
- Research goal is real: understand emergence across rule spaces
