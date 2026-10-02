import React from "react";

/**
 * Splits `text` on the first occurrence of each term in `terms` and wraps
 * each match in a clickable <span>. Terms are matched longest-first so a
 * term that is a substring of another doesn't steal its match.
 */
export function renderWithTerms(
  text: string,
  terms: string[],
  onTermClick: (term: string) => void
): React.ReactNode[] {
  if (!terms || terms.length === 0) return [text];

  type Match = { start: number; end: number; term: string };
  const sorted = [...terms].sort((a, b) => b.length - a.length);
  const matches: Match[] = [];
  const taken: boolean[] = new Array(text.length).fill(false);

  for (const term of sorted) {
    const idx = text.indexOf(term);
    if (idx === -1) continue;
    const end = idx + term.length;
    let overlaps = false;
    for (let i = idx; i < end; i++) {
      if (taken[i]) {
        overlaps = true;
        break;
      }
    }
    if (overlaps) continue;
    for (let i = idx; i < end; i++) taken[i] = true;
    matches.push({ start: idx, end, term });
  }

  matches.sort((a, b) => a.start - b.start);

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.start > cursor) nodes.push(text.slice(cursor, m.start));
    nodes.push(
      <button
        key={`${m.term}-${i}`}
        type="button"
        className="term-link"
        onClick={() => onTermClick(m.term)}
      >
        {text.slice(m.start, m.end)}
      </button>
    );
    cursor = m.end;
  });
  if (cursor < text.length) nodes.push(text.slice(cursor));

  return nodes;
}
