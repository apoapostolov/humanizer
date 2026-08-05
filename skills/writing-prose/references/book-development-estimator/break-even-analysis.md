# Break-Even Analysis for Model Choice

One of the most important decisions is when to spend more on a stronger model because it reduces the total number of iterations (and thus total cost) enough to pay for itself.

## The Basic Break-Even Question

" If I use a 3–5× more expensive model for the first generation or major rewrite, how many fewer follow-up calls do I need before the total project is cheaper?"

## Key Variables

- Price ratio between "strong" and "cheap" models (input + output).
- Number of iterations saved by using the stronger model.
- Size of the sections where the better model is applied.
- How much of the work is output-heavy (where quality differences compound).

## Example Framework

Assume:
- Strong model: $15/M input, $60/M output (rough premium example).
- Cheap model: $0.5/M input, $2/M output.

For a 5,000 word section:

**Cheap model path**:
- First generation: lower quality → likely 2–3 major rewrites + lots of micro fixes.
- Total generated output might be 2.8× final size.
- High number of cheap calls.

**Strong model path**:
- Much better first pass → 1 major rewrite or none + mostly micro-polish.
- Total generated output closer to 1.8× final size.
- Fewer but more expensive calls.

The break-even point is usually reached when the stronger model reduces iteration count by 30–50% on sections that are large or central.

## When Stronger Model Usually Pays Off

- Core creative or complex reasoning sections where poor first output causes cascading problems.
- Sections that will be read and re-read many times by humans (voice or logic must be right early).
- When the alternative is many expensive human hours cleaning up bad output.

## When Cheap Model Is Almost Always Better

- Micro-polish, grammar, MD formatting, small targeted edits.
- Later passes on already-decent sections.
- Filler or supporting material.

## How the Estimator Should Present This

- For any given project, calculate rough break-even thresholds.
- Show side-by-side:
  - All strong model
  - Hybrid (strong on hard parts only)
  - Mostly cheap with strong only where it matters
- Include a sensitivity table: "If using strong model reduces rewrites by X%, the crossover happens at Y% of the project."

## Practical Heuristic

For most long-form book projects, the optimal strategy is:
- Use the strongest appropriate model for the first serious pass on any section that is > ~1,500–2,000 words or is conceptually hard.
- Switch to cheap models as soon as the content is "directionally correct."

Update with actual measured savings from real projects (e.g., "using Opus on the first pass of the 3 hardest chapters saved 2 full rewrite rounds and was net cheaper").
