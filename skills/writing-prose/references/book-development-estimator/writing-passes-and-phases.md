# Writing-Specific Workflow Phases & Cost Drivers

This reference models the actual process of writing long-form books with AI, which differs significantly from agentic or tool-calling workflows.

## Core Difference from Agentic Work

**Agentic/tool-using patterns**:
- Many short tool calls.
- Small, frequent LLM responses.
- High branching and decision overhead.
- Context often resets or changes rapidly.

**Book writing patterns** (the reality):
- Generate large contiguous swaths of text (thousands of words at once).
- Human (or model) reads the large block.
- Targeted rewrite of the swath or subsections.
- Many small surgical changes (grammar, clarity, MD structure, consistency fixes).
- Small changes are frequently routed to cheaper/faster models.

This means:
- Much higher output-token volume per call.
- Significant re-ingestion of previously generated text for review/rewrite.
- Opportunity for aggressive model tiering on micro-work.
- Different caching dynamics (stable skills + bible + "current version" of sections).

## Standard Writing Phases

| Phase | Description | Typical Token Profile | Primary Need | Recommended Model Tiering | Iteration Frequency |
|-------|-------------|-----------------------|--------------|---------------------------|---------------------|
| 1. Planning & Gap Analysis | High-level outline, chapter-by-chapter plan, identify scaffolds | High input (full project scan), medium output (plan document) | Reasoning + overview | Strong reasoning or balanced long-context | 1–2 times |
| 2. Initial Generation / Expansion | Create new content from scaffolds or expand thin sections | Medium input + **Very High output** | Creativity or Reasoning (depending on section) | Best model for the dominant axis | 1 (sometimes 2) |
| 3. Self-Critique / Review | Model reads generated text + original requirements and produces critique | High input (generated + context) + low-medium output | Reasoning + some creativity | Mid-to-strong model | 0–1 per major section |
| 4. Major Rewrite | Targeted re-generation of sections based on critique or new requirements | High input + High output | Mixed (often creativity + reasoning) | Strong model for quality sections; mid for others | 1–3 times |
| 5. Global Consistency Pass | Ensure voice, logic, cross-references, world consistency | Very high input (multiple sections) + medium output | Stable + Reasoning | Model good at long-context consistency | 1–2 project-wide |
| 6. Micro-Polish & Structure | Grammar, clarity, sentence-level fixes, MD formatting, tables, lists, layout | Low input per chunk + low output | Stable / Precise instruction following | **Cheap, fast models** (often different provider) | Many times per section |
| 7. Integration & Final Assembly | Merge sections, fix seams, final read-through | Medium input + low-medium output | Stable + light creativity | Mid or cheap model | 1 |

## Key Quantification Levers Specific to Writing

### 1. Output Multiplier per Content Type
- **Scaffold / ideation sections**: 3.0 – 4.5× final words (high regeneration)
- **Rough draft**: 1.8 – 2.8×
- **Developed draft**: 1.4 – 2.0×
- **Polished sections**: 1.1 – 1.3× (mostly micro-edits)

### 2. Micro-Polish Percentage
In real writing projects, a large fraction of later work is small changes:
- Grammar, flow, word choice: 30–50% of total AI calls in polish phase
- MD structure / tables / lists: 10–20%
- These can almost always use cheaper models.

Rule of thumb: After the first 1–2 major passes, 40–60% of remaining AI work can be routed to cost-efficient models.

### 3. Re-ingestion Overhead
When rewriting, you often re-send:
- The section being edited
- Nearby context
- The previous version of the section (for diff awareness)
- Plan + grounding

This can add 30–80% extra input tokens per rewrite pass if not managed with deltas.

### 4. "Stable Thinking" as a Third Axis
In addition to:
- **Creativity** (voice, prose beauty, narrative invention)
- **Reasoning** (systems, logic, balance, research synthesis)

Add:
- **Stable / Precise / Reliable** (low drift, excellent instruction following, consistency enforcement, surgical edits, MD formatting without breaking structure).

Models strong at "stable" work are often excellent at:
- Following complex multi-part instructions
- Making only the requested changes
- Maintaining exact formatting
- Grammar and mechanical polish

These tasks frequently do **not** require the most expensive models.

### 5. Context Strategy Impact on Cost
- **Full re-ingest every time**: Highest cost, safest coherence.
- **Section + plan + delta**: 40–70% cheaper on input for rewrite passes.
- **Skills + bible as permanent prefix + small working set**: Best for long projects.

## Recommended Hybrid Workflow (Typical for Mixed Books)

1. Strong model (creativity or reasoning as needed) for initial generation of hard/new sections.
2. Mid or same strong model for major rewrites of important content.
3. Cheap/fast model for:
   - All grammar and flow polish
   - MD formatting fixes
   - Simple consistency checks (after a strong model has done the hard work)
   - Small structural adjustments

4. Occasional strong model for global voice or logic consistency when drift is detected.

## How to Use This in Estimation

When running the estimator:
- Ask for (or auto-detect) % of content at each maturity level.
- Estimate how much work will go through micro-polish vs major rewrite.
- Apply different model cost tiers and different multipliers per phase.
- Factor in aggressive use of cheap models for the "small changes" portion.

This is the single biggest lever for realistic cost prediction in AI book writing.

## Data to Track for Better Future Estimates
- Tokens per phase per chapter
- Number of major rewrites per section
- % of calls that were "micro" vs "major"
- Actual cache hit rates when using delta strategies
- Which model was used for which phase and perceived quality

Update this reference when new real project data is available.
