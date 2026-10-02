import { CATEGORY_LABEL, Category, TrendEntry } from "@/lib/types";
import { buildStats } from "@/lib/digest";

const CAT_VAR: Record<Category, string> = {
  model: "var(--cat-model)",
  product: "var(--cat-product)",
  research: "var(--cat-research)",
  industry: "var(--cat-industry)",
  policy: "var(--cat-policy)",
};

export default function StatRow({ entries }: { entries: TrendEntry[] }) {
  const stats = buildStats(entries);

  return (
    <div className="stat-row">
      <div className="stat-tile">
        <span className="stat-label">누적 수집</span>
        <span className="stat-value">{stats.total}건</span>
      </div>
      <div className="stat-tile">
        <span className="stat-label">이번 주</span>
        <span className="stat-value">{stats.thisWeek}건</span>
      </div>
      <div className="stat-tile">
        <span className="stat-label">이번 주 최다 분야</span>
        <span className="stat-value">
          {stats.topCategory ? (
            <>
              <span
                className="stat-dot"
                style={{ background: CAT_VAR[stats.topCategory.category] }}
              />
              {CATEGORY_LABEL[stats.topCategory.category]}
            </>
          ) : (
            "—"
          )}
        </span>
      </div>
    </div>
  );
}
