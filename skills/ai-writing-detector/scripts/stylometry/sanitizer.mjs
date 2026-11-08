// Prose sanitizer for ai-writing-detector stylometry.
//
// Vendored from humanizer-lint (MIT, yanstd888) `scripts/utils/sanitizer-mapped.mjs`.
// Strips frontmatter, fenced code, headings, tables, thematic breaks, link
// targets, bare URLs and inline code before measurement, so markup never
// counts as prose. Every Markdown link keeps its text and drops its target,
// relative and mailto targets included since upstream v1.6.0. The offset map
// is kept because the upstream tests use it.
//
// The exported function is unchanged. See ../references/stylometry.md.

const ENTITY = 'TOKEN_ENTITY';
const slice = (value, start, end) => ({ text: value.text.slice(start, end), map: value.map.slice(start, end) });
const literal = (text) => ({ text, map: Array(text.length).fill(-1) });
const join = (values) => ({ text: values.map((v) => v.text).join(''), map: values.flatMap((v) => v.map) });

function replace(value, regex, replacement) {
  const parts = [];
  let cursor = 0;
  for (const match of value.text.matchAll(regex)) {
    parts.push(slice(value, cursor, match.index), replacement(match, value));
    cursor = match.index + match[0].length;
  }
  parts.push(slice(value, cursor));
  return join(parts);
}

function trim(value, endOnly = false) {
  const left = endOnly ? 0 : value.text.length - value.text.trimStart().length;
  return slice(value, left, Math.max(left, value.text.trimEnd().length));
}

function removeFences(value) {
  const parts = [];
  let fence = null;
  let cursor = 0;
  for (const match of value.text.matchAll(/^.*(?:\n|$)/gmu)) {
    if (!match[0]) continue;
    const marker = /^ {0,3}(`{3,}|~{3,})([^\n]*)/u.exec(match[0]);
    if (!fence && marker) {
      parts.push(slice(value, cursor, match.index));
      fence = marker[1];
    } else if (fence && marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) {
      parts.push(literal('\n'));
      cursor = match.index + match[0].length;
      fence = null;
    }
  }
  if (!fence) parts.push(slice(value, cursor));
  return join(parts);
}

export function sanitizeMarkdownWithMap(input) {
  const source = String(input ?? '');
  let value = { text: source, map: Array.from({ length: source.length }, (_, i) => i) };
  value = replace(value, /\r\n?/g, (m, v) => ({ text: '\n', map: [v.map[m.index]] }));
  value = replace(value, /^---\s*\n[\s\S]*?\n---\s*(?:\n|$)/g, () => literal(''));
  value = removeFences(value);
  value = replace(value, /\[([^\]]+)\]\([^\s)]+\)/gi, (m, v) => slice(v, m.index + 1, m.index + 1 + m[1].length));
  value = replace(value, /`[^`\n]+`/g, () => literal(ENTITY));
  value = replace(value, /https?:\/\/[^\s)]+/gi, (m, v) => {
    const trailing = m[0].match(/[.!?,;:]+$/u)?.[0] ?? '';
    return join([literal(ENTITY), slice(v, m.index + m[0].length - trailing.length, m.index + m[0].length)]);
  });

  const sourceLines = [];
  let start = 0;
  for (let i = 0; i <= value.text.length; i += 1) {
    if (i === value.text.length || value.text[i] === '\n') {
      sourceLines.push(slice(value, start, i));
      start = i + 1;
    }
  }
  const lines = [];
  for (let index = 0; index < sourceLines.length; index += 1) {
    const raw = sourceLines[index];
    if (/^\s*#{1,6}\s+/.test(raw.text) || /^\s*(?:={3,}|-{3,})\s*$/.test(sourceLines[index + 1]?.text ?? '')) {
      if (!/^\s*#{1,6}\s+/.test(raw.text)) index += 1;
      lines.push(literal(''));
      continue;
    }
    if (/^\s*(?:-{3,}|_{3,}|\*{3,})\s*$/.test(raw.text) || /^\s*\|.*\|\s*$/.test(raw.text)) {
      lines.push(literal(''));
      continue;
    }
    const quote = /^\s*>\s?/.exec(raw.text);
    let line = quote ? slice(raw, quote[0].length) : raw;
    const list = /^\s*(?:[-*+]|\d+\.)\s+(.*)$/.exec(line.text);
    if (list) {
      let item = trim(slice(line, list[0].length - list[1].length));
      let cursor = index + 1;
      while (cursor < sourceLines.length && /^\s{2,}\S/.test(sourceLines[cursor].text)) {
        const next = sourceLines[cursor];
        const prefix = /^\s*>\s?/.exec(next.text);
        item = join([item, literal(' '), trim(prefix ? slice(next, prefix[0].length) : next)]);
        cursor += 1;
      }
      index = cursor - 1;
      const words = item.text.match(/[\p{L}\p{N}]+/gu) ?? [];
      line = words.length >= 5 && /[.!?]["')\]]?$/.test(item.text.trim()) ? item : literal('');
    }
    lines.push(trim(line, true));
  }
  value = join(lines.flatMap((line, index) => index ? [literal('\n'), line] : [line]));
  value = replace(value, /\n{3,}/g, () => literal('\n\n'));
  return trim(value);
}
