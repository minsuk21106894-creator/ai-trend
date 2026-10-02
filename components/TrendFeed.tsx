"use client";

import { useMemo, useState } from "react";
import { CATEGORY_LABEL, Category, Glossary, TrendEntry } from "@/lib/types";
import { formatDateKo, isRecent } from "@/lib/date";
import { renderWithTerms } from "@/lib/renderTerms";
import { useSaved } from "@/lib/useSaved";
import TermSidebar from "./TermSidebar";

const ALL_CATEGORIES = Object.keys(CATEGORY_LABEL) as Category[];
const CAT_VAR: Record<Category, string> = {
  model: "var(--cat-model)",
  product: "var(--cat-product)",
  research: "var(--cat-research)",
  industry: "var(--cat-industry)",
  policy: "var(--cat-policy)",
};

type GroupBy = "date" | "category" | "org";

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
  const [activeOrg, setActiveOrg] = useState<string>("all");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupBy>("date");
  const [compact, setCompact] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const { saved, toggle, loaded } = useSaved();

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

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (!activeCategories.has(e.category)) return false;
      if (activeOrg !== "all" && e.org !== activeOrg) return false;
      if (showSavedOnly && !saved[e.id]) return false;
      return true;
    });
  }, [entries, activeCategories, activeOrg, showSavedOnly, saved]);

  const grouped = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1));

    if (groupBy === "category") {
      const map = new Map<string, TrendEntry[]>();
      for (const cat of ALL_CATEGORIES) {
        const items = sorted.filter((e) => e.category === cat);
        if (items.length > 0) map.set(cat, items);
      }
      return Array.from(map.entries()).map(([key, items]) => ({
        key,
        label: CATEGORY_LABEL[key as Category],
        color: CAT_VAR[key as Category],
        items,
      }));
    }

    if (groupBy === "org") {
      const map = new Map<string, TrendEntry[]>();
      for (const e of sorted) {
        const key = e.org ?? "기타";
        const list = map.get(key) ?? [];
        list.push(e);
        map.set(key, list);
      }
      return Array.from(map.entries())
        .sort((a, b) => b[1].length - a[1].length)
        .map(([key, items]) => ({ key, label: key, color: undefined, items }));
    }

    const map = new Map<string, TrendEntry[]>();
    for (const e of sorted) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return Array.from(map.entries()).map(([key, items]) => ({
      key,
      label: formatDateKo(key),
      color: undefined,
      items,
    }));
  }, [filtered, groupBy]);

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
        <span className="filter-spacer" />
        <button
          type="button"
          className={"filter-saved-toggle" + (showSavedOnly ? " on" : "")}
          onClick={() => setShowSavedOnly((v) => !v)}
        >
          저장됨만 보기
        </button>
      </div>

      <div className="view-bar">
        <span className="view-label">보기</span>
        <div className="view-toggle">
          {(
            [
              ["date", "날짜별"],
              ["category", "분야별"],
              ["org", "기업별"],
            ] as [GroupBy, string][]
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              className={"view-btn" + (groupBy === val ? " on" : "")}
              onClick={() => setGroupBy(val)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={"view-density" + (compact ? " on" : "")}
          onClick={() => setCompact((v) => !v)}
        >
          {compact ? "자세히 보기" : "간단히 보기"}
        </button>
      </div>

      {loaded && grouped.length === 0 && (
        <div className="empty-state">조건에 맞는 소식이 없어요. 필터를 조정해보세요.</div>
      )}

      {grouped.map((g) => (
        <div className="date-group" key={g.key}>
          <h2>
            {g.color && <span className="group-dot" style={{ background: g.color }} />}
            {g.label}
            <span className="group-count">{g.items.length}</span>
          </h2>
          {g.items.map((entry) => (
            <article
              className={"entry-card" + (compact ? " compact" : "")}
              id={`entry-${entry.id}`}
              key={entry.id}
              style={{ borderLeftColor: CAT_VAR[entry.category] }}
            >
              <div className="entry-top">
                <span className="badge">
                  <span className="badge-dot" style={{ background: CAT_VAR[entry.category] }} />
                  {CATEGORY_LABEL[entry.category]}
                </span>
                {entry.org && <span className="badge org-badge">{entry.org}</span>}
                {isRecent(entry.date) && <span className="badge new">NEW</span>}
              </div>
              <h3 className="entry-title">
                {renderWithTerms(entry.title, entry.terms, setSelectedTerm)}
              </h3>
              {!compact && (
                <p className="entry-summary">
                  {renderWithTerms(entry.summary, entry.terms, setSelectedTerm)}
                </p>
              )}
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
