# Caching & Prompt Structure Patterns for Large Manuscript Work

Maximum cache efficiency is one of the most important levers for keeping costs reasonable on ingest-heavy rewrite and development jobs.

## Golden Rules for Prompt Structure

1. **Stable prefix first, every time**
   - Recommended order:
     1. Core grounding documents (design bible, spec, research notes — rarely changes)
     2. Relevant supporting skills (loaded selectively)
     3. Original manuscript content (or the specific sections being worked on)
     4. Current state summary or plan (can change between passes)
     5. Specific task for this pass

2. **Use explicit cache-friendly markers**
   - Put long stable content under clear headings such as:
     ```
     ## GROUNDING DOCUMENTS (stable context)
     ...
     ## SUPPORTING SKILLS (stable context)
     ...
     ## ORIGINAL MANUSCRIPT (for reference)
     ...
     ```

3. **Chunk intelligently**
   - For rewrite passes: send the specific section(s) being worked on plus enough surrounding context for continuity, not the entire manuscript on every call.
   - For global consistency passes: re-ingest more of the manuscript, but keep skills and grounding documents as the immutable prefix.

4. **Separate planning from execution**
   - Do one (or a few) large planning calls that produce a detailed section-by-section plan or extension spec.
   - Then perform many smaller, targeted execution calls that reference the plan.
   - The plan itself becomes reasonably stable context for later passes.

5. **For multi-pass work**
   - After each major batch, produce a "delta summary" or "updated sections" artifact.
   - Subsequent passes can often ingest the delta + plan instead of re-sending the entire original manuscript.

## Example Prompt Skeleton (for a rewrite pass)

```
## TASK CONTEXT
You are developing a long-form manuscript. Current state: X% scaffolded/incomplete. Target: significant expansion and polish.

## GROUNDING DOCUMENTS (stable context — do not change)
[core grounding document / design bible / research notes]

## SUPPORTING SKILLS (stable context)
### Voice and Style Grounding
[relevant skill content]

### System / Design Logic
[relevant skill content]

## ORIGINAL CONTENT (reference)
[the section or chapter being rewritten, plus limited adjacent context]

## WORK PRODUCT SO FAR
[previous rewritten sections or the development plan]

## CURRENT TASK
[Specific instructions for this pass...]

Produce the revised section.
```

The first three major sections are the parts that should cache most aggressively.

## When Caching Helps Less
- The very first planning pass (almost everything is new).
- When you significantly change which supporting skills are loaded.
- When the "original" reference is being heavily modified and you send the growing new version as the main context.

## Practical Tips
- Keep the set of supporting skills loaded relatively stable across a job.
- For many section-by-section passes, consider keeping one consistent "skills + grounding documents + plan" block as system-level or early context.
- Measure and note cache behavior when the platform reports it.

This pattern applies to any large manuscript development workflow that relies on repeated large-context calls.
