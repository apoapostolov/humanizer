# Model Selection Heuristics for Book Development (Three Axes)

This reference codifies how to choose or recommend models for manuscript development work, informed by evaluation data and general long-form writing patterns.

## The Three Axes

1. **Creativity axis** (narrative, fiction, voice, examples, vignettes, sustained prose tone)
   - Priority: long context coherence, natural prose rhythm, ability to maintain consistent voice and style across very long documents.
   - Secondary: cost efficiency for volume (many rewrite passes).

2. **Reasoning axis** (systems, rules, balance, logic, research synthesis, friction analysis, integration of complex ideas)
   - Priority: structured thinking, consistency, ability to invent or extend coherent logic while respecting existing constraints.
   - Secondary: long context for holding the full grounding documents and manuscript in mind.

3. **Stable / Precise / Reliable axis** (grammar, micro-edits, MD formatting and structure, surgical changes, instruction following, low drift, consistency enforcement)
   - Priority: excellent adherence to complex instructions, making *only* the requested changes, preserving exact structure and formatting.
   - These tasks frequently do **not** require the strongest or most expensive models.
   - Good "stable" models are often fast and cheap while being extremely reliable for mechanical and structural work.

Most projects are **mixed** across all three axes. Use the dominant need per phase or section.

## General Heuristics by Axis and Phase

### Creativity / Narrative / Voice Work
- Strong long-context models with excellent coherence for long documents.
- Best for initial generation of narrative, voice work, and high-stakes prose.
- Can be expensive — reserve for where it matters most.

### Reasoning / Systems / Logic / Research Synthesis
- Models strong at structured reasoning and maintaining complex constraints.
- Best for inventing or extending systems, balance work, deep research integration.
- Often benefits from top-tier reasoning capability during the hard thinking phases.

### Stable / Precise Work
- Fast, cost-efficient models with high instruction adherence.
- Excellent for:
  - Grammar and flow polish
  - MD formatting, tables, lists
  - Small targeted edits ("only change X")
  - Consistency passes after the hard work is done
- Using strong models here is usually wasteful.

## Phase-Based Recommendations

See also `references/hybrid-model-strategies.md` and `references/writing-passes-and-phases.md`.

- **Initial generation of new content**: Best model for the dominant axis of that section (creativity or reasoning).
- **Major rewrites of important material**: Strong model matching the axis.
- **Global consistency (voice or logic)**: Strong or mid-tier model good at long context + stability.
- **Micro-polish, grammar, structure, small fixes**: Cheap precise models (default choice).
- **Planning and gap analysis**: Strong reasoning or balanced long-context model.

## How to Use Evaluation Data
1. Load `agent-model-evaluation`.
2. Consult purpose-specific tracks (creative writing, long-form narrative, reasoning, instruction following / stability).
3. Cross-reference with current pricing, context limits, and observed behavior on large outputs.
4. Respect cost governance — do not default to the most expensive tier for stable/micro work.

## Supporting Skills Interaction
- Voice and style grounding skills → favor models good at sustained natural prose (creativity).
- System or design logic skills → stronger reasoning models.
- Any skill that emphasizes "make only these changes" or "preserve formatting" → points toward strong stable/precise models.

The estimator should surface when supporting skills encode preferences for particular model characteristics.

Update this file when evaluation data or observed patterns shift significantly.
