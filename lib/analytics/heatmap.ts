import { RecentlyPlayed, HeatmapCell } from "@/types";

export function buildHeatmap(recentlyPlayed: RecentlyPlayed[]): HeatmapCell[] {
  const map: Record<string, number> = {};
  
  recentlyPlayed.forEach(item => {
    const date = new Date(item.played_at);
    const day = date.getDay();
    const hour = date.getHours();
    const key = `${day}-${hour}`;
    map[key] = (map[key] || 0) + 1;
  });

  const cells: HeatmapCell[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      cells.push({ day, hour, count: map[`${day}-${hour}`] || 0 });
    }
  }
  return cells;
}

export function getPeakHour(cells: HeatmapCell[]): number {
  const hourCounts = Array(24).fill(0);
  cells.forEach(c => (hourCounts[c.hour] += c.count));
  return hourCounts.indexOf(Math.max(...hourCounts));
}

export function getNightOwlScore(cells: HeatmapCell[]): number {
  const nightCount = cells.filter(c => c.hour >= 22 || c.hour <= 4).reduce((a, c) => a + c.count, 0);
  const total = cells.reduce((a, c) => a + c.count, 0);
  return total ? Math.round((nightCount / total) * 100) : 0;
}

export function getWeekendScore(cells: HeatmapCell[]): number {
  const weekendCount = cells.filter(c => c.day === 0 || c.day === 6).reduce((a, c) => a + c.count, 0);
  const weekdayCount = cells.filter(c => c.day > 0 && c.day < 6).reduce((a, c) => a + c.count, 0);
  if (!weekdayCount) return 100;
  return Math.round((weekendCount / (weekdayCount / 5)) * 100);
}
