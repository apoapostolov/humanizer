# Humanizer

Humanizer is a reusable writing skill for turning generated-sounding prose into
clear, specific writing that preserves the author's meaning and voice.

It supports light cleanup, full rewrites, voice-sensitive editing, tone shifts,
fiction and dialogue revision, and systematic editorial audits. One humanization
workflow connects meaning, audience, specificity, voice, structure, and delivery;
a 55-pattern catalog supports deeper diagnosis when needed.

## Capabilities

- remove inflated, generic, promotional, or robotic phrasing
- preserve factual claims, uncertainty, terminology, and deliberate style
- adapt prose to a target audience, platform, and tone
- edit vocabulary, syntax, paragraphs, point of view, dialogue, setting, and
  delivery as one connected system
- repair flat lists, adjective piles, causal piles, pseudo-inventories, and
  false completeness
- identify placeholders, assistant chatter, vague attribution, cutoffs, and
  abrupt voice shifts
- critique a draft without rewriting it

The goal is better writing, not AI-detector evasion or artificial imperfection.

## Repository layout

```text
humanizer/
├── AGENTS.md
├── CHANGELOG.md
├── LICENSE
├── README.md
└── skills/
    └── humanizer/
        ├── SKILL.md
        ├── agents/
        │   └── openai.yaml
        └── references/
            ├── humanizing-text.md
            ├── pattern-catalog.md
            └── examples.md
```

`skills/humanizer/` is the installable skill package. Repository documentation,
release notes, and maintenance guidance remain at the root.

## Installation

Copy the complete `skills/humanizer/` directory so the core skill, UI metadata,
and references remain together.

### OpenClaw

Install as a shared skill:

```bash
mkdir -p ~/.openclaw/skills
cp -R skills/humanizer ~/.openclaw/skills/
```

Install for one workspace:

```bash
mkdir -p ~/.openclaw/workspace/skills
cp -R skills/humanizer ~/.openclaw/workspace/skills/
```

Restart the relevant OpenClaw session if the skill does not appear immediately.

### Claude

```bash
mkdir -p ~/.claude/skills
cp -R skills/humanizer ~/.claude/skills/
```

Start a new Claude session after installation.

### Codex

Default installation:

```bash
mkdir -p ~/.codex/skills
cp -R skills/humanizer ~/.codex/skills/
```

Portable installation when `CODEX_HOME` is set:

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R skills/humanizer "${CODEX_HOME:-$HOME/.codex}/skills/"
```

Start a new Codex session if the skill is not discovered automatically.

### VS Code agents

VS Code does not define one universal skill directory. Copy
`skills/humanizer/` into the skill directory used by the installed agent.

Examples:

```bash
mkdir -p ~/.copilot/skills
cp -R skills/humanizer ~/.copilot/skills/

mkdir -p ~/.continue/skills
cp -R skills/humanizer ~/.continue/skills/
```

Other extensions may use `~/.cline/skills/` or `~/.roo/skills/`.

## Verify installation

Ask the agent:

> Use $humanizer to rewrite this text naturally while preserving my voice.

If the agent supports skill discovery, confirm that `Humanizer` appears in its
skill list. OpenAI-compatible interfaces read the display metadata from
`skills/humanizer/agents/openai.yaml`.

## Usage examples

- “Humanize this for LinkedIn. Keep it thoughtful, not corporate.”
- “Make this sound natural but keep my blunt style.”
- “Critique what makes this sound generated without rewriting it.”
- “Rewrite this internal memo so the decision and owner are clear.”
- “Audit this scene's dialogue and point of view.”

Humanizer works best when the request includes the original text, intended
audience, desired tone, and any phrases or facts that must remain unchanged.

## Version

Current version: `1.1.0`

See [CHANGELOG.md](CHANGELOG.md) for release notes.

## License

MIT. See [LICENSE](LICENSE).
