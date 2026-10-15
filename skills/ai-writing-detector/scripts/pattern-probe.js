'use strict';

const assert = require('node:assert/strict');
const { analyzeText } = require('./patterns.js');

const context = { context: 'personal' };
const staged = [
  'The report arrived on Monday. The recording turned out to be the least interesting part of the whole investigation.',
  'The team had already checked the schedule, the microphones, the transcripts, and the archive before the review began.',
  'They found several missing timestamps and corrected them against the original files.',
  'The public report explains which sections changed and why the archive had been incomplete.',
].join(' ');
const stagedResult = analyzeText(staged, context);
assert(stagedResult.issues.some((issue) => issue.type === 'performed-insight' && /turned out to be the least interesting part/i.test(issue.text)), 'staged discovery should be reported');

const literal = [
  'The laptop turned out to be the most expensive option after the procurement team compared warranties and shipping costs.',
  'The final budget lists each vendor, the service dates, and the replacement terms in separate rows.',
  'The finance lead approved the purchase after checking the updated figures with the department.',
  'Nothing in the comparison describes a surprising reveal or a hidden finding.',
].join(' ');
const literalResult = analyzeText(literal, context);
assert(!literalResult.issues.some((issue) => issue.type === 'performed-insight' && /turned out to be the most expensive option/i.test(issue.text)), 'literal outcome should stay clean');

const quoted = [
  'The review quotes an earlier draft: "delve into the rich tapestry and unlock a transformative future."',
  'The editor then explains that the original wording was copied from the submitted proposal and was not part of this review.',
  'The remaining paragraphs name the project dates, list the approved costs, and describe the changes made during the revision.',
  'The committee can compare each claim with the source file and decide whether the notes are accurate.',
].join(' ');
const quotedResult = analyzeText(quoted, context);
assert(quotedResult.stats.maskedQuotes === 1, `expected one masked quote, got ${quotedResult.stats.maskedQuotes}`);
assert(!quotedResult.issues.some((issue) => issue.type === 'tier1' || issue.type === 'tier2'), 'quoted vocabulary should not score');

const blockquoted = [
  '> Delve into the rich tapestry and unlock a transformative future.',
  'The reviewer marks that line as a quotation from the proposal rather than language written for the review.',
  'The report records the date, the project owner, the expected cost, and the exact section where the sentence appeared.',
  'A separate paragraph explains that the copied sentence does not describe a measurable result or an approved plan.',
].join('\n');
const blockquoteResult = analyzeText(blockquoted, context);
assert(blockquoteResult.stats.quotedLines === 1, `expected one masked blockquote line, got ${blockquoteResult.stats.quotedLines}`);
assert(!blockquoteResult.issues.some((issue) => issue.type === 'tier1' || issue.type === 'tier2'), 'blockquoted vocabulary should not score');

console.log('PASS  staged discovery and literal-outcome quote carve-outs');
console.log('PASS  quoted spans and single-line blockquotes excluded from scoring');

const featuresNoun = [
  'The release ships three new features and a smaller download.',
  'The notes list each owner and the date the work finished before the review began.',
].join(' ');
const featuresNounResult = analyzeText(featuresNoun, context);
assert(!featuresNounResult.issues.some((issue) => issue.type === 'tier1-clarity' && /features/i.test(issue.text)), 'noun "features" should stay clean');

const featuresVerb = [
  'The app features a dashboard that lists every device.',
  'The team recorded the response times before the release and filed the numbers in the shared folder.',
].join(' ');
const featuresVerbResult = analyzeText(featuresVerb, context);
assert(featuresVerbResult.issues.some((issue) => issue.type === 'tier1-clarity' && /features/i.test(issue.text)), 'verb "features" should be reported');

const russianTechnical = [
  'Мы добавили make_json_safe() на Enum и проверили r/StableDiffusion от 07.10.',
  'The build passed and the log lists each step with its duration, so the reviewer can follow what changed.',
].join(' ');
const russianTechnicalResult = analyzeText(russianTechnical, context);
assert(!russianTechnicalResult.issues.some((issue) => issue.type === 'normalization-flag'), 'Russian technical prose with English terms should stay clean');

console.log('PASS  features noun/verb split and per-sentence lookalike gate');
const featuresSupportVerbSamples = [
  'The library features support for asynchronous requests when the device goes offline.',
  'This Windows 11 app features support for dark mode across the full platform.',
  'In 2024 the library features support for asynchronous requests across every region.',
  'It features support for loops across the compiler pipeline without issues.',
];
for (const sample of featuresSupportVerbSamples) {
  const result = analyzeText(sample, context);
  assert(result.issues.some((issue) => issue.type === 'tier1-clarity' && /features/i.test(issue.text)), `verb support-for should flag: ${sample}`);
}

const featuresSupportNounSamples = [
  'The two platform features support for older protocols on devices without hardware acceleration.',
  'All of the system features support for older protocols on devices without hardware acceleration.',
  'The 100 platform features support for older protocols on devices without hardware acceleration.',
  'The library features support for loops on devices without hardware acceleration.',
];
for (const sample of featuresSupportNounSamples) {
  const result = analyzeText(sample, context);
  assert(!result.issues.some((issue) => issue.type === 'tier1-clarity' && /features/i.test(issue.text)), `plural/partitive support-for should stay clean: ${sample}`);
}

const { normalizeText } = require('./patterns.js');
for (const underline of ['--', '---', '==']) {
  const setext = `Позвоните в поддержку.\nаст now to secure it\n${underline}\nИ еще русский текст.`;
  const normalized = normalizeText(setext);
  assert.equal(normalized.text, setext.replace('аст', 'act'), `setext ${underline} should still swap the isolated lookalike`);
}

console.log('PASS  features support-for subject split and setext lookalike bounds');
