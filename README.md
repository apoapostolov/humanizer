# Humanizer

Humanizer is a reusable AI writing skill for turning obviously generated prose into writing that sounds natural, specific, and human.

It focuses on two jobs:

- detecting common signs of AI-generated writing
- rewriting text so it preserves meaning while improving voice, clarity, and audience fit

The skill is designed for agent systems that load `SKILL.md` from a local skills directory, including OpenClaw, Claude, Codex, and several VS Code agent setups.

## What It Does

Humanizer helps agents:

- remove inflated, robotic, or generic phrasing
- preserve meaning while improving tone and rhythm
- adapt rewrites to a target audience or platform
- preserve the writer's voice instead of flattening it
- flag hype, filler, vague claims, and manipulative wording
- use critique-only, cleanup, rewrite, or voice-preserving modes

## Repository Contents

- [`SKILL.md`](./SKILL.md) - the main skill definition
- [`EXAMPLES.md`](./EXAMPLES.md) - concrete before/after examples for example-focused models
- [`CHANGELOG.md`](./CHANGELOG.md) - release notes
- [`LICENSE`](./LICENSE) - MIT license

## Installation

### OpenClaw

OpenClaw can load shared skills from `~/.openclaw/skills/` or workspace-specific skills from `~/.openclaw/workspace/skills/`.

Install as a shared skill:

```bash
mkdir -p ~/.openclaw/skills/humanizer
cp SKILL.md ~/.openclaw/skills/humanizer/
cp EXAMPLES.md ~/.openclaw/skills/humanizer/
```

Install as a workspace skill:

```bash
mkdir -p ~/.openclaw/workspace/skills/humanizer
cp SKILL.md ~/.openclaw/workspace/skills/humanizer/
cp EXAMPLES.md ~/.openclaw/workspace/skills/humanizer/
```

Notes:

- Use `~/.openclaw/skills/` when you want the skill available across agents and workspaces.
- Use `~/.openclaw/workspace/skills/` when you want it scoped to the current workspace.
- Restart the relevant OpenClaw session if the skill does not appear immediately.

### Claude

Claude Desktop uses `~/.claude/skills/`.

```bash
mkdir -p ~/.claude/skills/humanizer
cp SKILL.md ~/.claude/skills/humanizer/
cp EXAMPLES.md ~/.claude/skills/humanizer/
```

After copying, restart Claude Desktop or start a new session so the skill can be discovered.

### Codex

Codex uses `$CODEX_HOME/skills/` when `CODEX_HOME` is set. On this machine, the default location is `~/.codex/skills/`.

Default install:

```bash
mkdir -p ~/.codex/skills/humanizer
cp SKILL.md ~/.codex/skills/humanizer/
cp EXAMPLES.md ~/.codex/skills/humanizer/
```

Portable install when `CODEX_HOME` is set:

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills/humanizer"
cp SKILL.md "${CODEX_HOME:-$HOME/.codex}/skills/humanizer/"
cp EXAMPLES.md "${CODEX_HOME:-$HOME/.codex}/skills/humanizer/"
```

Start a new Codex session after installation if the skill is not picked up automatically.

### VS Code

VS Code itself does not define a single universal skills directory. The install path depends on which agent extension or tool you use inside VS Code.

Common local paths on this machine include:

- GitHub Copilot: `~/.copilot/skills/`
- Continue: `~/.continue/skills/`
- Cline: `~/.cline/skills/`
- Roo Code: `~/.roo/skills/`

Example for GitHub Copilot:

```bash
mkdir -p ~/.copilot/skills/humanizer
cp SKILL.md ~/.copilot/skills/humanizer/
cp EXAMPLES.md ~/.copilot/skills/humanizer/
```

Example for Continue:

```bash
mkdir -p ~/.continue/skills/humanizer
cp SKILL.md ~/.continue/skills/humanizer/
cp EXAMPLES.md ~/.continue/skills/humanizer/
```

If your VS Code agent uses a different local skills folder, copy the same two files into a `humanizer/` subdirectory there.

## Verify Installation

After installing, ask the agent something like:

> Humanize this text and keep the original voice.

If the agent supports skill discovery or listing, confirm that `humanizer` appears in its available skills.

## Recommended Usage

Humanizer works best when the user provides:

- the original text
- the intended audience or platform
- the desired tone
- any phrases, styles, or words to avoid

Examples:

- "Humanize this for LinkedIn. Keep it thoughtful, not corporate."
- "Make this sound natural but keep my voice."
- "Critique this for AI tells only."
- "Rewrite this for an internal memo. Clear and direct."

## Version

Current version: `1.0.1`

See [`CHANGELOG.md`](./CHANGELOG.md) for release notes.

## License

MIT. See [`LICENSE`](./LICENSE).
