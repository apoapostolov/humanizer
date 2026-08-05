# Real Data Collection Hooks

To improve future estimates, the skill should encourage and support collecting real usage data from actual book writing projects.

## What Data Is Most Valuable

1. **Per Phase Token Counts**
   - Planning
   - Initial generation
   - Critique
   - Major rewrite
   - Global consistency
   - Micro-polish
   - Integration

2. **Model Used per Phase + Perceived Quality**
   - Which model for which kind of work.
   - Was it "good enough", "needed rework", or "excellent"?

3. **Content Type Breakdown**
   - % narrative vs structured per section or project.
   - How many cheap calls were MD fixes vs content changes.

4. **Iteration Counts**
   - Number of major rewrites per section.
   - How many micro-polish calls per 1,000 final words.

5. **Context Strategy Used**
   - Full re-ingest, delta only, previous version included, plan only, etc.
   - Actual cache hit rates when possible.

6. **Human Reading Impact (qualitative + rough)**
   - Did careful reading reduce later AI calls?
   - Average chunk size generated vs number of follow-ups.

7. **Hybrid Routing Effectiveness**
   - What % of total spend went to cheap models?
   - Did quality suffer?

## Recommended Logging Format (Simple Markdown or JSON)

Example per project or per chapter:

```
Chapter: 07-the-standoff
Final words: 4820
Maturity at start: scaffold

Phase | Model | Input tokens | Output tokens | Notes
Planning | claude-opus | 28k | 3.2k | good plan
Initial gen | deepseek-v4 | 12k | 41k | first pass
Major rewrite | claude-opus | 19k | 27k | voice + logic
Micro polish | gemini-flash | 45k | 8k | mostly tables + grammar
...
Total cheap model spend: 62%
```

## Integration With the Estimator

The skill should:
- Output suggested logging templates when giving cost estimates.
- Have a simple way for the user to feed back actual numbers from a run (even manually) so the skill can compare prediction vs reality.
- Over time, allow the estimator to adjust default multipliers based on collected data from the user's own projects.

## Maintenance

Keep a `measured-runs.md` or similar file (or just append to the generic example) with anonymized, generic data.

The more real numbers we have on phase breakdowns, hybrid savings, versioning overhead, and MD friction, the more accurate future estimates become.

Prioritize collecting:
- Phase token splits
- % work on cheap models
- Actual vs predicted iteration multipliers
