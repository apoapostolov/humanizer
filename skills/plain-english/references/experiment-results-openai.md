# STE experiment results — OpenAI (gpt-5.5)

From the ep01 kit. Violations per 100 words (lower = cleaner). em-dash = true dash chars only.

| Condition | words | violations | per 100w | vs baseline | em-dashes |
|---|---|---|---|---|---|
| baseline | 649 | 23 | **3.54** | — | 0 |
| banwords | 608 | 13 | **2.14** | -40% | 0 |
| orwell | 532 | 9 | **1.69** | -52% | 0 |
| ste | 454 | 8 | **1.76** | -50% | 0 |

## Per-category (per 100 words)

| category | baseline | banwords | orwell | ste |
|---|---|---|---|---|
| long_sentence(>20w) | 0.77 | 0.49 | 0.38 | 0.0 |
| semicolon | 0.0 | 0.0 | 0.0 | 0.0 |
| contraction | 0.15 | 0.0 | 0.0 | 0.0 |
| passive_voice | 1.39 | 0.99 | 0.75 | 0.66 |
| ing_main_verb | 0.46 | 0.16 | 0.19 | 0.0 |
| nominalization | 0.46 | 0.16 | 0.0 | 0.22 |
| phrasal_verb | 0.0 | 0.0 | 0.0 | 0.0 |
| banned_word | 0.0 | 0.0 | 0.0 | 0.0 |
| marketing_adjective | 0.0 | 0.0 | 0.0 | 0.0 |
| modal_hedge | 0.0 | 0.0 | 0.0 | 0.0 |
| long_paragraph(>6s) | 0.31 | 0.33 | 0.38 | 0.88 |

**Headline:** STE cut violations by ~50% vs baseline (3.54 -> 1.76 per 100 words). Ban-words ~40%, Orwell ~52%.

Note: STE can raise long_paragraph counts when it produces many short sentences in one block. Prefer the total_per100w and long_sentence signals when judging a rewrite.
