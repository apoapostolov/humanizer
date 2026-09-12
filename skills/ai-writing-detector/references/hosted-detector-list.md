# Hosted detector list

Endpoints and failure modes for the spread tester. APIs change. Treat as a
starting map, not a contract.

## GPTZero

- Web: https://gptzero.me
- API: `POST https://api.gptzero.me/v2/predict/text` header `x-api-key`
- Returns `documents[0].class_probabilities.ai` (0-1)
- Issues: ESL false-positive bias (Liang et al., Patterns 2023); unstable under
  ~100 words; inflates on dense technical prose

## Originality.ai

- Web: https://originality.ai
- API: `POST https://api.originality.ai/api/v1/scan/ai` header `X-OAI-API-KEY`
- Returns `score.ai` (0-1)
- Issues: Grammarly-edited human prose often scores high; marketed accuracy
  does not match independent tests

## ZeroGPT

- Web: https://www.zerogpt.com
- API: `POST https://api.zerogpt.com/api/detect/detectText` header `ApiKey`
- Returns `data.fakePercentage` (0-100)
- Issues: same text can move 20+ points on re-paste; famous false hits on
  public-domain documents; trivial paraphrase swings the score

## Sapling

- Web: https://sapling.ai/ai-content-detector
- API: `POST https://api.sapling.ai/api/v1/aidetect` JSON `key` + `text`
- Returns `score` (0-1)
- Issues: often lower than GPTZero on the same draft; strip markdown first

## Copyleaks

- Login then `POST https://api.copyleaks.com/v2/writer-detector/{id}/check`
- Needs `COPYLEAKS_API_KEY` and `COPYLEAKS_EMAIL`
- Returns `summary.ai` (0-1)

## Manual (no public API in this script)

Writer.com, Scribbr, QuillBot, Hive. `--manual` prompts for a pasted score.
