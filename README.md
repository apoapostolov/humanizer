<div align="center">

# Humanizer Suite

**Writing skills that help AI agents produce clear, natural prose.**

Four installable skills, one consistent design: clear, specific, and
readable output. No AI-sounding filler, no form-slop, no walls of text.

</div>

---

## What this is

A suite of writing skills for AI agents. Each skill covers one layer of the
problem, from rewriting to linting to detection:

| Skill | Version | What it does |
| --- | --- | --- |
| [**humanizer**](#humanizer) | `1.1.0` | Rewrites stiff prose while preserving the writer's voice |
| [**plain-english**](#plain-english) | `1.1.0` | Strict procedures or a lighter technical clarity pass |
| [**ai-writing-detector**](#ai-writing-detector) | `1.0.5` | Signals-only AI-writing scan and preservation check |
| [**writing-prose**](#writing-prose) | `1.1.0` | Reader-focused prose craft with a judgment-led lint gate |

Pick by job:

- **humanizer** for essays, social posts, memos, and voice-preserving cleanup
- **plain-english** for procedures, errors, runbooks, and technical sections
- **ai-writing-detector** for scores and issue lists, or to check that an edit
  left code, URLs, and structure alone. Not authorship proof. Not evasion.
- **writing-prose** for reader-facing prose craft with a Vale-assisted
  editorial pass: articles, product copy, criticism, and long replies

---

## Humanizer

Turns stiff or generated-sounding prose into clear, specific writing that keeps
the author's meaning and voice.

**Who it's for:** anyone who needs natural-sounding text that still reads like
the person who wrote it. Social posts, essays, memos, fiction, long replies.

### Before / after

| Default  ·  padded | Humanizer  ·  sharp |
| --- | --- |
| Frankly, the whole rollout was a disaster from start to finish, and the communication around it only made things worse in ways that were deeply frustrating and ultimately avoidable. | Frankly, the rollout was a mess, and the communication around it made everything worse. |

Same bluntness. Only the padding is gone.

| Default  ·  vague | Humanizer  ·  specific |
| --- | --- |
| The scheduler exhibits a number of performance bottlenecks that significantly degrade throughput under bursty workloads. | The scheduler slows down under bursty workloads because queue scans get expensive at higher concurrency. |

The mechanism survives. No vague claims, no invented fixes.

### What it does

- strips inflated, generic, promotional, and robotic phrasing
- keeps facts, uncertainty, terms of art, and deliberate style
- fits audience, platform, and tone
- works across vocabulary, syntax, paragraphs, point of view, dialogue,
  setting, and delivery as one system
- runs detect-only audits with severity triage, or minimal in-place edits
- uses tiered word tables without treating hits as proof of authorship
- silent required-checks QA, optional long-form diagnostics, provenance note
- critiques a draft without rewriting it

Depth: a core 55-pattern catalog, extended publication tells through pattern
73, Tier 1A/1B vocabulary tables, never-inject rewrite guardrails, silent
post-edit checks.

Goal: **better writing.** Not AI-detector evasion. Not fake typos or forced
imperfection.

---

## Plain English

ASD-STE100-style controlled writing: short sentences, active voice, plain
verbs, no marketing fluff, no em dash. Ships a deterministic linter,
`scripts/ste_lint.py`, that scores violations per 100 words.

**Who it's for:** anyone writing docs, PR bodies, error messages, runbooks,
or anything a reader must understand fast.

### Before / after

The same product README, before and after:

<!-- vale off -->
| Default  ·  191 words · 4.19/100w · 4 em-dashes | STE  ·  169 words · 1.18/100w · 0 em-dashes |
| --- | --- |
| Traditional caches miss constantly in LLM workloads because users rarely phrase the same question identically — fluxcache solves this by embedding incoming prompts and matching them against previously cached queries within a configurable similarity threshold. It ships with sensible defaults so you can get semantic caching running in a few lines of code, while exposing the knobs — similarity thresholds, TTLs, namespacing, custom scoring — that real applications need as they scale. | A normal cache matches requests by exact text. A small change in wording then causes a cache miss. fluxcache compares the meaning of a new prompt with the prompts already in the cache. If two prompts are close enough in meaning, fluxcache returns the stored response instead of a new call to the model. This lowers the number of calls to the model and cuts the cost and response time of the application. |
<!-- vale on -->

Modes: **STE-flavored** for technical explanations and **strict** for
procedures, safety, and errors. In flavored mode, sentence length and
contractions are review findings rather than automatic failures.

```bash
python3 skills/plain-english/scripts/ste_lint.py path/to/draft.md
```

---

## AI writing detector

Companion to humanizer. Vendors a zero-dependency JS engine, then wraps
output in a **signals_only** report so agents never read scores as authorship.

**Who it's for:** anyone who needs a mechanical signal, not a verdict. Audit
a draft, or verify that an edit left code, URLs, and structure intact.

```bash
node skills/ai-writing-detector/scripts/analyze.js path/to/file.md
node skills/ai-writing-detector/scripts/validate-cli.js before.md after.md
bash skills/ai-writing-detector/scripts/smoke.sh
```

### What you get

- `interpretation: signals_only`: no top-level document classification
- severity-tiered bands with warnings before any score
- short-input reliability: a 2-word echo is flagged, not scored as "clean"
- batch mode, `--quiet`, `--min-severity`, `--summary-only`
- preservation validate: `--fail-on-warnings` when the edit must not break
  code, URLs, or structure

Default output drops `document_classification`. For quality rewrites, use
humanizer. **Do not chase the score.**

---

## Writing-prose

Reader-facing prose craft with a deterministic Vale lint gate. Editorial
rules plus a house style layer (HermesHouse: em-dash ban, word choice,
AI-slop markers, weasel words) over a whitelisted Microsoft pack. The same
lint rules run on any machine with the vale binary.

**Who it's for:** anyone writing articles, docs, criticism, or long replies
who wants a mechanical check without letting the linter rewrite the voice.

```bash
bash skills/writing-prose/scripts/vale-lint.sh path/to/draft.md
```

The `vale/` folder ships the complete house config and style rules. Editorial
references cover long-form diagnostics, book work, and rewrite cost patterns.

---

## Install

### Option 1 · Single skill

```bash
cp -R skills/humanizer ~/.claude/skills/
# or any skills dir: ~/.codex/skills/  ~/.openclaw/skills/  etc.
```

### Option 2 · Category folder (Hermes-style)

```bash
mkdir -p ~/.hermes/skills/writing
cp -R skills/humanizer ~/.hermes/skills/writing/
cp -R skills/plain-english ~/.hermes/skills/writing/
cp -R skills/ai-writing-detector ~/.hermes/skills/writing/
cp -R skills/writing-prose ~/.hermes/skills/writing/
```

### Option 3 · skills.sh CLI

```bash
npx skills add apoapostolov/humanizer --skill humanizer
npx skills add apoapostolov/humanizer --skill plain-english
npx skills add apoapostolov/humanizer --skill ai-writing-detector
npx skills add apoapostolov/humanizer --skill writing-prose
```

---

## Which skill fits

| Need | Skill |
| --- | --- |
| Natural voice, social, essay, fiction polish | humanizer |
| Procedures, errors, runbooks, technical clarity | plain-english |
| Score, issue list, keep code+URLs intact after edit | ai-writing-detector |
| Reader-facing prose craft with a deterministic gate | writing-prose |
| Authorship or integrity claim | provenance evidence, not a detector score |

---

## Repository layout

```text
humanizer/
├── AGENTS.md
├── CHANGELOG.md
├── LICENSE
├── README.md
├── SOURCES.md          # version pins and upstream ingest policy
└── skills/
    ├── humanizer/
    ├── plain-english/
    ├── ai-writing-detector/
    └── writing-prose/
        ├── SKILL.md
        ├── agents/openai.yaml
        ├── references/
        └── vale/       # vale.ini + HermesHouse + Microsoft styles
```

Each folder under `skills/` is a full installable package. Upstream clone
pins live only in `SOURCES.md`, never inside skill runtime docs.

---

## Version

| Component | Version |
| --- | --- |
| Package | `1.1.0` |
| humanizer | `1.1.0` |
| plain-english | `1.1.0` |
| ai-writing-detector | `1.0.5` |
| writing-prose | `1.1.0` |

Ingest-only updates bump **patch** only. New packaged skill bumps **minor**.
See [CHANGELOG.md](CHANGELOG.md) and [SOURCES.md](SOURCES.md).

---

## License

MIT. See [LICENSE](LICENSE).

Plain-english linter and episode kit credit:
`skills/plain-english/references/source-and-limits.md`. ASD-STE100 stays
copyright of its publisher; this repo does not ship the full standard.

Detector engine credit:
`skills/ai-writing-detector/references/ATTRIBUTION.md`.
