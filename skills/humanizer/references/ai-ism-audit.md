<!-- markdownlint-disable MD013 -->

# AI-ism audit modes and extended tells

Operational audit guidance adapted from
[conorbronsdon/avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing)
v3.22.3 (MIT), aligned with this skill's rule: improve writing quality; do not
treat patterns as proof of authorship or optimize for detector scores.

Load this reference when the user wants a structured audit, detect-only pass,
edit-in-place cleanup, severity triage, context or voice profile, or when the
core [pattern-catalog.md](pattern-catalog.md) needs the extended tells below.

## Signals, not proof

Patterns here are more common in LLM output, but humans under deadline pressure,
in unfamiliar genres, or writing in a second language produce the same shapes.
Commercial detectors have high false-positive rates on non-native English and
other legitimate prose. Use context: genre, the writer's normal voice, and other
evidence. Do not treat this catalog as the sole basis for academic integrity,
hiring, publication, or attribution decisions.

## Modes

### rewrite (default)

1. Audit: identify material AI-isms with short quoted spans.
2. Rewrite: return clean prose that preserves every claim, facts, and useful
   voice. Keep information, not paragraph count or outline shape.
3. Optionally summarize major changes when the user wants a diff-style note.
4. Second pass: re-read the rewrite for leftover transitions, inflation, copula
   swaps, filler, and any fact not present in the source. Fix survivors. Cap
   optional extra iterate passes at 2.

### detect

Flag only. No rewrite. Use when the writer wants to decide, when patterns may be
intentional, or when auditing published or third-party text that must stay
intact. Group findings by severity (P0 / P1 / P2). Note clear problems vs.
judgment calls. Keep Tier 1A frequency-band markers visually separate from
Tier 1B clarity edits, and say which is which. A wordiness fix is a writing
suggestion, not evidence about who wrote the text.

### edit

Edit a named file in place with minimal targeted patches. Leave clean paragraphs
alone. Do not rewrite quoted material, code blocks, or attributed speech; flag
those instead. For large files, confirm scope first. Re-read and report only the
spans changed plus verification.

Trigger detect on: detect, flag only, audit only, scan, what AI patterns.
Trigger edit when the user names a file and wants it fixed in place.
Natural language is enough. Optional flags people may pass: mode, voice,
context, file, iterate N (max 2).

## Severity triage

### P0 — Fix immediately

- Cutoff disclaimers ("As of my last update")
- Chatbot artifacts and sycophancy ("I hope this helps!", "Great question!")
- Vague attributions without sources
- Significance inflation on routine events
- Leaked citation markup or AI-tool URL parameters
- Unfilled placeholders shipped as published text
- Hashtag stuffing on high-trust social or investor copy

URL-parameter carve-out: strip only the AI-referrer tracking parameter; a
functional query parameter (`?page=2`, `?v=4`) is not evidence of a tell.

### P1 — Fix before publishing

- Tier 1A vocabulary and Tier 2 clusters ([vocabulary-tiers.md](vocabulary-tiers.md))
- Template phrases and slot-fill constructions
- "Let's" transition openers and reasoning-chain scaffolding
- Synonym cycling within a paragraph
- Formulaic openings
- Decorative bold and emoji headers in formal prose
- Em-dash density that manufactures drama rather than a real turn
- Generic future-narrative closers
- Social endorsement closers and lingering-attention openers
- Narrated candor (empty disclosure frame; not material admissions)
- Hedge-stacked predictions
- Real/actual adjective inflation without named contrast
- Moral-adjective category errors
- Invented contrast-pair mirroring
- Bare noun-phrase bullet marketing lists
- Tier 3 phrase clustering

Tier 1B clarity edits (utilize, in order to, commence, and peers) are usually
worth fixing before publish, but label them as wordiness, not as machine-
authorship evidence.

### P2 — Polish when time allows

- Generic conclusions
- Compulsive rule of three
- Uniform paragraph length
- Copula avoidance
- Stock transition phrases
- Title-case subheads, list-label period quirks, mild density issues

Use P0+P1 for quick passes. Full audit covers all three.

## Context profiles

Optional audience strictness. Auto-detect when useful; say which profile you used.

| Profile | Use |
| --- | --- |
| linkedin | short social; punchy fragments OK |
| blog | default long-form; full strength |
| technical-blog | code and architecture; keep terms of art |
| investor-email | high trust; extra strict on promo and inflation |
| docs | clarity over voice; lists often correct |
| casual | chat and notes; catch only worst offenders |

### Tolerance notes

- Em dashes, bold hooks, end-of-line emoji: relaxed on linkedin; skip many rules
  on casual.
- Lists: often correct on linkedin and docs; marketing NP lists still suspect.
- Hedging: relaxed on technical-blog and docs when accuracy requires it.
- Promotional language and future-narrative closers: extra strict on investor-email.
- Subjectless fragments: correct in README feature lists and changelogs.
- Word table: partial on technical-blog (keep robust, comprehensive, seamless,
  ecosystem, literal leverage, facilitate, underpin, streamline when technical).
- Wall-of-text reply shape: conversational registers only, never long-form prose.

Auto-detect cues: short + hashtags → linkedin; code/API → technical-blog;
salutation + fundraising language → investor-email; steps/parameters/README →
docs; else blog.

## Voice profiles

Independent of context. Optional. If the writer supplies a sample, match that
instead of a named profile. The sample outranks generic style defaults when they
conflict. Do not impose a persona on text that already has one.

| Voice | Targets |
| --- | --- |
| casual | contractions, shorter sentences, concrete touch, low jargon |
| professional | active voice, varied length, one concrete claim per paragraph, explicit ask |
| technical | plain copulas, one idea per sentence, define jargon once, useful lists only |
| warm | direct "you", cut empty intensifiers, no performative empathy openers |
| blunt | claim first, periods over dash drama, near-zero hedge stacks |

When voice and context conflict on the same rule, prefer the stricter useful
edit. Do not inject personality into encyclopedic, legal, or pure reference prose.

## Extended tells (beyond the core 55-pattern catalog)

Use these with the catalog. Prefer clusters and reader impact over single hits.

### Formatting and presentation

- **Em-dash drama:** Prefer commas, periods, parentheses, or two sentences when
  dashes manufacture rhythm. Keep a real interruption or turn. List-item
  definition separators after a bold lead or markdown link
  (`- **Term** — description`) are typography, not prose splices. Keep-a-
  Changelog version headings that are only a bracketed semver, a dash, and an
  ISO date (`## [3.21.0] — 2026-07-30`) are release-note punctuation, not prose
  drama. A bold lead term with a parenthetical before a list-item dash stays
  carve-out territory. Mid-sentence splices and line-initial bold-lead dashes
  outside lists still count. A prose dash inside a normal heading still counts.
- **Bold and emoji headers:** Prefer structure over decoration. Social may keep
  sparse end-of-line emoji.
- **Curly quotes in plain-text contexts:** Weak corroborating signal in code
  comments, commit messages, or plaintext drafts. Not conclusive; Word and OS
  editors curl by default. Leave finished publications alone.
- **Immaculate casual typography:** Perfect polish in chat/issue replies can
  corroborate other signals. When editing a human's casual text, preserve their
  typos and capitalization quirks rather than sanding the fingerprint off.
- **Hashtag stuffing:** Long trailing tag blocks (about 6+) mixing project tags
  with broad category tags. Prefer 2–3 specific tags or none.
- **Title case subheads:** Prefer sentence case for section headings unless house
  style requires title case.
- **Inline-header lists:** `**Label:** Label repeats…` → drop the redundant
  header or convert to paragraphs.
- **List-label periods:** Soft tell when a short noun label ends with a period
  before a gloss (`**Intros.** Years of…`) where a colon is natural. Full
  sentence bullets keep periods. Do not force mechanical colon rewrites on every
  list.
- **Excessive structure:** Too many headers in short text; formulaic Overview /
  Key Points / Conclusion scaffolding; fragmented header warm-ups.

### Claims and credibility

- **Generic future-narrative closers:** modal + become + "one of the most
  important narratives/trends/chapters…" Prefer a falsifiable claim or cut.
- **Hedge-stacked predictions:** "could potentially," "may eventually," "might
  ultimately." Keep one hedge.
- **Real/actual adjective inflation:** "real tokenomics," "genuine utility"
  without naming the fake contrast. Named contrast is honest ("real settlement,
  not bridged IOUs").
- **Moral-adjective category errors:** moral adjectives on non-agent nouns
  ("honest shape," "flagged honestly"). Name the concrete property. Related:
  "the assumption stops being true" → "no longer holds"; gratuitous universal
  quantifiers ("every first-year course") without checkable scope.
- **Invented contrast-pair mirroring:** real term paired with a phantom opposite
  for symmetry ("false precision rather than genuine accuracy"). Use a real
  opposite or drop the pair.
- **Vague third-party validation:** unnamed external authority plus superlative
  ("independent testing confirms," "analysts agree"). Name source, test, and
  result, or cut. Distinct from notability name-dropping of specific prestige
  outlets.
- **Historical analogy stacking:** rapid-fire past tech lists to borrow weight.
  Keep one parallel that does analytical work.
- **Novelty inflation and invented labels:** "coined," "nobody is naming,"
  undefined pseudo-terms. Describe mechanism; define on first use if kept.
- **Self-labeling significance:** after a list, "that last move is the
  contrarian one." Let structure and specifics carry weight.
- **Lingering-attention claims:** "the line I keep coming back to," "can't stop
  thinking about this" without a reason. Keep when the reason is attached.
- **Social endorsement closers:** "worth your time," "bookmark this," "thank me
  later" without who-it-is-for substance.
- **Infomercial hooks and fake-candid openers:** "The catch?", "Honestly?",
  "Real talk:" as theatrical setup before ordinary points.
- **Shadowboxing objections:** answering an objection nobody raised ("This isn't
  mainly about X", "I'm not arguing that", "Don't get me wrong", "Some might
  say... but") when the objection appears nowhere else. Remove the unsupported
  defense; keep objections the text names or answers in full. See pattern 79.
- **Editorial scar tissue:** rejected fake alternatives left in the draft
  ("A tempting approach would be... but", "One might be tempted to", "It would
  be easy to just"). One rejection may be valid; several short unrelated ones
  are a stronger sign. Remove the fake option, state the constraint directly.
  Keep real alternatives in design docs, tutorials, and arguments. See pattern
  80. (Adapted from blader/humanizer, MIT.)
- **Narrated candor:** announcing the disclosure instead of disclosing ("Two
  caveats I would rather flag than let you discover later:", "I want to be
  upfront:", "rather than bury this"). Deletion test: cut the frame; if nothing
  is lost, it was never content. Keep material admissions and conventional
  conflict-of-interest openings that carry a real fact. Ordinary work
  comparatives ("I'd rather fix it than let you inherit the mess") are not this
  pattern. Judgment-only; see pattern 73 in the catalog.
- **Emotional flatline:** announcing surprise or fascination the prose does not
  earn, including bare "Interesting part:" headers.

### Structure and rhythm

- **Split and stacked "not X, Y" reveals:** including multi-negation countdown
  and tailing negation fragments ("…, no guessing"). State the positive claim.
  Spec-constraint lists ("no dependencies, no telemetry") are carve-outs.
- **Bare noun-phrase bullet lists:** 5+ short adj+noun items, same shape, no
  verbs, no checkable claim. Convert to prose or full claims. Real inventories,
  changelogs, parameters, and todos stay.
- **Subjectless fragments and agentless passives:** in flowing prose, name the
  actor when it clarifies. Carve out docs, changelogs, commit subjects.
- **Parenthetical hedging:** "(and, increasingly, Z)" as fake nuance. Own
  sentence or cut.
- **Numbered list inflation:** forced "five things" when content does not earn
  five discrete parallel items.
- **Reasoning-chain artifacts:** "let me think step by step," exposed scaffolding
  in published prose.
- **Acknowledgment loops:** restating the prompt before answering.
- **Wall-of-text replies:** reply-length conversational text as one unbroken
  dense block. Break at thought boundaries. Never apply to deliberate long-form
  paragraphs.
- **Recap-flattery opener:** summarizing the other person's own work back at
  them with praise before the point.
- **Diff-anchored writing:** docs narrating the edit instead of current
  behavior. Carve out changelogs, release notes, migration guides, ADRs.
- **Manufactured punchlines / staccato drama:** three or more same-shape reveal
  fragments in a row. One emphatic fragment can be human variation.
- **Paragraph-reshuffle immunity:** if body paragraphs can swap without loss,
  the piece is a list of modules, not a building argument. Add dependency or
  make the list explicit.
- **Treadmill / low information density:** paragraphs that restate the premise
  without a new fact, claim, or turn. Lead with the new unit or cut.
- **Rhythm uniformity:** even sentence and paragraph lengths across a passage.
  Vary because thought varies, not by quota. Do not sand away all personality
  while cleaning tells; sterile uniformity is itself a problem.
- **Vocabulary diversity (weak note):** in long general prose, extreme
  vocabulary lock-in can accompany vague abstraction. Broaden content and
  specifics; do not thesaurus-spam. Never treat TTR as proof of authorship.

### When to rebuild vs. patch

If many vocabulary hits, several pattern families, and metronomic structure all
appear together, phrase patches will not save the draft. State the core point in
one sentence and rebuild. If the original is already strong, say so and make
only necessary cuts.

## Output contracts

### rewrite

Default delivery still prefers revised text first per `SKILL.md`. When the user
asks for a full audit package, use:

1. Issues found (quoted spans)
2. Rewritten version
3. What changed (major edits only)
4. Second-pass note (clean, or corrected survivors), including a fabrication
   check against the source

### detect

1. Issues found by severity (keep Tier 1A markers separate from Tier 1B clarity)
2. Assessment: must-fix vs. judgment call vs. intentional craft

### edit

1. Edits made (location, before → after)
2. Verification after re-read; note deliberate leaves
3. Confirm protected material stayed intact: fenced code, frontmatter, blockquotes,
   table cells, inline code, URLs, file paths, and heading structure unless the
   brief required a heading-case fix. Do not introduce more AI-isms than you
   removed.

### embedded

When humanizer is a step inside another task, return only the final prose. No
draft, no audit bullets, no summary unless the caller asked for one.

## Never inject on rewrite

Constraints on the editor, not detections on the text. Do not add any of the
following to a draft that did not already contain it:

- Fake first person or invented experience
- Manufactured stakes or forced contrarianism the source did not argue
- Performed candor frames ("let's be honest", empty "real talk")
- Em-dash theatrics or staccato conversion for fake rhythm
- Invented numbers, names, dates, tools, or mechanisms

Subtraction and sharpening are in scope. Addition of stance, personality, or
fact is not. Full list lives in `SKILL.md` Guardrails.

## Optional mechanical detector

Do not run the JS engine from this skill package. For scores, issue types, and
rewrite preservation checks, load the sibling skill **`ai-writing-detector`**.

That skill vendors avoid-ai-writing `patterns.js` / `validate.js`. It never
overrides editorial judgment here. Do not treat detector scores, FPR/TPR, or AUC
claims as proof of authorship, and do not score-chase rewrites.

## Protected material

Quoted examples, code blocks, attributed excerpts, titles, proper names, and
phrases being discussed as examples rather than used are exempt from rewrite
unless the user asks. Flag problems in protected material separately. When
writing about AI writing patterns, illustrative bad examples stay intact.

## Attribution

Content synthesized from conorbronsdon/avoid-ai-writing (MIT),
blader/humanizer (MIT, direct absorbs: shadowboxing, scar tissue, repeated
openings, casual signposting, gated vocabulary), and
hardikpandya/stop-slop (MIT). avoid-ai-writing itself cross-audits
blader/humanizer, Aboudjem/humanizer-skill, brandonwise vocabulary
research, Wikipedia Signs of AI writing, and tropes.fyi. Keep this skill's
mission: better writing and voice preservation, not detector evasion.
