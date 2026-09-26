# Humanizer Suite

Installable writing skills for AI agents. Each skill does one job. A mixed document does not pass through the whole suite.

## What's New in 2.12.4

Humanizer adds rendered-surface line-break checks, extends its no-invented-experience guardrail to drafting in another person's voice, and absorbs staged-discovery detector guidance. The detector masks quoted material and single-line quote blocks and recognizes narrow staged-discovery variants. Writing Prose now uses Vale 3.23.0 with refreshed Microsoft styles.

See [CHANGELOG.md](CHANGELOG.md) for the full history.

## Choose a Skill

| Need | Skill | Version |
| --- | --- | --- |
| Preserve a writer's voice while removing stiff or generic prose | [`humanizer`](skills/humanizer/) | `1.7.2` |
| Write procedures, errors, runbooks, and clear technical sections | [`simple-english`](skills/simple-english/) | `2.4.1` |
| Scan for AI-writing signals or verify that an edit preserved structure | [`ai-writing-detector`](skills/ai-writing-detector/) | `1.1.7` |
| Draft reader-facing prose with a deterministic Vale review gate | [`writing-prose`](skills/writing-prose/) | `1.2.1` |
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
