# Generic Worked Example

This is an abstracted worked example of using the estimator on a typical long-form Markdown manuscript project. It incorporates the three-axis model and writing-specific phases.

## Project Snapshot (abstracted)
- Total: ~23 Markdown files.
- Word count: ~53,000 words (~71k tokens).
- Scaffolds identified: Multiple sections (roughly 30–40% of the manuscript) that are very short (300–400 words), explicitly marked as scaffolded or containing placeholders.
- Maturity mix: ~35% scaffold, 40% rough draft, 25% developed draft.
- Supporting skills: Voice/style grounding + system/design logic skills in the repo's `/skills` directory.
- Core grounding document: A few-thousand-word specification.

## Work Classification (Three Axes)
- **Creativity**: Significant voice and narrative work needed in new/expanded sections.
- **Reasoning**: New systems, logic, and integration required in scaffolded chapters.
- **Stable**: Large amount of grammar, clarity, MD structure, and consistency work expected (especially on structured content like tables and procedures).
- Dominant needs vary by section and phase.

## Target
- +50% content → approximately 79k–80k words final.
- Alternative: Specific final page count (e.g. 250 pages at average art density).

## Phase-Aware Model Recommendations
- Planning & initial generation of new content: Strong model matched to dominant axis per section (creativity or reasoning).
- Major rewrites: Strong model for core sections.
- Global consistency: Strong or mid-tier model good at long context.
- Micro-polish, grammar, MD fixes, small edits: Cheap, fast, high-instruction-following models (40–60% of later work).

## Token & Cost Estimate (Hybrid Approach Example)

Using phase-aware multipliers and hybrid routing:
- Major generation/rewrite work (strong models): Significant but limited portion.
- Micro-polish and small changes (cheap models): High volume.
- Planning + consistency passes: Mid-to-strong.
- Realistic cache on skills + grounding + plan.

**Cost ranges** (representative premium + cheap model mix with caching):
- Optimistic (excellent caching + aggressive hybrid routing): $9 – $14
- Realistic: $14 – $24
- Loose (minimal use of cheap models): $30+

Switching more bulk work to strong cost-effective long-context models (while still using cheap models for micro work) can further reduce the realistic total.

## Lessons Captured
- Scaffold percentage and structured content volume are major cost drivers.
- The biggest savings come from proper hybrid routing (strong models for hard thinking, cheap models for volume mechanical work).
- Selective skill loading + delta/context strategies have large effects on input costs.
- Planning pass that produces clear phase-by-phase guidance pays for itself.
- Re-ingestion of generated text for review/rewrite is a hidden but significant factor.

Add new abstracted runs or measured data here as they become available.
