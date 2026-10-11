# House rule tests

`vale test` cases (`vale >= 3.24`) for the `HermesHouse` rules. They sit in
their own directory so the styles folder stays lintable and the shipped rules
stay short.

| File | Rule |
| --- | --- |
| `AiSlop.test.yml` | `HermesHouse/AiSlop.yml` |
| `EmDash.test.yml` | `HermesHouse/EmDash.yml` |

A case needs one of three assertions: `want` pins the whole alert line,
`contains` pins a fragment, and `absent: true` asserts silence. `want` is a
string, not a list, and its line and column count from the first line of
`input`, where the column is the start of the match, not the start of the
line.

Run them from the skill directory on any platform with vale 3.24 or newer:

```bash
vale --config vale/vale.ini test
```

The runner reads the case files directly. Separate files on purpose: a case
dropped into `styles/` would be linted as a rule file, and a `tests:` block
attached to a rule would run in isolation instead of through the house
config.