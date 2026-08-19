<!-- markdownlint-disable MD007 -->

# Tracked ingest sources

Machine-facing version pins for external material regularly reviewed or
ingested into this humanizer skill. **This file is the only source of truth for
last-ingested versions, clone paths, ingest procedure, and package version bump
policy.** Editorial principles and file-mapping live in [`AGENTS.md`](./AGENTS.md).

When the user says **"update humanizer sources"** (or equivalent), follow
[Update procedure](#update-procedure) below. Do not re-read whole upstream trees
from scratch when a pin exists: pull, then diff only what changed after
`last_ingested_ref`.

## Package versions

| Field | Value |
| --- | --- |
| package | `apoapostolov/humanizer` (monorepo) |
| package_version | `2.4.0` |
| package_path | `.` |
| skills | `skills/humanizer/`, `skills/simple-english/`, `skills/ai-writing-detector/`, `skills/writing-prose/` |
| humanizer_skill_version | `1.1.1` |
| simple_english_skill_version | `2.0.0` |
| ai_writing_detector_skill_version | `1.0.5` |
| writing_prose_skill_version | `1.1.0` |
| live_humanizer_path | `~/.hermes/skills/writing/humanizer` |
| live_simple_english_path | `~/.hermes/skills/writing/simple-english` |
| live_ai_writing_detector_path | `~/.hermes/skills/writing/ai-writing-detector` |
| live_writing_prose_path | `~/.hermes/skills/writing/writing-prose` |
| last_sources_sync | `2026-08-17T12:44:55-07:00` |
| last_package_release | `2026-08-17` (2.0.0, plain-english renamed to simple-english + upstream STE catalog merge) |

### Version bump policy (semver)

| Change type | Bump | Example |
| --- | --- | --- |
| Source ingestion only (upstream absorb, pin updates, SOURCES.md, no new public capability story beyond ingested material) | **patch** `0.0.+1` | `1.1.0` → `1.1.1` |
| Skill API / workflow / modes / packaging (new skill folder, install contract) | **minor** `0.+1.0` | `1.0.3` → `1.1.0` |
| Breaking redesign of a skill contract | **major** `+1.0.0` | rare |

Hard rule: **"update humanizer sources"** and other humanizer ingest-only work
MUST bump **patch only**. Do not bump minor for an upstream absorb.

`simple-english` and `ai-writing-detector` keep their own `version` in each
skill's `SKILL.md`. Bump those fields when the skill changes; bump monorepo
`package_version` when the release ships.

After a release-worthy change: bump `package_version` here and in
`CHANGELOG.md` / `README.md`, then set `last_sources_sync` when humanizer
sources were touched.

## Packaged skills (this monorepo)

### simple-english

| Field | Value |
| --- | --- |
| id | `simple-english` |
| status | `packaged_skill` |
| skill_version | `2.0.0` |
| path | `skills/simple-english/` |
| live_clone | `~/.hermes/skills/writing/simple-english` |
| upstream_kit | `https://github.com/woosal1337/blog/tree/main/videos/ep01-the-cure-for-ai-slop` (original); merged 2026-08-17 from Hermes optional-skill `creative/simple-english` (ASD-STE100 Issue 9 catalog, checklist, use-cases) |
| lands_in | monorepo `skills/simple-english/` (SKILL, references, `scripts/voice_lint.py`; canonical agent copy re-homed to `user-profile/writing-voice/scripts/`) |
| note | Strict STE procedures plus a judgment-led flavored mode for technical prose. The linter reports form; it does not own product voice. Formerly `plain-english` (renamed 2026-08-17). |

### ai-writing-detector

| Field | Value |
| --- | --- |
| id | `ai-writing-detector` |
| status | `packaged_skill` |
| skill_version | `1.0.5` |
| path | `skills/ai-writing-detector/` |
| live_clone | `~/.hermes/skills/writing/ai-writing-detector` |
| upstream_engine | `conorbronsdon/avoid-ai-writing` `detector/` @ tag tip `3c0fd8a` (unnecessary-hyphenation, after v3.25.0) |
| lands_in | monorepo `skills/ai-writing-detector/` + `.github/workflows/ai-writing-detector.yml` |
| note | Production signals-only report. Batch summary, quiet, CI smoke. Not rewrite/evasion/authorship. |

### writing-prose

| Field | Value |
| --- | --- |
| id | `writing-prose` |
| status | `packaged_skill` |
| skill_version | `1.1.0` |
| path | `skills/writing-prose/` |
| live_clone | `~/.hermes/skills/writing/writing-prose` |
| upstream_kit | `https://github.com/vale-cli/vale` (binary + style packs; house config is ours) |
| lands_in | monorepo `skills/writing-prose/` (SKILL.md, `references/required-checks.md`, `scripts/vale-lint.sh`, `vale/vale.ini`, `vale/styles/`) |
| note | Vale-assisted prose craft. Editorial judgment owns voice; deterministic findings are reread prompts, not automatic rewrites. |

## Active ingest sources

Sources we regularly pull meaningful **humanizer** skill content from. Order is
priority. Detector-engine file drops land in **ai-writing-detector**, not
humanizer.

### 1. conorbronsdon/avoid-ai-writing

| Field | Value |
| --- | --- |
| id | `avoid-ai-writing` |
| status | `active_ingest` |
| repo | `https://github.com/conorbronsdon/avoid-ai-writing` |
| release_tag | `v3.25.0` |
| release_url | `https://github.com/conorbronsdon/avoid-ai-writing/releases/tag/v3.25.0` |
| last_ingested_version | `3.25.0` |
| last_ingested_ref | `3c0fd8a26689` |
| last_ingested_at | `2026-08-13T12:15:00+03:00` |
| last_checked_at | `2026-08-17T12:44:55-07:00` |
| compare_base | `v3.25.0` |
| local_clone | `avoid-ai-writing` |
| clone_policy | third-party → `<git-ext>` only |
| primary_paths | `SKILL.md`, `CHANGELOG.md`, `detector/CATEGORIES.md`, `detector/patterns.js`, `detector/validate.js`, `README.md` |
| lands_in | **Editorial (humanizer):** `skills/humanizer/references/vocabulary-tiers.md`, `ai-ism-audit.md`, `pattern-catalog.md` (56–73), `SKILL.md`, `required-checks.md`, `humanizing-text.md`, `provenance.md`. **Engine (ai-writing-detector):** `skills/ai-writing-detector/scripts/{patterns,validate,analyze}.js`, `references/categories.md`, measurement/scoring refs |
| ingest_policy | Split by mission. Humanizer absorbs durable editorial patterns, tier tables, audit modes, never-inject. Rewrite into humanizer voice. Reject detector-evasion defaults and authorship-proof theater inside humanizer. **Vendor** JS detector + validate + category map into `skills/ai-writing-detector/` only. Do not put the engine inside humanizer. Corpus/PROOF stay upstream-only (document findings in ai-writing-detector refs). Treat FPR/TPR/AUC as measurement notes, not product claims. |
| next_check | On newer tag than `v3.23.1`, or untagged commits on default branch after `last_ingested_ref` if the user wants tip tracking. |

Diff helpers:

```bash
# After git fetch in local_clone:
git -C avoid-ai-writing fetch --tags origin
git -C avoid-ai-writing tag -l 'v*' --sort=v:refname | tail -5
git -C avoid-ai-writing log --oneline 3c0fd8a26689..origin/main
git -C avoid-ai-writing diff 3c0fd8a26689..origin/main -- SKILL.md CHANGELOG.md detector/CATEGORIES.md README.md
```

### 2. blader/humanizer

| Field | Value |
| --- | --- |
| id | `blader-humanizer` |
| status | `active_ingest` |
| repo | `https://github.com/blader/humanizer` |
| release_tag | `v2.11.0` |
| release_url | `https://github.com/blader/humanizer/releases/tag/v2.11.0` |
| last_ingested_version | `2.11.0` |
| last_ingested_ref | `43c97670b563cfa75e4f16ef00c32e933104d10a` |
| last_ingested_at | `2026-08-17T12:44:55-07:00` |
| last_checked_at | `2026-08-17T12:44:55-07:00` |
| local_clone | `blader-humanizer` |
| clone_policy | third-party → `<git-ext>` only |
| primary_paths | `SKILL.md`, `README.md`, examples, changelog if present |
| lands_in | `skills/humanizer/SKILL.md`, `skills/humanizer/references/humanizing-text.md`, `skills/humanizer/references/ai-ism-audit.md`, `skills/humanizer/references/pattern-catalog.md` (79-80, 11/21 extensions), `skills/humanizer/references/vocabulary-tiers.md` (gated vocabulary), `skills/humanizer/references/required-checks.md` (workflow rules; historical catalog) |
| ingest_policy | Primary same-family upstream. Import durable tells and examples. Do not adopt hard em/en dash bans. Prefer light-edit default for human-authored input. Keep information-over-shape and no-fabrication rules. Voice sample outranks generic style defaults. v2.11.0 plain-language reskin of upstream SKILL.md not adopted (house voice already plain); absorb new tells and FP carve-outs only. |
| next_check | On newer tag than `v2.11.0`, or untagged commits on default branch after `last_ingested_ref` if the user wants tip tracking. |

Diff helpers:

```bash
git -C blader-humanizer fetch --tags origin
git -C blader-humanizer tag -l 'v*' --sort=v:refname | tail -5
git -C blader-humanizer log --oneline 43c97670b563cfa75e4f16ef00c32e933104d10a..origin/main
git -C blader-humanizer diff 43c97670b563cfa75e4f16ef00c32e933104d10a..origin/main -- SKILL.md README.md
```

### 3. hardikpandya/stop-slop

| Field | Value |
| --- | --- |
| id | `stop-slop` |
| status | `active_ingest` |
| repo | `https://github.com/hardikpandya/stop-slop` |
| release_tag | *(none — untagged repo)* |
| last_ingested_version | `tip@8da1f03` |
| last_ingested_ref | `8da1f030185bdfe8471220585162991eaeb970e9` |
| last_ingested_at | `2026-08-04T00:00:00-07:00` |
| last_checked_at | `2026-08-17T12:44:55-07:00` |
| compare_base | `8da1f03` |
| local_clone | `hardikpandya-stop-slop` |
| clone_policy | third-party → `<git-ext>` only |
| primary_paths | `SKILL.md`, `references/phrases.md`, `references/structures.md`, `references/examples.md`, `CHANGELOG.md` |
| lands_in | `skills/humanizer/references/pattern-catalog.md` (false agency, Wh- opener, negative listing, staccato fragments, rhetorical setups, narrator-from-a-distance, announced significance, additive hedge, narrative arc template), `skills/humanizer/references/required-checks.md` (revision gate), `skills/humanizer/references/vocabulary-tiers.md` (throat-clearing openers, emphasis crutches), `skills/humanizer/SKILL.md` (quick checks pointer) |
| ingest_policy | Import durable structural tells: false agency (inanimate subject doing human verb), Wh- opener crutch, negative-listing buildup, staccato fragments, rhetorical setups (*What if...?*, *Here's what I mean:*, *Think about it:*, *And that's okay*), narrator-from-a-distance, announced significance (*this is what X actually looks like*), additive hedge escalation (*not just X but also Y*), narrative arc template (*By the time X, I was Y*), throat-clearing openers, emphasis crutches, business-jargon replacement table. **Reject** absolute adverb bans and hard em-dash bans as authorship proof — house stance stays cluster-based (patterns 7, 12). Scoring rubric (1-10 across 5 dimensions, 35/50 gate) lands as a **revision gate**, not a detector or authorship claim — consistent with `signals-not-proof`. Rewrite into humanizer voice. |
| next_check | Untagged repo — diff `8da1f03..origin/main` on `primary_paths` each scan. |

Diff helpers:

```bash
git -C hardikpandya-stop-slop fetch origin
git -C hardikpandya-stop-slop log --oneline 8da1f030185bdfe8471220585162991eaeb970e9..origin/main
git -C hardikpandya-stop-slop diff 8da1f030185bdfe8471220585162991eaeb970e9..origin/main -- SKILL.md references/
```

## Writing-prose ingest sources

Sources for the `writing-prose` skill. Same update discipline as the humanizer
sources: pins here are the only source of truth; diff after the pin; ingest
only durable gains; patch-only bumps. `kind: release_api` sources are checked
by the scan script via the GitHub releases API (no local clone needed).

### 1. vale-cli/vale

| Field | Value |
| --- | --- |
| id | `vale-cli-vale` |
| status | `active_ingest` |
| kind | `release_api` (Go binary + style packs; no vendored prose) |
| repo | `https://github.com/vale-cli/vale` |
| release_tag | `v3.17.1` |
| release_url | `https://github.com/vale-cli/vale/releases/tag/v3.17.1` |
| last_ingested_version | `3.17.1` |
| last_ingested_at | `2026-08-05` |
| last_checked_at | `2026-08-17T12:44:55-07:00` |
| win11_winget | `errata-ai.Vale` 3.15.1 (winget lags; WSL binary is canonical at 3.17.1) |
| primary_paths | `vale/styles/` (Microsoft pack via `vale sync`), house config compat, release notes |
| lands_in | `skills/writing-prose/vale/{vale.ini, styles/}`, `skills/writing-prose/scripts/vale-lint.sh`, WSL `~/.local/bin/vale`, Win11 winget `errata-ai.Vale` |
| ingest_policy | On a newer release: update the WSL binary from the GitHub release asset; upgrade the Win11 winget package when its manifest catches up; re-run `vale sync` for style packs; verify the house config and gate still pass (`scripts/vale-lint.sh` on the sample set, then `vale --config vale/vale.ini` on a real draft); absorb only durable rule/config gains and keep the house style single-voice. Do not vendor the upstream binary into the skill tree. Pin updates are patch-only. |
| next_check | On a release tag newer than `v3.17.1`, or a winget manifest newer than `3.15.1`. |

## Monitor-only sources

Reviewed for signal; not on every-update ingest unless something meaningful appears.

### op7418/Humanizer-zh

| Field | Value |
| --- | --- |
| id | `humanizer-zh` |
| status | `monitor` |
| repo | `https://github.com/op7418/Humanizer-zh` |
| last_ingested_version | *(none — no general content imported)* |
| last_checked_ref | `91f3d39` |
| last_checked_at | `2026-07-15T04:11:17-07:00` |
| note | Chinese adaptation; last content push 2026-01-19. Check only if new commits. |

### Wikipedia: Signs of AI writing

| Field | Value |
| --- | --- |
| id | `wikipedia-signs-of-ai-writing` |
| status | `monitor` |
| url | `https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing` |
| last_checked_at | `2026-07-15T04:11:17-07:00` |
| note | Primary taxonomy. No git tag; check page history / latest revision on full reviews. |

### GitHub discovery lane

| Field | Value |
| --- | --- |
| id | `github-discovery` |
| status | `discovery` |
| last_checked_at | `2026-07-15T04:11:17-07:00` |
| note | Optional. Promote a repo to `active_ingest` only after a real absorb and a new section in this file. |

## Rejected or on-hold ideas

Do not re-litigate unless upstream evidence improves:

- Detector-score optimization, random typos, fabricated specificity
- Hard em-dash bans as authorship proof
- Shipping third-party detector engines **inside `skills/humanizer/`** (engines
  belong in `skills/ai-writing-detector/` only)
- TTR thresholds as proof of AI authorship
- Mandatory first person in neutral/technical registers
- Using `ai-writing-detector` scores as rewrite targets or integrity verdicts
- `apoapostolov/Forbidden-Lands-2e` as a tracked ingest source (dropped by
  user decision; already-absorbed generalized rules stay in humanizer refs)

## Update procedure

Trigger phrases: `update humanizer sources`, `refresh humanizer upstreams`,
`sync humanizer source versions`, `ingest new humanizer sources`.

1. **Read pins**
   - This file (`SOURCES.md`)
   - `AGENTS.md` maintenance principles and guardrails
   - Current `skills/humanizer/**` package files

2. **For each `status: active_ingest` source**
   - Ensure `local_clone` exists under the correct policy path; clone if missing.
   - `git fetch --tags origin` (or equivalent for the host).
   - Resolve newest release tag and/or default-branch tip.
   - If newest == `last_ingested_version` / `last_ingested_ref` and no newer tag:
     set `last_checked_at` only; skip deep read.
   - If newer:
     - Diff `primary_paths` from `last_ingested_ref` (or `compare_base` tag) to tip.
     - Read upstream changelog between versions when present.
     - Ingest only durable, high-signal improvements. Rewrite into this repo's
       style. Do not copy detector-evasion sludge.
     - Land changes in the files listed under `lands_in` (or new refs if needed).
     - Set `last_ingested_version`, `last_ingested_ref`, `release_tag`,
       `release_url`, `last_ingested_at`, `last_checked_at`, `compare_base`.
     - Clear or update `last_known_upstream_*` if you fully caught up.

3. **Monitor sources**
   - Quick check only (commits since `last_checked_ref`, Wikipedia history).
   - Promote to active ingest + full section only when you actually absorb
     content.

3b. **Writing-prose sources** (`kind: release_api`, e.g. vale)
   - Compare the GitHub latest release tag against the pinned `release_tag`.
   - If newer: read the release notes, re-run `vale sync` for style packs,
     update the binary (WSL release asset; winget when the manifest catches
     up), verify the house gate still passes, then update pins. Patch-only.
   - If unchanged: set `last_checked_at` only.

4. **Package + live skill**
   - **Version bump:** ingest-only → **patch** (`x.y.Z+1`) only. Never minor
     for source absorbs. See [Version bump policy](#humanizer-package-version).
   - Update `CHANGELOG.md` / `README.md` with the new `package_version`.
   - Set `package_version` and `last_sources_sync` in this file.
   - Sync installable tree to `~/.hermes/skills/writing/humanizer/`.
   - Commit in `.`. Push only if the user asks.

5. **Report** (mandatory after every real diff pass, even if nothing landed)

   Do not stop at a pin table. Give an editorial judgment pass:

   - **Per source:** old pin → new pin, or "unchanged".
   - **Improvements (opinion):** for each durable change considered, rate
     **minor / moderate / major**, say what it enables in this skill, and whether
     you absorbed it.
   - **Rejected / held:** item + one-line reason (policy, thin signal, already
     covered, detector sludge, packaging-only, etc.).
   - **Conflicts:** whenever upstream conflicts with an existing rule, pin, or
     house guardrail, list:
     - the old rule (where it lives)
     - the new upstream rule
     - **decision:** `change existing` | `ignore new` | `hybrid`
     - one-line why
   - **Paths touched** in this repo and the package version bump (if any).

   Conflict decisions stick until a later pass reopens them with new evidence.
   Standing rejects in this file still win unless the user overrides.

6. **Do not skip the opinion block** when the user only asked for a pin bump.
   Version checking and applying changes are the same job: judge, then land.

## Adding a new tracked GitHub skill repo

1. Clone to `<name>` unless it is your own public project
   (`<git-public>`).
2. Add an **Active ingest** or **Monitor** section with all table fields.
3. Set `last_ingested_version` only after a real absorb (else leave none and use
   `last_checked_*`).
4. Prefer release tags + `release_url` when the upstream publishes them.
5. Keep editorial accept/reject judgment in this file's `ingest_policy` and in
   `AGENTS.md` principles — do not create a second pin register in AGENTS.md.

## Schema (field meanings)

| Field | Meaning |
| --- | --- |
| `status` | `active_ingest` \| `monitor` \| `discovery` |
| `kind` | `git` (clone + diff after pin) \| `release_api` (GitHub releases API, no clone) \| `web` |
| `last_ingested_version` | Version whose content is already in our skill |
| `last_ingested_ref` | Git commit SHA (full) at that ingest |
| `release_tag` / `release_url` | Canonical GitHub release for that pin |
| `last_checked_at` | Last time we looked (even if nothing changed) |
| `last_known_upstream_tag` | Newer upstream we have noticed but not fully ingested |
| `local_clone` | Path on this machine |
| `lands_in` | Where absorbed material lives in this repo |
| `ingest_policy` | Standing accept/reject rules for this source |
