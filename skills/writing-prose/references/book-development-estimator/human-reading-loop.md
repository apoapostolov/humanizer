# Human Reading Loop Modeling

A major hidden cost driver in AI book writing is the human reading step between AI calls.

After the model generates a large swath of text, the human must read it (sometimes multiple times) before deciding what to do next or giving the next prompt. This affects:

- How many AI iterations actually happen.
- The quality and specificity of the next prompt.
- Overall project calendar time and mental energy (which indirectly drives cost).

## Why This Matters for Cost Estimation

Unlike pure agentic loops (where the model reads its own output instantly), book writing has a human in the loop for most important decisions.

Effects on AI cost:
- More careful human reading → better, more targeted follow-up prompts → fewer wasted AI calls.
- Rushed or skipped reading → vague prompts → more regeneration and higher total tokens.
- Fatigue from reading very long outputs → tendency to request bigger rewrites instead of surgical edits.

## Quantification Levers

1. **Output Size per Call**
   - Larger generations (3k–6k+ words) take longer for a human to read thoroughly.
   - This can increase the chance the human asks for a full rewrite instead of small fixes.

2. **Number of Human Review Cycles**
   - Typical: 1–2 thoughtful reads per major generation before the next AI call.
   - Each extra human read cycle often leads to one more AI pass.

3. **"Read-to-Action" Ratio**
   - How much of the generated text actually triggers changes.
   - High ratio (lots of issues found) = more follow-up AI work.
   - Low ratio = the generation was good enough; cost stops there.

4. **Chunking Discipline**
   - Generating in smaller, reviewable chunks (1–2k words) reduces human reading burden and often leads to more precise feedback and lower total AI spend.

## Rough Rules of Thumb

- For every 10k words of high-quality AI output that a human must seriously read, expect 0.5–1.5 additional AI calls triggered by that reading.
- Projects where the writer reads full chapters before the next prompt tend to have 20–40% higher iteration count than projects that use detailed plans + small targeted calls.
- Structured content is often faster for humans to review than long narrative (you can scan tables and logic more quickly than prose).

## How the Estimator Should Use This

- When estimating iteration multipliers, factor in human review burden.
- Recommend chunk sizes that balance model context efficiency with human readability.
- Surface advice like: "Consider doing a model critique pass first so the human only reads the critique + proposed changes instead of the full raw output."
- Track in real projects: average words generated per call vs number of follow-up calls triggered by human review.

## Mitigation Techniques That Reduce Effective Iterations

- Have the model produce a "change summary + marked up sections" instead of full rewritten text on every pass.
- Use model self-critique before human review.
- Read only the delta or the plan, not the entire output every time.

Update this reference when you have measured data on how human reading time correlated with actual iteration counts and token spend.
