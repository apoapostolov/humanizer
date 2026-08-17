# Plain-English mode boundaries

The same surface finding can require a rewrite in a procedure and no change in
product or conversational prose. Pick the mode from the section's job before
interpreting the linter.

## Strict procedure

Source:

> If scene sampling is enabled and the map contains private artwork, make sure
> that you review the sampled palette before you export it to another world.

Strict rewrite:

1. Review the sampled palette if scene sampling is on.
2. Remove colors from private artwork.
3. Export the palette to the other world.

The rewrite separates actions and puts the condition first.

## STE-flavored technical explanation

Source:

> A preset keeps stroke, fill, text, and opacity together, which makes repeated
> drawing work faster without forcing every object into the same look.

Keep it. The sentence is longer than the strict target, but the second clause
explains the consequence of the first. Splitting it would weaken the
relationship.

## Natural product copy

Source:

> You'll see the colors already in your scene, so you can reuse one without
> rebuilding it by eye.

Keep the contraction when the surrounding copy is conversational. Expanding it
to "You will" does not improve clarity.

## Mixed README

Route sections separately:

| Section | Primary writing discipline |
| --- | --- |
| Value proposition and feature overview | `humanizer` or `writing-prose` |
| Installation steps | `simple-english`, strict when the procedure is sensitive |
| Settings and compatibility | `simple-english`, STE-flavored |
| API example | Precise developer prose; preserve literal code |
| Maintainer note or project story | `humanizer` or `writing-prose` |

Do not average these sections into one voice or one linter score.
