# Expert Selection - Panel 01: Architecture

## Investigation
**Question:** How should the Cells research laboratory be architected? Sprint ordering, data schema, visualization approach, hierarchy detection, and MVP definition.

## Panel Type
**ARCHITECTURE PANEL** - Design system structure, components, and their relationships

## Selected Experts (7)

### Software Architecture & Systems
1. **Fred Brooks** - System design, conceptual integrity
   - Authored "The Mythical Man-Month"
   - Principles: conceptual integrity, plan to throw one away
   - Will challenge scope creep and over-engineering

2. **Rich Hickey** - Immutability, data-first design
   - Creator of Clojure
   - Principles: simple made easy, data as first-class, immutability
   - Will advocate for schema simplicity and data accessibility

3. **Barbara Liskov** - Abstraction, interfaces
   - Turing Award winner
   - Principles: clean abstractions, substitutability
   - Will ensure components have clean boundaries

### Product & Design
4. **Dieter Rams** - Functionalism, "less but better"
   - Industrial designer
   - 10 principles of good design
   - Will push for minimal MVP, resist feature bloat

5. **Edward Tufte** - Information visualization
   - Pioneer of data visualization
   - Principles: data-ink ratio, small multiples
   - Will guide the Atlas visualization decisions

### Science & Research Tools
6. **Bret Victor** - Tools for thought, explorability
   - Pioneer of interactive explanatory systems
   - Principles: seeing the system, direct manipulation
   - Will push for intuitive exploration over dashboards

7. **Stephen Wolfram** - CA research, empirical exploration
   - "A New Kind of Science"
   - Built WolframAlpha and Mathematica
   - Will provide perspective on surveying vast rule spaces

## Why These Experts?

### Tensions to Surface
- **Simplicity vs Power**: Rams/Brooks vs Wolfram/Victor (minimal MVP vs rich exploration)
- **Data vs Computation**: Hickey (store everything) vs Brooks (pragmatic constraints)
- **2D vs 3D visualization**: Tufte (small multiples) vs Victor (interactive 3D)
- **Schema rigidity**: Liskov (clean abstractions) vs Hickey (flexible data)

### Expected Conflicts
1. Sprint ordering: Should schema come before visualization? Or build visualizations to discover what data we need?
2. Interest scoring: Algorithmic (Wolfram) vs let humans discover (Victor)?
3. Atlas approach: Statistical overview (Tufte) vs interactive playground (Victor)?

## What I Hope to Learn
1. Concrete IndexedDB schema recommendation
2. Sprint reordering rationale
3. 2D vs 3D Atlas decision criteria
4. Minimum viable feature set for v0.1
5. How to handle incomplete survey data elegantly
