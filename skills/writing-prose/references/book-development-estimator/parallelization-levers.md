# Parallelization Levers in Book Writing

Not all writing work must be done sequentially. Some phases and sections can be parallelized across chapters or content types, while others require global context and must be sequential.

## Sequential Work (Must Usually Be Done in Order or With Global Context)

- Planning & overall structure
- Voice consistency across the whole book
- Major system/logic consistency (especially interconnected mechanics)
- Global integration and seam fixing
- Final polish that depends on the complete manuscript being stable

These benefit from strong models with large context and are harder to parallelize.

## Parallelizable Work

- Initial generation or expansion of individual chapters/sections (once the plan exists)
- Micro-polish and grammar fixes on already-approved sections
- Formatting and MD structure fixes on independent tables or procedures
- Local research or example writing within a contained section
- Self-critique or targeted rewrites on specific chapters after the global plan is locked

These can often be farmed out to multiple model calls (or even multiple people + models) with relatively low coordination cost.

## Structured vs Narrative Impact on Parallelization

- **Narrative**: Voice and tone consistency is hard to parallelize. Best to do major narrative work sequentially or with very strong global context.
- **Structured content**: Tables and procedures within different chapters can often be developed more independently once the core rules are set. Higher parallelization potential.

## Quantification for Cost Estimation

Parallel work has two main effects on cost:
1. **Calendar time reduction** (not direct token cost, but affects how many "thinking" passes the human does).
2. **Context efficiency**: When you can work on a section with only local + plan context instead of the full book, input tokens per call drop significantly.

Rule of thumb:
- Fully sequential global passes: high input tokens (full manuscript + skills).
- Parallel section work: 40–70% lower input per call, but you pay later for integration/consistency passes.

## Recommendations for the Estimator

When building the plan:
- Identify which portions of the target expansion can be parallelized after the initial planning pass.
- Apply lower per-call input estimates for parallelizable work.
- Add a dedicated "integration tax" (one or two global passes at the end) when a high percentage of work was done in parallel.
- Suggest batching: generate several independent sections in parallel, then do one consistency pass.

## Practical Levers

- Lock the high-level plan and voice bible early → enables parallel generation.
- Use strong model for the plan and core systems → then parallel cheap work on the rest.
- For very large books, consider "wave" development: finish and lock a block of chapters before moving to the next block.

Update with real observations about what work could actually be parallelized without creating expensive cleanup later.
