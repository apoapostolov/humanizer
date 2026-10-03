<!-- markdownlint-disable MD033 -->

<div align="center">

  <h1>Humanizer Suite</h1>

  <p>Help AI agents write with a human voice, explain clearly, and catch stale AI prose.</p>

  <p>
    <a href="#readme"><img src="https://img.shields.io/badge/Type-Agent%20skills-555" alt="Type: Agent skills"></a>
    <a href="#readme"><img src="https://img.shields.io/badge/Format-Markdown-555" alt="Format: Markdown"></a>
    <a href="https://github.com/apoapostolov/humanizer/releases/latest"><img src="https://img.shields.io/github/v/release/apoapostolov/humanizer" alt="Latest stable release version"></a>
    <a href="https://github.com/apoapostolov/humanizer/releases/latest"><img src="https://img.shields.io/github/release-date/apoapostolov/humanizer?display_date=published_at&amp;label=last%20release" alt="Published date of latest stable release"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-green" alt="License: MIT"></a>
  </p>

</div>

Installable writing skills for AI agents that need to sound like a careful
writer, explain a procedure plainly, or check a draft for familiar AI prose
signals. Choose the skill for the job in front of you; a mixed document does
not need to pass through the whole suite.

## Current source: 2.12.8

The em dash rule is tiered instead of absolute. Procedural text gets none, so
an instruction is never ambiguous about where a clause ends. Reader-facing
technical prose and marketing may ration one per passage. Narrative prose is
judged case by case, where a dash can carry a real interruption.

The latest GitHub release is 2.12.7; the current source tree adds the tiering.

See [CHANGELOG.md](CHANGELOG.md) for the full history.

## Choose a Skill

| Need | Skill | Version |
| --- | --- | --- |
| Preserve a writer's voice while removing stiff or generic prose | [`humanizer`](skills/humanizer/) | `1.7.4` |
| Write procedures, errors, runbooks, and clear technical sections | [`simple-english`](skills/simple-english/) | `2.4.2` |
| Scan for AI-writing signals or verify that an edit preserved structure | [`ai-writing-detector`](skills/ai-writing-detector/) | `1.1.9` |
| Draft reader-facing prose with a deterministic Vale review gate | [`writing-prose`](skills/writing-prose/) | `1.2.3` |
| Pick the right register for an audience: three modes plus tone overlays | [`writing-voice`](skills/writing-voice/) | `1.1.0` |

Use one skill for the job a section needs.

## What You Can Do

- **Rewrite without replacing the writer.** Humanizer keeps facts, technical terms, uncertainty, point of view, and deliberate style while cutting filler.
- **Control technical form when clarity is the priority.** Simple English offers strict and STE-flavored modes plus a Python linter.
- **Measure signals without making authorship claims.** AI Writing Detector reports issue bands and can compare a before/after pair for damaged code, URLs, or structure.
- **Pair editorial judgment with a repeatable gate.** Writing Prose ships its Vale configuration, house rules, and long-form references with the skill.
- **Match the audience.** Writing Voice picks Chat, Human, or Worker, then optional tone overlays. It routes to Humanizer's voice-profile table and does not invent a personality the source never had.

## Minimal Examples

Humanizer is a writing workflow rather than a command-line filter. Install the skill, then ask the agent to rewrite, clean up, critique, detect, or minimally edit supplied text. Improve the writing without inventing facts or a new personality.

Simple English includes a deterministic linter:

```bash
python3 skills/simple-english/scripts/voice_lint.py path/to/draft.md
```

AI Writing Detector exposes a zero-dependency Node.js scan and a preservation check:

```bash
node skills/ai-writing-detector/scripts/analyze.js path/to/file.md
node skills/ai-writing-detector/scripts/validate-cli.js before.md after.md
bash skills/ai-writing-detector/scripts/smoke.sh
```

Writing Prose runs the bundled Vale rules through one wrapper:

```bash
bash skills/writing-prose/scripts/vale-lint.sh path/to/draft.md
```

Detector output is `signals_only`. It is not proof of authorship and should not be used as a score to chase.

## Install

Each directory under `skills/` is self-contained. Copy only the skill you need:

```bash
cp -R skills/humanizer ~/.claude/skills/
```

Other supported skill directories include `~/.codex/skills/` and `~/.openclaw/skills/`.

For a Hermes category layout:

```bash
mkdir -p ~/.hermes/skills/writing
cp -R skills/humanizer ~/.hermes/skills/writing/
cp -R skills/simple-english ~/.hermes/skills/writing/
cp -R skills/ai-writing-detector ~/.hermes/skills/writing/
cp -R skills/writing-prose ~/.hermes/skills/writing/
cp -R skills/writing-voice ~/.hermes/skills/writing/
```

Or install an individual package with `skills.sh`:

```bash
npx skills add apoapostolov/humanizer --skill humanizer
npx skills add apoapostolov/humanizer --skill simple-english
npx skills add apoapostolov/humanizer --skill ai-writing-detector
npx skills add apoapostolov/humanizer --skill writing-prose
npx skills add apoapostolov/humanizer --skill writing-voice
```

## Repository Layout

```text
skills/
├── humanizer/
├── simple-english/
├── ai-writing-detector/
├── writing-prose/
└── writing-voice/
```

Each package contains its own `SKILL.md`, agent metadata, references, and any runtime scripts it needs. Maintainer guidance is in [AGENTS.md](AGENTS.md).

## Support

Support, feedback, and feature ideas: [@ApoMakesMods](https://x.com/ApoMakesMods) on X.

## License

This repository is licensed under the [MIT License](LICENSE).

Simple English source limits and credits are documented in [`source-and-limits.md`](skills/simple-english/references/source-and-limits.md). Detector engine attribution is in [`ATTRIBUTION.md`](skills/ai-writing-detector/references/ATTRIBUTION.md).
