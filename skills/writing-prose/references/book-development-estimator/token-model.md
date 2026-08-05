# Token Model & Cost Calculation for Book Development

This reference provides the concrete formulas and example numbers used by the estimator, with specific attention to writing workflows.

## Base Conversion Factors
- Words → tokens (rough): 1 word ≈ 1.33–1.37 tokens (accounting for Markdown, headings, tables).
- For safety in estimates use 1.35×.

## Content Maturity Multipliers (Output Generation Overhead)

These multipliers estimate total generated tokens relative to final book words for different maturity levels:

- Scaffold / ideation-heavy sections: **3.0 – 4.5×** (high chance of full regeneration)
- Rough draft: **1.8 – 2.8×**
- Developed draft: **1.4 – 2.0×**
- Polished sections: **1.1 – 1.3×** (mostly micro-edits)

Weighted average for a typical mixed project: **2.2 – 3.2×** overall.

## Phase-Specific Token Profiles

See `references/writing-passes-and-phases.md` for the full phase table. Rough guidance:

- **Planning pass**: High input (project scan + skills), medium output.
- **Initial generation**: Medium input + very high output.
- **Critique/review**: High input (including previously generated text) + low-medium output.
- **Major rewrite**: High input + high output.
- **Global consistency**: Very high input + medium output.
- **Micro-polish**: Low input per chunk + low output (but high volume of such calls).
- **Integration**: Medium input + low-medium output.

## Hybrid Routing Savings

With aggressive hybrid routing:
- Assume 40–60% of post-first-draft work can use cheap/fast models.
- This often reduces overall cost by 30–60% compared to using one strong model for everything.

The estimator should report costs both with and without hybrid routing.

## Expansion Math

Target expansion = X (e.g. 0.5 for 50%).

Final book words ≈ current × (1 + X)
Final book tokens ≈ final_words × 1.35

Plus generated overhead (apply maturity-weighted multipliers above).

## Pass Structure Example (Realistic Writing Project)
1. Planning + gap analysis
2. Initial generation batches (chunked by chapter/section)
3. Critique + major rewrite cycles (1–3 per difficult section)
4. Global consistency passes (1–2)
5. High-volume micro-polish (grammar, MD, structure)
6. Final integration and light polish

Total gross input before cache: heavily dependent on how much re-ingestion happens and context strategy.

## Caching Adjustment
- Stable prefixes (supporting skills + grounding documents + plan) cache very well.
- Previously generated sections can be cached if you use delta strategies.
- Realistic cache hit rate with good discipline: 60–80%.
- Effective input price: often 0.2 – 0.4× list price.

## Full Cost Formula (Simplified)
```
gross_input = sum over passes of (relevant_context + skills + grounding + overhead)
effective_input = gross_input * (1 - cache_hit_rate)

input_cost = (effective_input / 1M) * input_price
output_cost = (total_generated_output / 1M) * output_price

total = input_cost + output_cost
```

Report:
- Optimistic (high cache + aggressive cheap routing + low iterations)
- Realistic (normal hybrid usage + typical iterations)
- Loose (strong model for everything + full re-ingests)

## Key Variables That Move the Number (Writing-Specific)
- Percentage of content that is still scaffolded
- Amount of structured content (tables, procedures) → more stable/micro work
- How aggressively you route micro-polish to cheap models
- Context strategy (full vs delta/section+plan)
- Number of major rewrite cycles on complex sections
- Model mix (strong vs cheap)

Update this file with measured data from real projects.
