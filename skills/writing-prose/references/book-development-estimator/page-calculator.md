# Page Count & Conversion Helpers

This reference provides concrete calculators for translating between Markdown word counts, printed page counts, and token sizes for AI cost estimation.

## Assumptions for Page Calculations
- Calculations target A4 (or similar large-format) hardcovers or equivalent professional layouts.
- Professional book layout assumptions: readable font (10-11 pt body), good margins, appropriate leading.
- Includes typical whitespace, chapter starts, headers, and sidebars/tables where relevant.
- Art and visual elements significantly reduce effective text density.

**Recommended words-per-page (WPP) ranges for finished books** (accounting for layout, art, tables, sidebars):

- **Low art** (mostly text with minimal illustrations or tables): **350–420 WPP**  
  Use ~380 for planning.

- **Average art** (typical illustrated non-fiction or reference work: spot illustrations, some larger pieces, tables, sidebars): **220–280 WPP**  
  Use **250** as the standard midpoint.

- **Heavy art** (lavishly illustrated: many full or large illustrations, extensive visuals): **120–180 WPP**  
  Use **160** as the average.

These are planning estimates only. Actual page counts depend heavily on final layout and design choices. Always validate with sample pages in the target layout tool.

Front matter (title, credits, TOC, preface) and back matter usually add 5–15% extra pages.

## Core Conversion Functions

### 1. MD Words → Estimated Printed Pages

```python
def md_words_to_pages(words, art_level="average"):
    wpp = {
        "low": 380,
        "average": 250,
        "heavy": 160
    }[art_level]
    core_pages = words / wpp
    total_pages = core_pages * 1.08  # ~8% for front/back matter
    return round(total_pages)
```

### 2. Target Pages → Target MD Words

```python
def pages_to_target_words(goal_pages, art_level="average", include_matter=True):
    wpp = {"low": 380, "average": 250, "heavy": 160}[art_level]
    if include_matter:
        core_pages = goal_pages / 1.08
    else:
        core_pages = goal_pages
    target_words = core_pages * wpp
    return round(target_words)
```

### 3. Words / Pages → Tokens for AI Pricing

Use 1.35 tokens per word as a baseline (English prose + Markdown overhead; adjust between 1.3–1.4 as needed).

```python
def words_to_tokens(words):
    return round(words * 1.35)

def pages_to_tokens(goal_pages, art_level="average"):
    target_words = pages_to_target_words(goal_pages, art_level)
    return words_to_tokens(target_words)
```

**For cost estimation purposes:**
- Current manuscript words → current_tokens
- Target words (from pages or expansion percentage) → target_output_tokens
- In AI costing: output cost is driven primarily by newly generated content plus iteration overhead. Total generated tokens are often 2–3.5× the size of the final manuscript due to planning, drafts, and revisions.

## Integration with the Estimator Skill

When using the skill:
- Supply either `target_expansion` or `goal_pages` + `art_level`.
- The skill converts the page goal into target word and token counts.
- These values are combined with current manuscript size + selectively loaded supporting skills + grounding documents to build the full token budget.

## Adjustments and Caveats
- Actual words per page varies significantly based on final design, font, margins, column layout, and amount of visual material.
- Tables, procedures, and sidebars reduce effective WPP compared to pure narrative.
- Very dense text-only layouts can exceed 450–500 WPP on large pages, but this is uncommon for most illustrated or reference-style books.
- Token counts reflect the Markdown source fed to the model, not the final printed page density.
- Always treat these as planning tools. Prototype in the actual layout software for final budgeting.

Update the WPP ranges only when new measured data from real layouts becomes available.
