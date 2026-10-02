"use client";

import { Glossary } from "@/lib/types";

export default function TermSidebar({
  termKey,
  glossary,
  onClose,
}: {
  termKey: string | null;
  glossary: Glossary;
  onClose: () => void;
}) {
  if (!termKey) return null;
  const entry = glossary[termKey];
  if (!entry) return null;

  return (
    <>
      <div className="term-overlay" onClick={onClose} />
      <aside className="term-sidebar" role="dialog" aria-label={`${entry.term} 설명`}>
        <button className="term-sidebar-close" onClick={onClose} type="button">
          닫기
        </button>
        <h3>{entry.term}</h3>
        <p className="def">{entry.definition}</p>
        {entry.origin && (
          <p className="origin">
            <b>어원 / 유래</b> — {entry.origin}
          </p>
        )}
      </aside>
    </>
  );
}
