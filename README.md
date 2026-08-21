# Humanizer Suite

Four installable writing skills for AI agents: natural rewrites, controlled
technical prose, mechanical writing signals, and Vale-gated editorial work.

## What's New in 2.0.1

Humanizer 1.1.1 absorbs blader/humanizer v2.9.2 - v2.11.0: two new patterns
(shadowboxing objections, editorial scar tissue), repeated-sentence-opening and
casual-signposting extensions, and figurative "gated" vocabulary with a
technical-usage carve-out.

## What's New in 2.0.0

`plain-english` is now `simple-english` (v2.0.0): merged the Hermes
optional-skill port of ASD-STE100 Issue 9 into the existing STE skill. Full
rule catalog with rule-number citations, modal ladder, slop-to-simple
substitution table, word-counting rules, warnings-before-steps pattern,
verification checklist, and beyond-documentation use cases. Same voice_lint.py
workflow, same strict/STE-flavored modes.

## What's New in 1.1.0

- User samples, medium, audience, and source voice now outrank generic pattern
  rules in Humanizer.
- Plain English separates strict form control from STE-flavored diagnosis.
- Writing Prose treats Vale findings as reread prompts rather than automatic
  rewrite instructions.
- Cross-skill tests now protect the rule that mixed documents are handled by
  section job. Filter stacks play no part in that path.

See [CHANGELOG.md](CHANGELOG.md) for the complete release history and
[SOURCES.md](SOURCES.md) for upstream pins and ingest policy.

## Choose a Skill

| Need | Skill | Version |
| --- | --- | --- |
| Preserve a writer's voice while removing stiff or generic prose | [`humanizer`](skills/humanizer/) | `1.2.0` |
| Write procedures, errors, runbooks, and clear technical sections | [`simple-english`](skills/simple-english/) | `2.4.0` |
| Scan for AI-writing signals or verify that an edit preserved structure | [`ai-writing-detector`](skills/ai-writing-detector/) | `1.0.6` |
| Draft reader-facing prose with a deterministic Vale review gate | [`writing-prose`](skills/writing-prose/) | `1.1.1` |

Use one skill for the job a section needs. A mixed document does not need to
pass through all four in sequence.

## Capabilities

- **Rewrite without replacing the writer.** Humanizer keeps facts, technical
  terms, uncertainty, point of view, and deliberate style while cutting filler.
- **Control technical form when clarity is the priority.** Plain English offers
  strict and STE-flavored modes plus a Python linter.
- **Measure signals without making authorship claims.** AI Writing Detector
  reports issue bands and can compare a before/after pair for damaged code,
  URLs, or structure.
- **Pair editorial judgment with a repeatable gate.** Writing Prose ships its
  Vale configuration, house rules, and long-form references with the skill.

## Minimal Examples

Humanizer is a writing workflow rather than a command-line filter. Install the
skill, then ask the agent to rewrite, clean up, critique, detect, or minimally
edit supplied text. Its core rule is simple: improve the writing without
inventing facts or a new personality.

Plain English includes a deterministic linter:

```bash
python3 skills/simple-english/scripts/voice_lint.py path/to/draft.md
```

AI Writing Detector exposes a zero-dependency Node.js scan and a preservation
check:

```bash
node skills/ai-writing-detector/scripts/analyze.js path/to/file.md
node skills/ai-writing-detector/scripts/validate-cli.js before.md after.md
bash skills/ai-writing-detector/scripts/smoke.sh
```

Writing Prose runs the bundled Vale rules through one wrapper:

```bash
bash skills/writing-prose/scripts/vale-lint.sh path/to/draft.md
```

Detector output is `signals_only`. It is not proof of authorship and should not
be used as a score to chase.

## Install

Each directory under `skills/` is self-contained. Copy only the skill you need:

```bash
cp -R skills/humanizer ~/.claude/skills/
```

Other supported skill directories include `~/.codex/skills/` and
`~/.openclaw/skills/`.

For a Hermes category layout:

```bash
mkdir -p ~/.hermes/skills/writing
cp -R skills/humanizer ~/.hermes/skills/writing/
cp -R skills/simple-english ~/.hermes/skills/writing/
cp -R skills/ai-writing-detector ~/.hermes/skills/writing/
cp -R skills/writing-prose ~/.hermes/skills/writing/
```

Or install an individual package with `skills.sh`:

```bash
npx skills add apoapostolov/humanizer --skill humanizer
npx skills add apoapostolov/humanizer --skill simple-english
npx skills add apoapostolov/humanizer --skill ai-writing-detector
npx skills add apoapostolov/humanizer --skill writing-prose
```

## Repository Layout

```text
skills/
├── humanizer/
├── simple-english/
├── ai-writing-detector/
└── writing-prose/
```

Each package contains its own `SKILL.md`, agent metadata, references, and any
runtime scripts it needs. Maintainer guidance is in [AGENTS.md](AGENTS.md).

## License and Attribution

This repository is licensed under the [MIT License](LICENSE).

Simple English source limits and credits are documented in
[`source-and-limits.md`](skills/simple-english/references/source-and-limits.md).
Detector engine attribution is in
[`ATTRIBUTION.md`](skills/ai-writing-detector/references/ATTRIBUTION.md).
