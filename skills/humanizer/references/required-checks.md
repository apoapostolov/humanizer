<!-- markdownlint-disable MD013 -->

# Required checks

Post-edit QA for a rewrite. Run silently. Do not print this audit unless the
user asks for a checklist or diagnosis.

For pieces up to about 150 words or three short paragraphs, run checks 1–5, 7,
and 10. For longer pieces, run all checks.

## 1. Register fit

Does format, punctuation, and structure match the medium and the request? For
web, docs, or UI text, keep scannability and accessibility. Do not flatten
useful structure for style alone.

## 2. Concrete-anchor audit

For each substantial paragraph, point to one concrete anchor.

In criticism, reportage, reviews, and analysis, at least one paragraph in the
piece should rest on a single concrete example or observed consequence, not only
category summary. If none does, add one.

## 3. Fact discipline

Pick the three most fragile factual claims: dates, milestone names, quotes,
close paraphrases, public metrics, future claims, causal trend claims, feature
labels, motives, hidden-system explanations, or claims sourced to vague
authorities. If you cannot vouch for them, attribute them, soften them, or cut
them. If a citation is present, confirm it supports the exact claim.

Also ask: does the rewrite state any fact, name, number, date, quote, or
citation that is not in the source? A fabrication is a defect even when it
sounds more human than the vague original.

## 4. Source-fit check

For factual writing, check every exact quote, close paraphrase, public metric,
planned or future event, and causal claim. Do not keep *X caused Y*, *X drove
Y*, *X proved Y*, or *X tracked with Y* unless the source supports the
relationship. Use weaker relationship language only when that weaker claim is
still accurate.

## 5. Regularity and sentence-continuity tripwire

Name the single most repeated visible pattern in the piece.

If the same move appears three or more times, or dominates two consecutive
paragraphs, rewrite at least one occurrence. Also scan for false crispness: two
or more neighboring short sentences whose thoughts are tightly related but
split apart. If a comma, conjunction, subordinate clause, colon, or semicolon
would express the relationship more naturally, combine one pair. Keep the
period when it creates useful emphasis or clarity.

## 6. Repeated-frame check

If a central metaphor, contrast, or wording family runs through the piece,
decide whether it is a useful motif or a too-neat scaffold. Keep it only where
it adds force; vary or cut the rest.

## 7. Stance and voice

If the genre expects a visible writer or evaluative stance, state the writer's
view in one sentence to yourself. If you cannot, add stance where it does real
work. If the genre expects neutrality, keep it neutral.

## 8. Developed thought

For any piece longer than four paragraphs, find one place where the prose
pauses, doubles back, or notices a concrete detail off the main line. If the
piece runs in a perfectly straight line from claim to conclusion, see whether
one example or noticed detail would make it less pre-solved.

## 9. Shape and spine

For any piece longer than three paragraphs, state the organizing principle in
five words or fewer and the controlling claim in one sentence.

If the shape is basically starting state → changes → verdict, if paragraphs map
one-to-one with named milestones, or if each paragraph is just one labeled
topic bucket, restructure.

## 10. Over-correction

Did you add fake-human moves only to break a pattern? Fail the check if the
rewrite introduced any of these when the source did not already have them:

- typos, slang, forced asides, or random fragments
- fake first person or invented experience
- manufactured stakes or forced contrarianism
- performed candor frames or empty "real talk"
- em-dash theatrics or staccato conversion for rhythm
- invented numbers, names, dates, tools, or mechanisms

## 11. Revision gate (stop-slop dimensions)

For a piece that still feels off after checks 1-10, rate 1-10 on each
dimension, adapted from hardikpandya/stop-slop (MIT). This is a **quality
gate on the rewrite**, not a detector and not an authorship claim:

| Dimension | Question |
|---|---|
| Directness | Statements or announcements? |
| Rhythm | Varied or metronomic? |
| Trust | Respects reader intelligence? |
| Authenticity | Sounds human, in this writer's voice? |
| Density | Anything cuttable? |

Total below 35/50: revise once more, then re-run only the failed dimensions.
Do not chase a perfect score for its own sake — the gate exists to catch a
pass that is still flat, not to manufacture variation.

These checks catch genericity, visible regularity, false specificity, and
modular structure. They are not goals to manufacture variation for its own sake.
Subtraction and sharpening are in scope. Addition of stance, personality, or
fact is not.

Source note: adapted from an earlier local humanizer fork's required-checks
pass; aligned with this skill's anti-detector-evasion guardrails,
avoid-ai-writing v3.22 never-inject constraints, and the stop-slop revision
gate (hardikpandya/stop-slop, MIT).
