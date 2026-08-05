# LLM Rewrite & Extension Cost Patterns (ingest-reasoning-rewrite)

Session-derived concrete patterns for estimating OpenRouter (or similar) costs when the user specifies limited agentic loops and a mostly ingest-reasoning-rewrite process for large existing documents.

## Token Estimation from Markdown Sources
- Use terminal for ground truth on .md trees:
  - `find . -name "*.md" -type f -exec wc -w {} + | awk '{sum+=$1} END {print "Total words: " sum}'`
  - `find . -name "*.md" -type f -exec cat {} + | wc -c` for raw chars.
  - Python refinement: `len(content)`, `len(content.split())`, `len(re.findall(r"\b\w+\b", content))` for alphanum words.
- Rough proxies (English + markdown):
  - chars / 4
  - words × 1.33
- Example (Tales of the Old West 2e / Book 04 "Trials of the Old West"):
  - 52,756 words
  - 286,942 chars
  - ~70k–72k tokens
- Scaffolded sections are dramatically smaller (~320–375 words each) vs drafted core chapters (3.5k–5k words). This drives extension volume.

## Process Modeling for Cost
When user says "mostly ingest - reasoning - rewrite" (no heavy agentic tool calling):

1. **Ingest + planning pass(es)**: Full book + design bible + instructions. 1–2 calls. Input ~source tokens + overhead. Output: analysis, gap report, extension plan.
2. **Chunked rewrite passes**: Rewrite drafted sections + turn scaffolds into full chapters. Input includes source + prior rewritten + rules. Output: rewritten + extended prose/tables/examples.
3. **Extension generation**: Dedicated passes for the +50% new material (new subsystems, deeper examples, integrations, future-list items).
4. **Polish / consistency**: 1–2 large passes over new draft.
- Output volume ≈ (original word count × 1.0 for rewrite) + (original × 0.5 for extension) + 20–50% overhead for intermediates/reasoning.
- Input volume higher due to repeated large context (mitigated by prompt caching).

## OpenRouter Pricing Factors (claude-opus-4.6 example)
- List price: $5 / M input, $25 / M output. 1M context, flat (no long-context surcharge).
- Effective with caching (common for repeated source ingest): weighted avg input often ~$2.14/M (provider-dependent; cache reads ~0.1x or $0.50/M).
- For a ~53k word source (~72k tokens) + 50% extension:
  - Optimistic/streamlined + good caching: $6–12 total.
  - Realistic high-quality (multiple coherence passes, rich examples): $12–25.
  - Higher if heavy revision loops or full re-ingests without caching.
- Quality override common for voice/mechanics fidelity (RPG design, consistent western prose). Flag explicitly with fallback recommendation.

## Content Analysis Patterns
- Search for structural status: "scaffold", "Status: Scaffolded", "EPIGRAPH PLACEHOLDER", "in development", "drafted".
- Cross-reference gaps (e.g. "Standoff or Siege" referenced in justice/train chapters but absent at scene level).
- README partitions (Core vs Scaffolded) and intro "the book is growing" statements reveal scope vs delivery mismatch.
- Use to quantify extension opportunity and problem areas driving the rewrite.

## Usage Notes
- Pre-task: run the file analysis commands to ground token estimates.
- Structure prompts with stable cacheable prefixes (design rules + full original or key excerpts).
- For technical supplements (not pure fiction): fidelity to existing engine, tables, procedures, and recurring cast takes priority over pure narrative craft.
- Always surface the cost range with caching assumptions and process assumptions when quoting.

This file captures patterns from one session studying a partial mechanics expansion (Tales of the Old West 2e Book 04) and estimating Opus 4.6 rewrite + 50% extension cost. Update with new data as patterns generalize.
