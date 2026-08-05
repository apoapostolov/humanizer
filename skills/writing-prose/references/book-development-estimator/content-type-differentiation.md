# Content Type Differentiation

Books contain different kinds of content that have very different costs and optimal strategies when using AI for writing.

## Two Main Content Types

### Narrative / Prose Content
- Sustained prose, scenes, character moments, descriptions, vignettes.
- Primary axes: Creativity (voice, tone, flow) + some Stable (grammar, clarity).
- Generation characteristics: High output volume per call. Models need strong long-context coherence and stylistic control.
- Polish characteristics: Medium volume of micro-edits. Voice consistency is critical.
- Typical multipliers: Higher regeneration on first passes, then moderate.
- Best model usage: Strong creativity-focused models for generation/voice work. Cheap models can handle much of the later grammar/flow polish.

### Structured / Procedural Content
- Tables, lists, procedures, mechanics descriptions, rules, systems breakdowns, sidebars, reference sections.
- Primary axes: Reasoning (logic, balance, consistency of rules) + **Heavy Stable** (precise formatting, MD structure, "do not break the table", instruction following).
- Generation characteristics: Often lower raw word volume but much higher precision demand. Output must be valid Markdown (tables especially are fragile).
- Polish characteristics: Very high volume of small fixes. "Make this table consistent with the others", "fix alignment", "add proper headers".
- Typical multipliers: Can be high on the stable side because one broken table often triggers multiple cheap fix calls.
- Best model usage: Strong reasoning models for the logic/system invention. **Aggressively cheap/precise models** for the formatting and mechanical polish. Using expensive models for table cleanup is usually wasteful.

## Impact on Estimation and Routing

When classifying a project or section, note the ratio of narrative vs structured content.

**Rough guidelines for cost impact**:
- Pure narrative book: Higher creativity spend early, then 40-50% can shift to cheap models for polish.
- System-heavy or reference-heavy book (many tables/procedures): Reasoning spend early + significantly higher stable/micro-polish volume. Can easily be 60%+ of later AI calls on cheap models.
- Mixed (typical RPG supplement or detailed fiction with mechanics): Plan for both.

**Adjustments to multipliers** (see token-model.md):
- Structured sections often need an extra 0.3–0.8× on the stable side due to formatting iteration.
- Narrative sections tend to have higher "major rewrite" multiplier if voice is being refined.

## Detection Heuristics in the Skill

The estimator should look for signals:
- High density of Markdown tables (`|...|`), numbered/bulleted procedures, or "Mechanics" / "Rules" headings → more structured.
- Long paragraphs, dialogue, scene descriptions → more narrative.
- Files or chapters whose word count is dominated by lists/tables vs flowing prose.

This affects:
- Axis weighting (more Stable work expected).
- Recommended model mix.
- Expected percentage of work routable to cheap models.
- Polish phase effort.

## Recommendations

1. For structured content, explicitly separate the "think the logic" pass (strong reasoning model) from the "format it cleanly in MD" pass (cheap precise model).
2. When doing global consistency, treat narrative voice consistency and rules consistency as two different sub-passes.
3. Track in real runs how many cheap-model calls were spent on tables vs prose — this data is extremely valuable for future estimates.

Update this reference with measured ratios and cost deltas from actual projects.
