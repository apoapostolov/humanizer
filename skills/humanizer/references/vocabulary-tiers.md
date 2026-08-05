<!-- markdownlint-disable MD013 -->

# Vocabulary tiers and phrase tables

Editorial replacement tables adapted from
[conorbronsdon/avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing)
v3.22.3 (MIT). Use them to choose plainer wording during rewrites and audits.

These words are **not** proof of AI authorship. Many appear in ordinary human
prose, second-language writing, and technical genres. Treat hits as prompts:

- Tier 1A: prefer a plain substitute; a cluster is a stronger production signal
  than a single hit, still not authorship proof.
- Tier 1B: clarity and formality edits. Same fix as 1A, weaker claim. A 1B hit
  alone is **not** evidence of machine authorship.
- Tier 2: rewrite when two or more cluster in one paragraph without earning their
  weight.
- Tier 3: only act when density makes the prose vague praise instead of content.
- Never swap a correct domain term for a weaker synonym to game a list.
- Match inflected forms (adverb, gerund, plural, conjugation) unless context gives
  the variant a different honest meaning.
- In **detect** mode, report Tier 1A and Tier 1B separately. Do not present a
  wordiness fix as authorship evidence.

The "appears far more often in AI text" claim behind Tier 1A is a **convention
inherited from upstream research** (including brandonwise/humanizer-influenced
lists), not a ratio this package has measured. Treat 1A as a useful editorial
band, not a verified statistic.

## Tier 1A — Prefer plain substitutes (frequency-band markers)

Both 1A and 1B are usually replaced in cleanup and rewrite. What differs is what
a flag means in detect mode.

| Prefer over | Prefer |
| --- | --- |
| delve / delve into | explore, dig into, look at |
| landscape (metaphor) | field, space, industry, world |
| tapestry | name the actual complexity |
| realm | area, field, domain |
| paradigm | model, approach, framework |
| embark | start, begin |
| beacon | rewrite with a concrete claim |
| testament to | shows, proves, demonstrates |
| robust | strong, reliable, solid |
| comprehensive | thorough, complete, full |
| cutting-edge | latest, newest, advanced |
| leverage (verb) | use |
| pivotal | important, key, critical |
| underscores | highlights, shows |
| meticulous / meticulously | careful, detailed, precise |
| seamless / seamlessly | smooth, easy, without friction |
| game-changer / game-changing | name what changed and why it matters |
| hit differently / hits different | say what changed, or cut |
| watershed moment | turning point, shift, or what changed |
| marking a pivotal moment | state what happened |
| the future looks bright | specific claim or cut |
| only time will tell | specific claim or cut |
| nestled | is located, sits, is in |
| vibrant | name what is active, or cut |
| thriving | growing, active, or cite a number |
| despite challenges… continues to thrive | name challenge and response, or cut |
| showcasing | showing, demonstrating, or cut the clause |
| deep dive / dive into | look at, examine, explore |
| unpack / unpacking | explain, break down, walk through |
| bustling | busy, active, or name what makes it busy |
| intricate / intricacies | complex, detailed, or name the complexity |
| complexities | name them, or use problems / details |
| ever-evolving | changing, growing, or describe how |
| enduring | lasting, long-running, or cite duration |
| daunting | hard, difficult, challenging |
| holistic / holistically | complete, full, whole, or list what is included |
| actionable | practical, useful, concrete |
| impactful | effective, significant, or name the impact |
| learnings | lessons, findings, takeaways |
| thought leader / thought leadership | expert, authority, or name the contribution |
| best practices | what works, proven methods, standard approach |
| at its core | cut; state the claim |
| synergy / synergies | name the combined effect |
| interplay | relationship, connection, interaction |
| keen (intensifier) | interested, eager, or cut |
| genuinely / genuine (intensifier) | cut; state the fact |
| symphony (metaphor) | name the coordination or combination |
| embrace (metaphor) | adopt, accept, use, switch to |
| load-bearing (metaphor) | essential, critical, necessary, or name what breaks |
| lean into | accept, embrace, or name the specific move |
| double down | commit, increase, or name what changed |
| take a step back | reconsider, or cut |
| moving forward | next, from now, or cut |
| circle back | return to, revisit, or cut |
| on the same page | aligned, agreed, or name the agreement |

**load-bearing carve-out:** unhyphenated "load bearing" is ordinary English.
Hyphenated `load-bearing` before a literal structural noun (wall, beam, column,
joist, truss, member, footing, slab, stud, partition, masonry, lintel, pier,
rafter, girder, capacity), optionally with one material or position adjective,
is building terminology. Abstract nouns such as structure, element, frame, or
foundation still count as metaphorical when the claim is rhetorical.

In technical docs, keep `robust`, `comprehensive`, `seamless`, `ecosystem`, and
literal `leverage` when they are standard terms of art.

## Tier 1B — Clarity edits (not authorship evidence)

Wordiness and inflated formality. Replacing them is good writing regardless of
who wrote the sentence. In detect mode, label these as clarity suggestions, not
machine-authorship signals.

| Prefer over | Prefer |
| --- | --- |
| utilize | use |
| in order to | to |
| due to the fact that | because |
| serves as | is |
| features (verb) | has, includes |
| boasts | has |
| presents (inflated) | is, shows, gives |
| commence | start, begin |
| ascertain | find out, determine, learn |
| endeavor | effort, attempt, try |

## Tier 2 — Act when two or more cluster in one paragraph

| Prefer over | Prefer |
| --- | --- |
| harness | use, take advantage of |
| navigate / navigating | work through, handle, deal with |
| foster | encourage, support, build |
| elevate | improve, raise, strengthen |
| unleash | release, enable, unlock |
| streamline | simplify, speed up |
| empower | enable, let, allow |
| bolster | support, strengthen, back up |
| spearhead | lead, drive, run |
| resonate / resonates with | connect with, appeal to, matter to |
| revolutionize | change, transform, reshape, or name the change |
| facilitate / facilitates | enable, help, allow, run |
| underpin | support, form the basis of |
| nuanced | specific, subtle, detailed, or name the nuance |
| crucial | important, key, necessary |
| multifaceted | name the facets, or cut |
| ecosystem (metaphor) | system, community, network, market |
| myriad | many, numerous, or give a number |
| plethora | many, a lot of, or give a number |
| encompass | include, cover, span |
| catalyze | start, trigger, accelerate |
| reimagine | rethink, redesign, rebuild |
| galvanize | motivate, rally, push |
| augment | add to, expand, supplement |
| cultivate | build, develop, grow |
| illuminate | clarify, explain, show |
| elucidate | explain, clarify, spell out |
| juxtapose | compare, contrast, set side by side |
| paradigm-shifting | name what shifted |
| transformative / transformation | name what changed and how |
| cornerstone | foundation, basis, key part |
| paramount | most important, top priority |
| poised (to) | ready, set, about to |
| burgeoning | growing, emerging, or cite a number |
| nascent | new, early-stage, emerging |
| quintessential | typical, classic, defining |
| overarching | main, central, broad |
| quietly (magic adverb) | cut, or name the concrete contrast |
| deeply (significance collocations only: deeply integrated / committed / rooted) | cut, or name what runs deep |
| underpinning / underpinnings | basis, foundation, what supports |

Literal "deeply nested", "cares deeply", and similar uses do not count toward a
cluster.

## Tier 3 — Act only at high density

Replace some instances with specifics (numbers, comparisons, mechanisms) when
the text is saturated:

significant / significantly, innovative / innovation, effective / effectively,
dynamic / dynamics, scalable / scalability, compelling, unprecedented,
exceptional / exceptionally, remarkable / remarkably, sophisticated,
instrumental, world-class / state-of-the-art / best-in-class, verbatim.

`verbatim` is often redundant with the verb. Keep it in legal, research, or QA
registers where it is a term of art.

## Tier 3 phrases — repetition or multi-phrase clusters

Flag when the same phrase appears twice, or when three or more distinct phrases
from this list appear in one piece:

| Phrase | Prefer |
| --- | --- |
| emerging sector / space / category | name the sector or what is emerging |
| the integration of X with Y | name what changes for the user |
| the intersection of X and Y | name the specific overlap that matters |
| community-driven | name what the community does |
| long-term sustainability | name horizon and constraint |
| user engagement | name the action (clicks, retention, comments) |
| decentralized compute | name the architecture or cut |
| (sustainable) reward emissions | cite schedule and sink |
| tokenized incentive structures | name the mechanism |
| designed for long-term X | drop "designed for"; state the property |

## Template phrases

Rewrite slot-fill constructions:

- "a [adjective] step towards [adjective] AI infrastructure" → name capability,
  benchmark, or outcome
- "a [adjective] step forward for [noun]" → name what changed
- "Whether you're [X] or [Y]" → address the real audience, or cut
- "I recently had the pleasure of [verb]-ing" → "I talked to," "I read," "I
  attended"

## Throat-clearing openers and emphasis crutches

Announcement phrases that delay the point. Cut them and state the content
directly. (Adapted from hardikpandya/stop-slop, MIT.)

Throat-clearing openers:

- "Here's the thing:" / "Here's what / this / that [X]"
- "Here's why [X]" / "Here's the problem though"
- "The uncomfortable truth is" / "The truth is" / "The reality is"
- "It turns out" / "The real [X] is"
- "Let me be clear" / "I'll say it again" / "I'm going to be honest"
- "Can we talk about" / "Here's what I find interesting"

Emphasis crutches (delete — they add no meaning):

- "Full stop." / "Period." / "Let that sink in."
- "This matters because" / "Here's why that matters"
- "Make no mistake" / "I promise"
- "X is a feature, not a bug" / "Dressed up as"

Meta-commentary (the text announcing its own structure):

- "Hint:" / "Plot twist:" / "Spoiler:"
- "You already know this, but" / "But that's another post"
- "The rest of this essay explains..." / "Let me walk you through..."
- "In this section, we'll..." / "As we'll see..." / "I want to explore..."

Vague declaratives that announce importance without naming the specific thing:

- "The reasons are structural" / "The implications are significant"
- "This is the deepest problem" / "The stakes are high"
- "The consequences are real"

If a sentence says something is important, deep, or structural without showing
the specific thing, cut it or replace it with the specific thing.

## Transition phrases

Prefer structure over stock bridges:

- Moreover / Furthermore / Additionally → and, also, on top of that, or reorder
- In today's X / In an era where → specific context or cut
- It's worth noting that / Notably → state the fact
- Here's what's interesting / Here's what stood out → specific lead-in
- In conclusion / In summary / To summarize → let the close carry content
- When it comes to → name the subject directly
- At the end of the day → cut
- That said / That being said → but, yet, however (do not overuse one substitute)

## Hollow intensifiers and endorsement fluff

Cut or replace: genuine / genuinely (empty intensifier), truly, quite frankly, to
be honest, let's be clear, it's worth noting that, worth reading / checking out /
your time (without a reason).

Say why something matters instead of a generic thumbs-up.

## Source note

Tables and tier logic follow avoid-ai-writing v3.22.3 (Tier 1A/1B split) and
brandonwise/humanizer-influenced tiering. Keep this file as a rewrite aid. The
main diagnosis path remains [pattern-catalog.md](pattern-catalog.md) and the
editing sequence in [humanizing-text.md](humanizing-text.md).
