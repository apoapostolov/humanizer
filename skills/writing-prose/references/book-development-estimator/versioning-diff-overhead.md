# Versioning & Diff Overhead

When rewriting sections, a common and powerful technique is to keep the previous version in context so the model can make targeted changes ("here is the current text, produce a revised version that...").

This creates measurable extra input cost that is often underestimated.

## Sources of Versioning Overhead

1. **Previous full version of the section being edited**
   - Adds roughly 1× the size of the section in input tokens per rewrite pass.
   - Common pattern: "Here is v1. Rewrite it according to this plan."

2. **Surrounding context + previous version**
   - To maintain continuity, writers often include 1-2 adjacent sections or the previous full chapter.
   - Can easily add another 0.5–1.5× the target section size.

3. **Explicit diff or change log**
   - Some workflows send a summary of what changed since last version.
   - Lower overhead than full previous text, but still non-zero.

4. **Multiple historical versions** (rare but expensive)
   - Keeping v1, v2, and current draft for comparison.

## Typical Overhead Ranges (per major rewrite pass)

- Minimal (only send the section + plan): +30–50% input tokens
- Standard (section + previous version + limited surrounding): +70–120% input tokens
- Heavy (full chapter context + previous + plan + notes): +150%+ input tokens

For a 4,000 word section being rewritten:
- Base section: ~5,400 tokens
- With standard versioning: total input for that call can jump to 10k–13k+ tokens just for context.

## Impact on Overall Project Cost

If a project has many sections that go through 2–3 major rewrites:
- Versioning overhead can add 20–40% to total input tokens across the project.
- This is almost entirely on the input side (expensive if using high input-price models).

## Mitigation Strategies (Ranked by Effectiveness)

1. **Delta-only prompting**: Send only the specific paragraphs or subsections that need change + instructions. "Edit only this paragraph: [quote it]."
2. **Plan-first**: Produce a detailed change plan in one call, then do the actual edit in a follow-up that references the plan instead of the full old text.
3. **Use cheap models for the edit step**: Once the strong model has decided *what* to change, a cheaper precise model can often execute the edit if the instruction is clear.
4. **External diff tools**: Generate diffs outside the LLM and feed a compact patch.
5. **Versioned artifacts**: Keep previous versions in separate files and only load the exact needed slice.

## How the Estimator Should Account for This

- Ask for or estimate the average number of major rewrites per section.
- Apply a versioning overhead factor (default 0.7–1.0× additional input per rewrite pass when full previous version is included).
- Recommend mitigation strategies and show the cost difference between "full versioning" vs "delta/plan" approaches.
- Note that structured content often tolerates smaller diffs better than long narrative (easier to quote exact table rows).

Update with real measured overhead numbers from actual rewrite sessions.
