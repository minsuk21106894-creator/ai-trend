export function isRecent(dateStr: string, hours = 36): boolean {
  const entryTime = new Date(dateStr + "T00:00:00Z").getTime();
  const now = Date.now();
  const diffHours = (now - entryTime) / (1000 * 60 * 60);
  return diffHours >= 0 && diffHours <= hours;
}

export function formatDateKo(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][d.getUTCDay()];
  return `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${String(
    d.getUTCDate()
  ).padStart(2, "0")} (${weekday})`;
}
