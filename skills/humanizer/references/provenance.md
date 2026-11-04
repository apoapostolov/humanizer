<!-- markdownlint-disable MD013 -->

# Provenance in high-stakes contexts

Surface style is a writing tool, not proof of authorship. If authorship or
academic integrity matters, stronger signals than prose texture include:

- draft and revision history
- citations that actually support the claims made
- notes, outlines, and source traces
- disclosed AI use when it occurred

Use this skill's pattern and checklist passes to improve prose. Use provenance
to support authorship claims. Do not treat a clean humanizer pass, a tier-list
hit, Tier 1B clarity edits, detector scores, or published FPR/TPR/AUC numbers as
decisive evidence of who wrote a text. Upstream measurement work reinforces
that many lexical flags fire on pre-LLM human prose and that composite scores
are weak authorship separators. The counts for the catalog shapes are below.

## What the measurements do and do not show

The upstream project measured five catalog shapes against a parallel
human/model corpus and published the counts. They narrow what a hit can mean.

- **Sentence-length variation** separated cleanly. Model continuations had a
  coefficient of variation around 0.40-0.44 against 0.65 in the matched human
  text, in every register measured. Pattern 20 stays a reliable editing target.
- **Same-opener sentence runs** ran the other way: about 17-21 matches per
  million words in model continuations against 151.5 in the human text.
- **Stranded auxiliary contrast** also ran the other way: 0.3-1.1 per million
  in models against 9.1.
- **Colon into a triple** was modestly more frequent in models, 19-27 per
  million against 12.3, on a shape that is rare in both.
- **Comma-separated hyphen-pair stacks** were more frequent in the human text,
  53.1 per million against 32-43 in models.
- **Vocabulary diversity** did not separate the two. One model scored above the
  human median, and a type-token ratio under 0.40 was rare on both sides.

Read the counts as calibration, not as permission. A human-written draft can
carry a long same-opener run, and a model can write without one. A hit says the
shape is worth a reread, never that a machine wrote the passage.

Source note: adapted from an earlier local humanizer fork; the measured section
summarizes avoid-ai-writing's published catalog measurements after v3.38.0;
reinforced by this skill's guardrails and `ai-ism-audit.md` signals-not-proof
stance.
