# MD-Specific Friction

Writing in Markdown (especially for books with tables, procedures, and structured content) introduces extra cost and iteration that pure prose work does not have.

## Common Sources of Extra Tokens and Calls

1. **Table Construction and Repair**
   - Getting column alignment, headers, and pipe characters right.
   - One small change in a table often requires re-outputting the whole table.
   - Models frequently break tables on the first try when making other edits.

2. **List and Procedure Formatting**
   - Numbered steps, nested bullets, consistent indentation.
   - Easy to drift between sections.

3. **Heading Hierarchy and Cross-References**
   - Maintaining consistent heading levels.
   - Updating internal links or references when sections move.

4. **Code Blocks, Sidebars, and Callouts**
   - Preserving exact formatting while changing content.

5. **"Only Change X" Violations**
   - Instructions like "fix only this sentence" frequently cause the model to also reformat nearby tables or lists.

## Cost Impact

- Structured content can require 1.5–3× more cheap-model calls than equivalent narrative prose purely for formatting hygiene.
- A single "make this consistent" global pass on a table-heavy book can generate hundreds of small fix calls.
- The friction is almost entirely on the Stable axis.

## Quantification Guidelines

- For books with >25–30% structured content, add a "MD friction multiplier" of +20–50% to the micro-polish phase token estimates.
- Expect that 30–60% of all cheap-model work on system-heavy books will be MD/structure fixes rather than content changes.
- Narrative-only books have much lower MD friction.

## Mitigation Strategies

- Strong instruction: "Output only the changed paragraphs or tables. Do not reformat anything else."
- Separate passes: First do the content/logic change, then a dedicated cheap "format cleanup" pass.
- Use external tools or scripts for final MD linting where possible (reduces LLM calls).
- Keep a style guide for tables and lists in the supporting skills so the model has a clear target.

## How the Estimator Should Handle This

- When the project has significant tables/procedures, increase the estimated percentage of work that can/should be routed to the cheapest precise models.
- Call out MD friction as a separate line item in cost breakdowns.
- Recommend explicit "format only" prompts in the caching patterns and prompt skeletons.

Update with measured data: e.g. "In this table-heavy project, 47% of all cheap-model tokens were purely formatting fixes."
