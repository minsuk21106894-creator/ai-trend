"use client";

import { useMemo, useState } from "react";
import { CATEGORY_LABEL, Category, Glossary, TrendEntry } from "@/lib/types";
import { formatDateKo } from "@/lib/date";
import { renderWithTerms } from "@/lib/renderTerms";
import TermSidebar from "./TermSidebar";

const ALL_CATEGORIES = Object.keys(CATEGORY_LABEL) as Category[];

export default function TrendTable({
  entries,
  glossary,
}: {
  entries: TrendEntry[];
  glossary: Glossary;
}) {
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(
    new Set(ALL_CATEGORIES)
  );
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  function toggleCategory(cat: Category) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  const sorted = useMemo(() => {
    return [...entries]
      .filter((e) => activeCategories.has(e.category))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [entries, activeCategories]);

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
      </div>

      <div className="table-wrap">
        <table className="trend-table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>분류</th>
              <th>제목 / 요약</th>
              <th>출처</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e) => (
              <tr key={e.id}>
                <td className="date-col">{formatDateKo(e.date)}</td>
                <td>{CATEGORY_LABEL[e.category]}</td>
                <td>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>
                    {renderWithTerms(e.title, e.terms, setSelectedTerm)}
                  </div>
                  <div style={{ color: "var(--ink-soft)" }}>
                    {renderWithTerms(e.summary, e.terms, setSelectedTerm)}
                  </div>
                </td>
                <td>
                  {e.sources.map((s) => (
                    <div key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.name} ↗
                      </a>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TermSidebar termKey={selectedTerm} glossary={glossary} onClose={() => setSelectedTerm(null)} />
    </div>
  );
}
