---
name: humanizer
description: Humanize AI-sounding text with natural rewrites, voice preservation, and editorial critique.
---

# Humanizer

Make text sound natural, specific, and true to its writer. Improve the writing;
do not optimize for detector evasion or manufacture human-like mistakes.

## Establish the brief

Identify the source text, task, audience, purpose, format, desired voice, and
constraints. Protect facts, quotations, technical terms, supported uncertainty,
and deliberate quirks.

If no text is provided, ask for it. Ask one brief question only when missing
context would materially change the result; otherwise make the smallest safe
assumption and proceed.

## Choose the depth

- **Cleanup:** Fix local stiffness, filler, repetition, and response residue.
- **Rewrite:** Rebuild sentences and paragraphs while preserving meaning.
- **Voice match:** Follow a supplied sample or clear voice brief.
- **Critique:** Diagnose the strongest problems and recommend repairs without
  rewriting.

Use the lightest intervention that solves the request.

## Load the right reference

- Read [references/humanizing-text.md](references/humanizing-text.md) for full
  rewrites, voice or tone work, audience adaptation, fiction, dialogue, and
  long-form editing. It is the main structure for humanizing text.
- Read [references/pattern-catalog.md](references/pattern-catalog.md) for a
  systematic audit, stubborn draft, or detailed diagnosis of recurring writing
  patterns. Use patterns as editorial prompts, never proof of authorship.
- Read [references/examples.md](references/examples.md) when contrastive examples
  would improve calibration.

Load only what the task needs.

## Edit

1. Preserve the draft's meaning, evidence, uncertainty, and recognizable voice.
2. Put the reader's needed fact, action, or decision before framing and ceremony.
3. Replace vague claims with supported specifics; never invent detail.
4. Let sentence rhythm, paragraph shape, and emphasis follow the thought.
5. Keep useful personality: stance, warmth, humor, restraint, tension, or roughness.
6. Remove template language, generic uplift, assistant chatter, placeholders,
   abrupt cutoffs, and mismatched formatting.
7. Compare the result with the source and its surrounding text before delivery.

## Guardrails

- Do not treat polished grammar, a dash, a triad, passive voice, or any single
  feature as inherently artificial.
- Preserve intentional rhetoric, genre conventions, accessibility, and house
  style when they serve the text.
- Do not add fake sources, facts, quotations, memories, emotions, sensory detail,
  slang, typos, or first-person experience.
- Do not flatten necessary technical precision or evidence-based qualification.
- Flag misleading or manipulative claims instead of polishing them into stronger
  deception.

## Deliver

Follow the requested format. If none is given:

- For a rewrite, return the revised text first. Add a note only for a material
  choice, ambiguity, or factual concern.
- For a critique, name the strongest clusters, cite short examples, and prescribe
  specific repairs.
- For a mixed request, give a compact diagnosis followed by the rewrite.

Return only what helps the user. Do not add generic offers or commentary around
a clean rewrite.
