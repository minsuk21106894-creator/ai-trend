import { Category, TrendEntry } from "./types";

export const ALL_CATS: Category[] = ["model", "product", "research", "industry", "policy"];

export function getWeekStart(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}

export function weekLabel(weekStart: string): string {
  const d = new Date(weekStart + "T00:00:00Z");
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}주`;
}

export interface WeekBucket {
  weekStart: string;
  label: string;
  counts: Record<Category, number>;
  total: number;
}

export function buildWeeklySeries(entries: TrendEntry[]): WeekBucket[] {
  const map = new Map<string, WeekBucket>();
  for (const e of entries) {
    const ws = getWeekStart(e.date);
    if (!map.has(ws)) {
      map.set(ws, {
        weekStart: ws,
        label: weekLabel(ws),
        counts: { model: 0, product: 0, research: 0, industry: 0, policy: 0 },
        total: 0,
      });
    }
    const bucket = map.get(ws)!;
    bucket.counts[e.category]++;
    bucket.total++;
  }
  return Array.from(map.values()).sort((a, b) => (a.weekStart < b.weekStart ? -1 : 1));
}

export function topCategoryThisWeek(
  buckets: WeekBucket[]
): { category: Category; count: number } | null {
  if (buckets.length === 0) return null;
  const last = buckets[buckets.length - 1];
  let top: Category | null = null;
  let max = 0;
  for (const c of ALL_CATS) {
    if (last.counts[c] > max) {
      max = last.counts[c];
      top = c;
    }
  }
  if (!top || max === 0) return null;
  return { category: top, count: max };
}

export interface Stats {
  total: number;
  thisWeek: number;
  topCategory: { category: Category; count: number } | null;
}

export function buildStats(entries: TrendEntry[]): Stats {
  const weekly = buildWeeklySeries(entries);
  const thisWeek = weekly.length > 0 ? weekly[weekly.length - 1].total : 0;
  return {
    total: entries.length,
    thisWeek,
    topCategory: topCategoryThisWeek(weekly),
  };
}

export function buildDigest(entries: TrendEntry[], days = 7, limit = 6): TrendEntry[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const recent = entries.filter((e) => new Date(e.date + "T00:00:00Z").getTime() >= cutoff);
  const sorted = [...recent].sort((a, b) => (a.date < b.date ? 1 : -1));

  const seen = new Set<Category>();
  const picked: TrendEntry[] = [];
  for (const e of sorted) {
    if (!seen.has(e.category)) {
      seen.add(e.category);
      picked.push(e);
    }
    if (picked.length >= limit) break;
  }
  if (picked.length < limit) {
    for (const e of sorted) {
      if (picked.length >= limit) break;
      if (!picked.find((p) => p.id === e.id)) picked.push(e);
    }
  }
  return picked.slice(0, limit);
}
