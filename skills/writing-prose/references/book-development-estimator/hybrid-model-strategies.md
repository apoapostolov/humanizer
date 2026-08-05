# Hybrid Model Strategies for AI Book Writing

This reference provides practical rules for routing different kinds of book writing work to the most appropriate (and cost-effective) models.

## The Three Axes

1. **Creativity Axis**
   - Narrative voice, prose quality, emotional tone, examples, vignettes, "feels right."
   - Benefits from models with excellent long-form coherence and stylistic range.

2. **Reasoning Axis**
   - System design, logic, balance, mechanics, research synthesis, cause-effect, player psychology (or equivalent in fiction).
   - Benefits from models strong at structured thinking and maintaining complex constraints.

3. **Stable / Precise Axis** (new explicit axis)
   - Grammar, clarity, sentence-level fixes.
   - MD formatting, tables, lists, structure without breaking existing layout.
   - Small targeted edits ("change only X").
   - Consistency enforcement on already-written text.
   - Excellent instruction following with low drift.
   - These tasks often do **not** need the strongest (or most expensive) model.

## Routing Principles

**Default Strategy (Recommended for most projects)**

| Work Type | Primary Axis | First Choice | Good Alternative | Cheap Tier |
|-----------|--------------|--------------|------------------|------------|
| Initial generation of new narrative | Creativity | Strong creative long-context | Balanced strong model | — |
| Initial generation of new systems/logic | Reasoning | Strong reasoning model | Balanced strong model | — |
| Major rewrite of important sections | Mixed | Strong model matching dominant axis | — | — |
| Global voice consistency | Creativity + Stable | Strong creative | Mid creative | — |
| Global logic / system consistency | Reasoning + Stable | Strong reasoning | Mid | — |
| Grammar, flow, word choice polish | Stable | Cheap fast model | Mid-tier | Strong only if critical |
| MD structure / tables / lists fixes | Stable | Cheap model excellent at following formatting instructions | Mid | — |
| Small surgical changes ("fix only this") | Stable | Cheap precise model | — | — |
| Final read-through / seam fixing | Stable + light creativity | Mid or cheap | — | — |

## When to Use the Expensive Model

Use a top-tier model when:
- The section is core to the book's identity (opening, key setpiece, central mechanic).
- Previous attempts with cheaper models produced drift or loss of voice.
- The work requires inventing something genuinely new that must integrate with everything else.
- You're doing the very first pass on a very complex or high-stakes section.

## When to Aggressively Use Cheap Models

Route to cheap/fast models for:
- Any work after the second major pass on a section.
- Pure mechanical polish.
- "Make the MD clean and consistent with the rest of the book."
- "Fix grammar and awkward phrasing without changing meaning."
- Consistency checks where the hard thinking has already been done.

Many writers discover that 40-60% of total AI spend in a full book project can be on cheap models without meaningful quality loss, **if** the strong models did the heavy lifting first.

## Stable Thinking Models

Look for models that excel at:
- Very high instruction adherence.
- Producing output that differs from input only in the requested ways.
- Maintaining exact structure and formatting.
- Low hallucination on "do not change X" constraints.

These are often (but not always) different from the absolute best creative or reasoning models.

## Practical Hybrid Patterns

**Pattern A — "Strong First, Cheap Later" (Most Common Recommendation)**
1. Use best available model for planning + first full generation/expansion.
2. Use same or slightly lower for 1 major rewrite pass.
3. Switch the majority of remaining work to cheap/precise models.

**Pattern B — "Section Tiering"**
- High-importance chapters/sections: strong model throughout.
- Supporting chapters: strong for first pass, cheap for polish.
- Filler / reference sections: mid or cheap from the start.

**Pattern C — "Two-Model Parallel"**
- Strong model generates or rewrites creative/reasoning content.
- Cheap model immediately runs a polish pass on the output (separate call).

## Cost Impact

Using a proper hybrid strategy can easily reduce total project cost by **30–60%** compared to using one strong model for everything, while maintaining (or even improving) final quality, because:
- Strong models are used where they move the needle.
- Cheap models handle the high-volume mechanical work efficiently.

## How the Estimator Should Use This

When estimating:
- Detect or ask for the maturity mix of the manuscript.
- Apply different model costs to different phases.
- Assume 40–60% of post-first-draft work can use cheap models (adjust based on project).
- Explicitly call out the savings from hybrid routing in the output.

Update with observed results from real projects.
