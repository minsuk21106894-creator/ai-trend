import { CATEGORY_LABEL, Category, TrendEntry } from "@/lib/types";
import { buildDigest, buildWeeklySeries, topCategoryThisWeek } from "@/lib/digest";

const CAT_VAR: Record<Category, string> = {
  model: "var(--cat-model)",
  product: "var(--cat-product)",
  research: "var(--cat-research)",
  industry: "var(--cat-industry)",
  policy: "var(--cat-policy)",
};

export default function WeeklyDigest({ entries }: { entries: TrendEntry[] }) {
  const digest = buildDigest(entries, 7, 6);
  const weekly = buildWeeklySeries(entries);
  const top = topCategoryThisWeek(weekly);

  if (digest.length === 0) return null;

  return (
    <section className="digest">
      <div className="digest-head">
        <h2>이번 주 핵심만 모아보기</h2>
        {top && (
          <p className="digest-insight">
            이번 주는{" "}
            <b style={{ color: CAT_VAR[top.category] }}>{CATEGORY_LABEL[top.category]}</b> 소식이
            가장 활발했어요 ({top.count}건). 아래는 지난 7일 중 분야별로 핵심만 추린 소식입니다.
          </p>
        )}
      </div>
      <ul className="digest-list">
        {digest.map((e) => (
          <li key={e.id}>
            <a href={`#entry-${e.id}`}>
              <span className="digest-dot" style={{ background: CAT_VAR[e.category] }} />
              {e.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
