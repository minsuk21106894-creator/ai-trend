"use client";

import { useMemo, useState } from "react";
import { CATEGORY_LABEL, Category, Glossary, TrendEntry } from "@/lib/types";
import { formatDateKo, isRecent } from "@/lib/date";
import { renderWithTerms } from "@/lib/renderTerms";
import { useSaved } from "@/lib/useSaved";
import TermSidebar from "./TermSidebar";

const ALL_CATEGORIES = Object.keys(CATEGORY_LABEL) as Category[];

export default function TrendFeed({
  entries,
  glossary,
}: {
  entries: TrendEntry[];
  glossary: Glossary;
}) {
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(
    new Set(ALL_CATEGORIES)
  );
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const { saved, toggle, loaded } = useSaved();

  function toggleCategory(cat: Category) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (!activeCategories.has(e.category)) return false;
      if (showSavedOnly && !saved[e.id]) return false;
      return true;
    });
  }, [entries, activeCategories, showSavedOnly, saved]);

  const grouped = useMemo(() => {
    const map = new Map<string, TrendEntry[]>();
    const sorted = [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1));
    for (const e of sorted) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div>
      <div className="filter-bar">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={"filter-chip" + (activeCategories.has(cat) ? " on" : "")}
            onClick={() => toggleCategory(cat)}
          >
            {CATEGORY_LABEL[cat]}
          </button>
        ))}
        <span className="filter-spacer" />
        <button
          type="button"
          className={"filter-saved-toggle" + (showSavedOnly ? " on" : "")}
          onClick={() => setShowSavedOnly((v) => !v)}
        >
          저장됨만 보기
        </button>
      </div>

      {loaded && grouped.length === 0 && (
        <div className="empty-state">조건에 맞는 소식이 없어요. 필터를 조정해보세요.</div>
      )}

      {grouped.map(([date, items]) => (
        <div className="date-group" key={date}>
          <h2>{formatDateKo(date)}</h2>
          {items.map((entry) => (
            <article className="entry-card" id={`entry-${entry.id}`} key={entry.id}>
              <div className="entry-top">
                <span className="badge">{CATEGORY_LABEL[entry.category]}</span>
                {isRecent(entry.date) && <span className="badge new">NEW</span>}
              </div>
              <h3 className="entry-title">
                {renderWithTerms(entry.title, entry.terms, setSelectedTerm)}
              </h3>
              <p className="entry-summary">
                {renderWithTerms(entry.summary, entry.terms, setSelectedTerm)}
              </p>
              <div className="entry-bottom">
                <div className="entry-sources">
                  {entry.sources.map((s) => (
                    <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.name} ↗
                    </a>
                  ))}
                </div>
                <button
                  type="button"
                  className={"save-btn" + (saved[entry.id] ? " saved" : "")}
                  onClick={() => toggle(entry.id)}
                >
                  {saved[entry.id] ? "저장됨 ✓" : "저장"}
                </button>
              </div>
            </article>
          ))}
        </div>
      ))}

      <TermSidebar termKey={selectedTerm} glossary={glossary} onClose={() => setSelectedTerm(null)} />
    </div>
  );
}
