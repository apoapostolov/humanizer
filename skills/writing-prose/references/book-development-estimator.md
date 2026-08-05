---
name: book-development-estimator
category: writing
description: Analyzes Markdown book projects for development stage. Detects supporting skills. Classifies work across Creativity (narrative/voice), Reasoning (systems/logic), and Stable/Precise (grammar, structure, micro-edits). Models realistic large-swath writing workflows + hybrid model routing + advanced writing economics (content types, versioning, human loops, break-even, parallelization, MD friction). Produces detailed cost estimates.
tags:
- writing
- manuscript
- long-form
- cost-estimation
- model-selection
- long-context
- agent-model-evaluation
version: 2.2.0
related_skills:
- agent-model-evaluation
- openrouter-model-selector
- writing
---

# Book Development Estimator

Analyzes a directory of Markdown files (a book project) to determine current development state, identify relevant supporting skills, classify the nature of the required work across creativity/reasoning/stable axes, recommend phase-appropriate models, and produce realistic cost estimates for AI-assisted book writing.

The skill is designed for any long-form manuscript in Markdown with a `/skills` directory containing grounding material (voice, systems, research, etc.).

**Important distinction**: Book writing involves generating large contiguous blocks of text, reading them, rewriting swaths, and performing many small surgical changes. This is very different from agentic/tool-calling workflows.

## Core Principles
- **Ingest-heavy + iteration-heavy**: Large stable context + repeated reading/rewriting of generated output.
- **Three axes**: Creativity, Reasoning, and Stable/Precise.
- **Phase-aware + economics-aware**: Different passes, content types, and real-world frictions have very different token profiles and optimal model tiers.
- **Aggressive hybrid routing**: Large percentage of work (especially micro-edits) should use cheaper models.
- **Data-driven improvement**: Collect real metrics to refine estimates over time.

## Inputs
- `book_path`
- `goal`: "creativity" | "reasoning" | "stable" | "mixed"
- `target_expansion` or `goal_pages` + `art_level`
- `specified_model`
- `supporting_skills` or "auto"
- `grounding_docs`
- `maturity_mix`
- `hybrid_routing`: "aggressive" | "conservative"
- `content_type_ratio`: Optional (e.g. "60% narrative, 40% structured")

## Discovery Workflow

1. Size, scaffold detection, maturity classification (Scaffold → Rough → Developed → Polished).
2. Three-axis classification (Creativity / Reasoning / Stable).
3. Content type detection (narrative prose vs structured/tables/procedures) — see `references/content-type-differentiation.md`.
4. Detect supporting skills and grounding documents from `/skills`.
5. Assess iteration drivers: scaffold %, structured content volume, expected human reading burden, versioning style.

## Model Selection (Three Axes + Phase + Content Type Routing)

See `references/model-selection-heuristics.md`, `references/hybrid-model-strategies.md`, `references/break-even-analysis.md`.

- Strong models for first serious pass on hard creativity or reasoning work.
- Cheap precise models for the majority of micro-polish, grammar, MD fixes, and stable work.
- Content type matters: structured content has much higher stable/MD friction.

## Realistic Writing Workflow Model & Advanced Economics

Core phases are documented in `references/writing-passes-and-phases.md`.

Additional quantified factors:
- **Content Type Differentiation** (`references/content-type-differentiation.md`): Narrative vs structured content have very different generation and (especially) polish costs.
- **Versioning & Diff Overhead** (`references/versioning-diff-overhead.md`): Including previous versions adds significant input tokens (often +70–120% per rewrite).
- **Human Reading Loop** (`references/human-reading-loop.md`): Human review of large outputs drives extra iterations.
- **Break-Even Analysis** (`references/break-even-analysis.md`): When a more expensive model pays for itself by reducing total iterations.
- **Parallelization Levers** (`references/parallelization-levers.md`): What can be done in parallel vs requires global context + integration tax.
- **MD-Specific Friction** (`references/md-specific-friction.md`): Extra cost from tables, lists, formatting precision in Markdown.
- **Data Collection** (`references/data-collection-hooks.md`): Logging templates to improve future estimates.

## Token Model, Iteration Multipliers, and Cost Estimation

See `references/token-model.md` and `references/page-calculator.md`.

The model now incorporates:
- Maturity-based multipliers.
- Content type adjustments (higher stable overhead for structured work).
- Versioning overhead factors.
- Expected hybrid routing savings (often 30–60%).
- Integration tax for parallel work.
- MD friction adder for table-heavy projects.

Reports optimistic/realistic/loose ranges, with and without aggressive hybrid routing.

## Usage Steps

1. Provide book_path + target + optional details (maturity, content type ratio, hybrid preference).
2. Run discovery including content type and advanced drivers.
3. Selectively load skills.
4. Build phase-aware, economics-aware token model.
5. Recommend models per phase/axis/content type (or evaluate specified model) + break-even considerations.
6. Output:
   - Current state and cost drivers
   - Recommended hybrid + parallelization strategy
   - Cost ranges (with sensitivity on key levers)
   - Suggested logging template for real data collection
   - Concrete next actions

## References
- `references/writing-passes-and-phases.md` — Core writing phases and why they differ from agentic work.
- `references/hybrid-model-strategies.md` — Three axes + when to use cheap vs strong models.
- `references/content-type-differentiation.md` — Narrative vs structured content impacts.
- `references/versioning-diff-overhead.md` — Cost of keeping previous versions in context.
- `references/human-reading-loop.md` — How human review drives extra iterations.
- `references/break-even-analysis.md` — When stronger models save money overall.
- `references/parallelization-levers.md` — What work can be parallelized.
- `references/md-specific-friction.md` — Markdown table/list/formatting overhead.
- `references/data-collection-hooks.md` — Logging templates and feedback loop.
- `references/page-calculator.md`, `references/token-model.md`, `references/model-selection-heuristics.md`, `references/caching-patterns.md`, `references/generic-example.md`

## Maintenance Notes
- Keep all content generic and timeless.
- Update multipliers and levers from real measured runs using the data collection hooks.
- Revisit break-even and hybrid recommendations as model prices and capabilities change.

This skill helps choose the right model for the right kind of thinking and gives a realistic picture of what writing the book will actually cost, accounting for how people actually write with AI.
