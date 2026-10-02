# House rule tests

`vale test` cases for the `HermesHouse` rules. They sit in their own directory
so the styles folder stays lintable and the shipped rules stay short. The
runner is new in vale 3.24, and the Windows build lags the release, so the
cases run on WSL first.

| File | Rule |
| --- | --- |
| `AiSlop.tests.yml` | `HermesHouse/AiSlop.yml` |
| `EmDash.tests.yml` | `HermesHouse/EmDash.yml` |

A case needs one of three assertions: `want` pins the whole alert, `contains`
pins a fragment, `absent: true` asserts silence. Columns are real in `want`,
and the column is where the match starts, not where the line starts.

The runner reads rule files, so attach the block from a `.tests.yml` file to its
rule before running:

```bash
vale --config vale/vale.ini test
```

Attaching by hand on purpose. A merge step would have to run in the same commit
as any rule edit, and a rule that silently loses its cases is worse than one
with cases a person appends.