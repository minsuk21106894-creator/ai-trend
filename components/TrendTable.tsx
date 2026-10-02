"use client";

import { useMemo, useState } from "react";
import { CATEGORY_LABEL, Category, Glossary, TrendEntry } from "@/lib/types";
import { formatDateKo } from "@/lib/date";
import { renderWithTerms } from "@/lib/renderTerms";
import TermSidebar from "./TermSidebar";

const ALL_CATEGORIES = Object.keys(CATEGORY_LABEL) as Category[];
const CAT_VAR: Record<Category, string> = {
  model: "var(--cat-model)",
  product: "var(--cat-product)",
  research: "var(--cat-research)",
  industry: "var(--cat-industry)",
  policy: "var(--cat-policy)",
};

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
  const [activeOrg, setActiveOrg] = useState<string>("all");
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  const orgs = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => e.org && set.add(e.org));
    return Array.from(set).sort();
  }, [entries]);

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
      .filter((e) => activeOrg === "all" || e.org === activeOrg)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [entries, activeCategories, activeOrg]);

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
        {orgs.length > 0 && (
          <select
            className="org-select"
            value={activeOrg}
            onChange={(ev) => setActiveOrg(ev.target.value)}
            aria-label="기업/기관 필터"
          >
            <option value="all">전체 기업/기관</option>
            {orgs.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="table-wrap">
        <table className="trend-table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>분류</th>
              <th>기업/기관</th>
              <th>제목 / 요약</th>
              <th>출처</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e) => (
              <tr key={e.id}>
                <td className="date-col">{formatDateKo(e.date)}</td>
                <td className="cat-col">
                  <span className="badge-dot" style={{ background: CAT_VAR[e.category] }} />
                  {CATEGORY_LABEL[e.category]}
                </td>
                <td className="cat-col">{e.org ?? "—"}</td>
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
