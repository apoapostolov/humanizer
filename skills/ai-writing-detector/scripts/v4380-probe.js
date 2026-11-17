// Behavioral probes for avoid-ai-writing #438 (tip, post-v3.39.0):
//  1. em-dash rate ignores HTML <li> separators with a strong/b/link lead term,
//     but still counts dashes after plain text or in a bold clause.
//  2. sentence-length uniformity drops a glossary of 3+ distinct bold-lead
//     definitions, while uniform prose around it and a repeated label still fire.
const AIDetector = require('./patterns.js');

let failed = 0;
function check(name, cond) {
  if (cond) { console.log(`  ok  ${name}`); }
  else { failed++; console.error(`  FAIL ${name}`); }
}
const emHits = (t) => AIDetector.analyzeText(t).issues.filter((i) => i.type === 'em-dash');
const uniHits = (t) => AIDetector.analyzeText(t).issues.filter((i) => i.type === 'uniformity');
const firstEmCount = (t) => {
  const h = emHits(t);
  if (h.length !== 1) return null;
  const m = h[0].text.match(/^(\d+) em dashes/);
  return m ? Number(m[1]) : null;
};

const intro = 'This section lists the components used by the service.';
const items = [['Postgres', 'primary store'], ['Redis', 'cache'],
               ['Kafka', 'event bus'], ['S3', 'exports']];

// Separator position with a lead term: no em-dash finding (Markdown and HTML).
for (const mode of ['markdown', 'html']) {
  const isHtml = mode === 'html';
  const list = items.map(([t, d]) => isHtml
    ? `<li><strong>${t}</strong> — ${d}</li>`
    : `- **${t}** — ${d}`).join('\n');
  const t = [intro, isHtml ? '<ul>' : '', list].join('\n');
  check(`separator lead ${mode}: no em-dash finding`, emHits(t).length === 0);
}

// Plain-text lead in an <li> still counts all four dashes.
const plainLead = [intro, '<ul>',
  ...items.map(([t, d]) => `<li>${t} — ${d}</li>`), '</ul>'].join('\n');
check('HTML plain-text lead: dashes still counted', firstEmCount(plainLead) === 4);

// A bold clause (more than five words) is not a lead term; its dash counts.
const clause = [intro, '<ul>',
  ...items.map(() => '<li><strong>The committee reviewed the proposal and rejected it</strong> — done.</li>'),
  '</ul>'].join('\n');
check('HTML bold clause: dash still counted', firstEmCount(clause) === 4);

// Uniformity: five identical 13-word sentences fire; a 3-term glossary is excluded.
const sentence = 'The worker reads every queued message before it writes the result to disk.';
const prose = Array(5).fill(sentence).join(' ');
const glossary = '**Token:** The unit a model reads, usually a word piece.\n'
  + '**Latency:** The time before the first byte of the reply arrives.\n'
  + '**Throughput:** Requests finished per second.';
const fires = (t) => uniHits(t).some((i) => /cluster around/.test(i.text));
check('uniform prose alone fires', fires(prose));
check('uniform prose beside a glossary still fires', fires(prose + '\n\n' + glossary));
check('glossary alone has no uniformity finding', uniHits('## Glossary\n\n' + glossary).length === 0);

// A repeated label is not a glossary: five "**Note:**" lines are prose and fire.
const notes = Array(5).fill('**Note:** ' + sentence).join('\n');
check('repeated bold label is not a glossary', fires(notes));

console.log(`\n${failed === 0 ? 'ALL PASS' : failed + ' FAILED'} (#438 probes)`);
process.exit(failed === 0 ? 0 : 1);
