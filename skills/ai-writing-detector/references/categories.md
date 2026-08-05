<!-- markdownlint-disable MD013 -->

# Category map (engine types)

Local map for **ai-writing-detector**. The executable types live in
`scripts/patterns.js`. Editorial rewrite guidance lives in the sibling skill
**humanizer** (pattern catalog + vocabulary tiers), not in this package’s
SKILL.md.

Upstream origin of the type list:
[avoid-ai-writing `detector/CATEGORIES.md`](https://github.com/conorbronsdon/avoid-ai-writing/blob/main/detector/CATEGORIES.md)
(MIT). This file is rewritten for this package so paths and ownership are
correct.

Three layers (do not force the counts to match):

1. **Engine types** (47) — what `analyze` can flag mechanically
2. **Humanizer editorial catalog** — judgment + rewrite (sibling skill)
3. **Judgment-only tells** — listed in section C; no engine type on purpose

## A. Engine types (direct)

| Detector `type` | Label | Editorial home (sibling / concept) |
|---|---|---|
| `tier1` | AI vocabulary marker | humanizer vocabulary Tier 1A |
| `tier1-clarity` | Wordiness / clarity | humanizer vocabulary Tier 1B (not authorship) |
| `tier2` / `tier3` | Cluster / density vocab | humanizer vocabulary tiers |
| `transition` | AI transition | humanizer transitions |
| `template-phrase` | Template phrase | humanizer templates |
| `tier3-phrase` / `tier3-phrase-cluster` | Boilerplate phrase | humanizer tier-3 phrases |
| `chatbot` | Chatbot artifact | humanizer assistant residue |
| `sycophantic` | Sycophantic tone | humanizer sycophancy |
| `acknowledgment-loop` | Acknowledgment loop | humanizer prompt restatement |
| `filler` | Filler phrase | humanizer filler |
| `hollow-intensifier` | Hollow intensifier | humanizer intensifiers |
| `generic-conclusion` | Generic conclusion | humanizer endings |
| `social-cta-closer` | Engagement-bait closer | humanizer social closers |
| `future-narrative` | Generic future narrative | humanizer future-narrative |
| `lets-construction` | "Let's" opener | humanizer let’s constructions |
| `reasoning-artifact` | Reasoning artifact | humanizer scaffolding |
| `significance-inflation` | Significance inflation | humanizer pattern 1 / extended |
| `novelty-inflation` | Novelty inflation | humanizer novelty |
| `real-actual-inflation` | Real/actual inflation | humanizer pattern 57 |
| `vague-attribution` | Vague attribution | humanizer vague attribution |
| `emotional-flatline` | Emotional flatline | humanizer extended tells |
| `lingering-attention` | Lingering-attention | humanizer pattern 61 |
| `cutoff-disclaimer` | Cutoff disclaimer | humanizer cutoff residue |
| `false-concession` | False concession | humanizer rhetoric |
| `rhetorical-question` | Rhetorical question opener | humanizer openers |
| `formulaic-opener` | Formulaic opener | humanizer openings |
| `speculative-opener` | Speculative scenario opener | humanizer speculative openers |
| `confidence-calibration` | Confidence stacking | humanizer hedges |
| `hedge-stack` | Hedge-stacked prediction | humanizer pattern 56 |
| `parenthetical-hedge` | Parenthetical hedge | humanizer pattern 66 |
| `hashtag-stuff` | Hashtag stuffing | humanizer pattern 62 |
| `bullet-np-list` | Bullet-NP list | humanizer pattern 63 |
| `title-case-header` | Title Case header | humanizer pattern 68 |
| `em-dash` / `formatting` | Em dash / formatting | humanizer dash drama (not authorship proof) |
| `uniformity` | Rhythm uniformity | humanizer rhythm |
| `low-ttr` | Low vocabulary diversity | weak stylometric; never proof alone |
| `ai-placeholder` | Unfilled placeholder | humanizer template residue |
| `ai-citation-markup` | Citation markup leak | humanizer tool fingerprint |
| `ai-utm-source` | AI-tool URL parameter | humanizer tool fingerprint |
| `smart-punct-signature` | Smart-punct signature | weak corroborating only |

`smart-punct-signature` is partial: curly quotes alone are not enough; the engine
requires co-occurrence conditions. Never treat it as conclusive.

## B. Engine-only stylometric / fingerprint types

No phrase lookup; whole-document math or bypass tricks:

| Detector `type` | Label |
|---|---|
| `punct-distribution` | Punctuation distribution |
| `fnword-trigram-entropy` | Grammar repetition |
| `cross-para-burstiness` | Cross-paragraph rhythm |
| `normalization-flag` | Bypass-trick chars (zero-width / homoglyph) |

## C. Judgment-only (no engine type)

These need a reader. They are **not** missing coverage in the engine. Prefer
humanizer detect/critique for them:

- Synonym cycling, copula avoidance, promotional language
- Split "not X, Y" / multi-negation countdown / tailing negation
- Excessive structure, inline-header lists, numbered-list inflation
- Moral-adjective category errors, invented contrast pairs, false ranges
- Notability dump, vague third-party validation, self-labeling significance
- Wall-of-text replies (detector tried and reverted — too many FP)
- Recap-flattery opener
- **Narrated candor** (detector tried and reverted — COI / comparative FP)
- Subjectless fragments / agentless passives (docs carve-outs)
- Diff-anchored writing (changelog carve-outs)
- Manufactured punchlines / staccato drama, aphorism formulas
- Full context/voice profiles beyond `contextMode=general|technical`

## Reporting rules for this package

1. Always separate `tier1` (markers) from `tier1-clarity` (wordiness).
2. Never upgrade a type hit into “AI-written.”
3. Clean engine pass ≠ clean editorial pass (section C still applies).
4. For rewrites after a scan, hand off to humanizer — do not score-chase.
