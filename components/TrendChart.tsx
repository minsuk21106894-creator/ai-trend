"use client";

import { useState } from "react";
import { CATEGORY_LABEL, Category, TrendEntry } from "@/lib/types";
import { ALL_CATS, buildWeeklySeries, topCategoryThisWeek, WeekBucket } from "@/lib/digest";

const CAT_VAR: Record<Category, string> = {
  model: "var(--cat-model)",
  product: "var(--cat-product)",
  research: "var(--cat-research)",
  industry: "var(--cat-industry)",
  policy: "var(--cat-policy)",
};

const BAR_W = 22;
const BAND_W = 52;
const CHART_H = 160;
const GAP = 2;

function niceMax(n: number): number {
  if (n <= 4) return 4;
  if (n <= 8) return 8;
  const step = Math.pow(10, Math.floor(Math.log10(n)));
  return Math.ceil(n / step) * step;
}

export default function TrendChart({ entries }: { entries: TrendEntry[] }) {
  const [hover, setHover] = useState<string | null>(null);
  const weekly = buildWeeklySeries(entries);
  const top = topCategoryThisWeek(weekly);

  if (weekly.length === 0) {
    return (
      <div className="chart-card">
        <h2>트렌드 흐름</h2>
        <p className="chart-sub">아직 쌓인 데이터가 많지 않아요. 며칠 더 모이면 주별 흐름이 보이기 시작합니다.</p>
      </div>
    );
  }

  const maxTotal = niceMax(Math.max(...weekly.map((w) => w.total)));
  const chartWidth = Math.max(weekly.length * BAND_W, 260);
  const yTicks = [0, Math.round(maxTotal / 2), maxTotal];

  function barsFor(bucket: WeekBucket) {
    const nonZero = ALL_CATS.filter((c) => bucket.counts[c] > 0);
    let yCursor = CHART_H;
    const segs: { cat: Category; y: number; h: number; isTop: boolean }[] = [];
    nonZero.forEach((cat, i) => {
      const h = Math.max((bucket.counts[cat] / maxTotal) * CHART_H, 2);
      yCursor -= h;
      segs.push({ cat, y: yCursor, h, isTop: i === nonZero.length - 1 });
      if (i < nonZero.length - 1) yCursor -= GAP;
    });
    return segs;
  }

  return (
    <div className="chart-card">
      <h2>트렌드 흐름</h2>
      <p className="chart-sub">
        주별로 어떤 분야 소식이 많았는지 쌓아서 보여줍니다. 막대를 눌러보면 그 주의 구성을 볼 수 있어요.
        {top && (
          <>
            {" "}
            최근 주는 <b style={{ color: CAT_VAR[top.category] }}>{CATEGORY_LABEL[top.category]}</b>{" "}
            소식이 가장 많았습니다 ({top.count}건).
          </>
        )}
      </p>

      <div className="chart-legend">
        {ALL_CATS.map((c) => (
          <div className="chart-legend-item" key={c}>
            <span className="chart-legend-dot" style={{ background: CAT_VAR[c] }} />
            {CATEGORY_LABEL[c]}
          </div>
        ))}
      </div>

      <div className="chart-svg-wrap">
        <svg
          viewBox={`0 0 ${chartWidth + 36} ${CHART_H + 26}`}
          width={chartWidth + 36}
          height={CHART_H + 26}
          role="img"
          aria-label="주별 카테고리별 소식 건수 누적 막대 그래프"
        >
          {yTicks.map((t) => {
            const y = CHART_H - (t / maxTotal) * CHART_H;
            return (
              <g key={t}>
                <line
                  x1={30}
                  x2={chartWidth + 30}
                  y1={y}
                  y2={y}
                  stroke="var(--chart-grid)"
                  strokeWidth={1}
                />
                <text x={0} y={y + 3} fontSize={10} fill="var(--chart-muted)">
                  {t}
                </text>
              </g>
            );
          })}

          {weekly.map((bucket, wi) => {
            const bandX = 30 + wi * BAND_W;
            const barX = bandX + (BAND_W - BAR_W) / 2;
            const segs = barsFor(bucket);
            return (
              <g
                key={bucket.weekStart}
                className="chart-bar-group"
                tabIndex={0}
                onMouseEnter={() => setHover(bucket.weekStart)}
                onMouseLeave={() => setHover((h) => (h === bucket.weekStart ? null : h))}
                onFocus={() => setHover(bucket.weekStart)}
                onBlur={() => setHover((h) => (h === bucket.weekStart ? null : h))}
                onClick={() => setHover(bucket.weekStart)}
              >
                {segs.map((s) => (
                  <rect
                    key={s.cat}
                    x={barX}
                    y={s.y}
                    width={BAR_W}
                    height={s.h}
                    fill={CAT_VAR[s.cat]}
                    rx={s.isTop ? 4 : 0}
                    ry={s.isTop ? 4 : 0}
                  />
                ))}
                {segs.length === 0 && (
                  <rect x={barX} y={CHART_H - 2} width={BAR_W} height={2} fill="var(--chart-grid)" />
                )}
                <rect
                  x={bandX}
                  y={0}
                  width={BAND_W}
                  height={CHART_H}
                  fill="transparent"
                />
                <text
                  x={bandX + BAND_W / 2}
                  y={CHART_H + 16}
                  fontSize={10.5}
                  textAnchor="middle"
                  fill="var(--ink-faint)"
                >
                  {bucket.label}
                </text>
              </g>
            );
          })}
        </svg>

        {hover &&
          (() => {
            const bucket = weekly.find((w) => w.weekStart === hover);
            if (!bucket) return null;
            const idx = weekly.indexOf(bucket);
            const left = 30 + idx * BAND_W + BAND_W / 2;
            return (
              <div
                className="chart-tooltip"
                style={{ left, top: 4, transform: "translateX(-50%)" }}
              >
                <b>{bucket.label}</b> · 총 {bucket.total}건
                <br />
                {ALL_CATS.filter((c) => bucket.counts[c] > 0)
                  .map((c) => `${CATEGORY_LABEL[c]} ${bucket.counts[c]}`)
                  .join(" · ")}
              </div>
            );
          })()}
      </div>
    </div>
  );
}
