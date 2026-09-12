<!-- markdownlint-disable MD013 -->

# Voice from samples

Compile a durable voice profile from the user's own writing. This is the
harvest, approval, and compile loop. Drafting stays with the three modes
and with `humanizer` Voice match.

One pasted sample is still a one-shot `humanizer` Voice match. Run this loop
only when the user asks to save, learn, or set up a lasting profile.

Priority: explicit brief or supplied sample, then tone overlay, then mode,
then this profile, then the baseline.

## When

- "set up my voice", "learn from this", "save this to my voice",
  "build my voice profile", "learn my voice"
- The profile is empty, stale, or they say it sounds wrong
- They reword or reject a draft in a repeatable way

Do not use this loop to mimic someone else, invent beliefs, or attribute
authorship. Detector chase lives in `humanizer` Chase plus
`ai-writing-detector`. This file stores expression, not a cheat sheet.

## Split

| Job | Artifact |
| --- | --- |
| Harvest and compile | this procedure |
| Apply | Chat / Human / Worker as already defined |

Capture and apply stay separate. If the profile is empty, say so in one line
and fall back to the mode tables. Do not invent a voice.

## Steps

1. **Scope and consent.** Person (self only), languages, contexts that
   matter, source policy, retention. Ask before reading private files,
   exports, or session logs. Pasted samples are always enough. Start with
   one or two contexts. A strong thin profile beats a weak six-context one.

2. **Harvest.** User-authored writing only. Classify each source: medium,
   audience, formality, language, recency, authorship (authored / edited /
   transcript / uncertain). Drop system-injected text, forwards, quoted
   replies, and bot output. Keep a small sample of one-word confirmations;
   they are part of Chat voice. Samples beat self-description.

3. **Observe. Do not aspire.** Extract habits with evidence: openings,
   closings, sentence rhythm (short/medium/mixed, how often a long line
   appears), paragraph shape, punctuation (including `..` pauses and
   lowercase starts), lists, hedging, pushback, recurring phrases, aversions,
   emoji and hashtag behavior, language mix, channel deltas. Words they use
   3+ times across samples are fingerprint even if they sit on a humanizer
   tell list: flag later, do not auto-delete from the profile. Label strength
   (`usually` / `often` / `occasionally`). No evidence means write
   `Not calibrated yet.` Never invent.

4. **Propose, then wait.** Show the exact profile bullets and any sample
   file. Wait for a yes on each. On no, drop it.

5. **Write on approval only.** Profile sections and sample-library files.
   Date new rules. If the piece only confirms existing rules, say so.

6. **Log freely, promote slowly.** Mid-session rewords go to an
   observations scratchpad without asking:

   `- [date] [context] what they changed -> pattern. (seen Nx)`

   Bump the count on repeats. Offer promotion at 3 or more occurrences, at
   the end of a writing session, or when they ask. Never auto-promote.

7. **Optional calibration probes.** When fidelity matters, write 3 to 5
   generic / attempt / edit items to a gitignored scratch file. Diff edits
   into add, strengthen, weaken, delete, or split by context. Do not overfit
   one edit into a global rule. Consolidate every 5 to 10 items.

8. **Stop.** They say done, or they accept 5 consecutive probes across at
   least 2 scoped contexts (one context if they scoped it that way). Show
   the profile. Their correction wins immediately.

## Approval gate

Nothing enters the profile or the sample library without an explicit yes.

Ask first for source, scope, date range, and retention.

| Retention | Default | Meaning |
| --- | --- | --- |
| `derived-patterns` | yes | Aggregated tendencies and paraphrases. No verbatim quotes. |
| `approved-examples` | opt-in | User-picked exemplars may be quoted in Examples only. |

The user is ground truth. Voice is style, not impersonation: no signing
their name, no approvals on their behalf, no auth bypass. Drafts that will
be sent as them need a separate go-ahead.

Teach only from same-genre samples. Surface low confidence when samples are
thin or cross-genre. Do not invent a habit an uncovered situation cannot
support. Drop assistant turns and instruction-injected wrappers. Never
auto-approve AI-suspect samples.

## What to store

**Profile** (derived, inspectable):

- Confidence, source summary, date range, sample count, retention
- High-level signature
- Invariants across contexts
- Per-context rules (Voice / Structure / Endings / Avoid), mapped onto
  Chat / Human / Worker
- Cadence, diction, phrasebank, aversions
- Agent-session signals, if evidenced (terse numbered directives, short
  yes = proceed)
- 3 to 8 approved exemplars, or `No approved examples.`
- Dated rules so drift is visible

**Sample library** (approved only):

- `sample-library/<context>/<date>-slug.md`
- One-line *why this sounds like them*, then the piece verbatim
- Contexts that match how they actually write

**Observations** (unapproved scratch):

- Append-only. Promote or drop. Do not treat as voice.

Prefer paraphrase over quote unless they approved the example.

Stated A/B preferences are distinct provenance from measured-from-samples
habits. Keep them labeled separately.

## What NEVER to store

- Raw corpus, chat exports, or session logs as the default. Scratch stays
  gitignored and session-local.
- Unapproved verbatim quotes
- Other people's private writing
- System-injected prompts, bot text, forwarded content
- Beliefs, commitments, emotions, facts, identity claims
- Secrets, credentials, private names or numbers from samples
- One-off task preferences (encode only repeatable voice)
- Detector-evasion tricks
- Public copies of a filled profile or sample library

Capture expression, not identity. Voice rewrites the supplied intent. It
does not decide what they think.

## How the three modes consume it

Load the matching profile section and any approved samples for that
surface. Samples are ground truth for openings, rhythm, and word choice.
Rules are the summary. Shape the channel first, then apply voice. Voice
never rewrites facts, identifiers, or quotes.

| Mode | Reads | Does not |
| --- | --- | --- |
| **Chat** | Messaging / DM / agent-session sections; sample library for chat | `humanizer`, `simple-english`, tone overlay unless named |
| **Human** | Public / email / post sections; samples for that medium. Then load `humanizer`. Profile plus sample outrank humanizer house style when they conflict. | Worker STE. Do not inject personality the samples lack (`humanizer` Never-inject still holds). |
| **Worker** | Aversions and diction only if evidenced. `simple-english` owns structure. | Persona, sample-matched warmth, humanizer |

Tone overlays still compose as `<tone> <mode>`. A compiled profile does
not create a fourth named voice.

Hard bans, safety, and the plain-language floor always win. Voice never
exempts anti-slop gates. A mimic that sounds like the author but
reintroduces banned tells is a reject.

When a humanizer tell list collides with a fingerprint word (they use it on
purpose across samples): forensic leakage (`oaicite`, `grok_card`) still
strips. House bans still win. Other collisions flag for them instead of
auto-substituting.

Keep meaning-preservation as a separate hard gate. Never blend it into a
voice score.

If the profile is missing or still a template: say so in one line. Fall
back to the existing mode tables.

## Pitfalls

- Mimicking content (opinions in samples) instead of expression
- Overfitting one edit into a universal rule
- Flattening Chat vs Human vs Worker into one voice
- Only adding rules. Consolidation must also weaken, delete, and split
- Storing raw corpus by accident
- Vague labels ("direct") with no examples or transformation rules
- Ignoring language switching
- Teaching from unvetted drafts
- Treating polished grammar or a dash habit as artificial when the sample
  uses it on purpose
- Running this loop when a one-shot `humanizer` Voice match is enough

## Related

`writing-voice` (modes and priority), `humanizer` (Human register and
one-shot match), `simple-english` (Worker).
