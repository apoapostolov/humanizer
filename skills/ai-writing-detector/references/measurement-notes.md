<!-- markdownlint-disable MD013 -->

# Measurement notes

Absorbed summary of detector research published with
[avoid-ai-writing v3.22.3](https://github.com/conorbronsdon/avoid-ai-writing/releases/tag/v3.22.3).
This skill does **not** ship the hash-only corpus or re-run RAID/HC3 by default.
Full methodology lives upstream in that repository under `corpus/` and
measurement scripts when you need to reproduce research.

## Design lessons worth keeping

### Provenance-defined false positives

If every document in a control set is human-written by construction, every flag
is a false positive. That removes "judge models" from the loop. Hash-only
manifests keep text out of git while preserving auditability.

### Register is the unit of analysis

False-positive rates vary widely by register inside one language. Aggregate FP%
hides the bad register. Any serious evaluation must split by register.

### Vocabulary is not the hero signal

Upstream measurement found the large vocabulary table had weak or inverted lift
as an authorship separator compared with structural signals such as rhythm
uniformity. Editorial tier tables remain useful for *rewriting*. They are poor
as sole *authorship* evidence.

### Clarity vs frequency (Tier 1 split)

Words like `in order to`, `utilize`, `commence`, `ascertain` are often
formality/wordiness. Counting them as "AI frequency markers" pollutes scores on
human professional prose. Engine type `tier1-clarity` exists so a wordiness fix
cannot shove a document toward an AI classification the way a dense Tier 1A
cluster might.

### Em dash as authorship evidence

Em dashes remain a common *style* complaint. As a binary human/AI feature they
can point the wrong way on some corpora. Do not treat dash count as proof.

### Preservation must be checked mechanically when edit mode writes files

Prose instructions fail silently. `validate.js` encodes: do not break fences,
frontmatter, tables, inline code, URLs, paths, heading structure; do not finish
with more residual flags than you started with.

## What we deliberately do not claim

- We do not republish upstream FPR/TPR/AUC as product guarantees.
- We do not claim this engine matches GPTZero or any commercial detector.
- We do not treat self-scan of documentation as a user-facing accuracy proof.

Use these notes to stay honest when reporting analyze results.
