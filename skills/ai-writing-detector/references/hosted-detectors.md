# Hosted detector spread

This skill's local engine (`analyze.js`) never leaves the machine. The hosted
spread tester does. Adapted from sergebulaev/linkedin-skills detector-tester
(MIT). Rewrite, do not vendor their CLI flags wholesale.

## Disclosure (read before every live run)

`scripts/test_detectors.py --upload` posts the **full draft** to every service
with a key: GPTZero, Originality.ai, ZeroGPT, Sapling, Copyleaks. Manual mode
can add Writer, Scribbr, QuillBot, Hive. Treat the text as disclosed under
those providers' terms. Do not run it on embargoed, NDA, or unannounced copy.
No key means that service is skipped. `--demo` is offline.

Live APIs require `--upload`. Without it the script exits 2.

## Why it exists

Hosted detectors disagree. Use the spread as Chase-mode loop input and as a
record when a single score is being waved as proof. The spread is not an
authorship verdict. Academic integrity, hiring, and discipline still go to
provenance, not this number.

Public receipts worth citing: Liang et al. 2023 (ESL false positives),
OpenAI retired its own classifier, several universities disabled Turnitin AI
detection. Short posts (under ~100 words) make every score noisier.

## Commands

From this skill directory:

```bash
python scripts/test_detectors.py --demo --text "draft"
python scripts/test_detectors.py --upload --text "draft"
python scripts/test_detectors.py --upload --stdin --json report.json
```

Keys: `GPTZERO_API_KEY`, `ORIGINALITY_API_KEY`, `ZEROGPT_API_KEY`,
`SAPLING_API_KEY`, `COPYLEAKS_API_KEY` + `COPYLEAKS_EMAIL`. Template:
`scripts/detectors.env.example`.

Spread labels: CONSENSUS (≤15), MIXED (16-30), DIVERGENT (31-50), USELESS (>50).

## Chase handoff

`humanizer` Chase depth consumes `analyze.js` first (local). Hosted spread is
optional after consent. Iterate remaining tells. Do not invent facts or inject
fingerprints to move a score.

Provider notes: [hosted-detector-list.md](hosted-detector-list.md).
