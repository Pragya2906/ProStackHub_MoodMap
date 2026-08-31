/** Builds the week/day grid for the 12-month heatmap. Pure data — the component only renders it. */
import { addDays, fromDateKey, toDateKey, todayKey } from "@/utils/date";

/**
 * Returns 53-ish week columns of 7 days, ending on today and starting on the
 * Sunday of the week containing "today minus 12 months".
 */
export function buildHeatmapGrid(entriesByDate, endKey = todayKey()) {
  const end = fromDateKey(endKey);
  const start = new Date(end);
  start.setFullYear(start.getFullYear() - 1);
  start.setDate(start.getDate() + 1);
  // Align the first column to a Sunday so weekday rows line up.
  start.setDate(start.getDate() - start.getDay());

  const weeks = [];
  let cursor = toDateKey(start);
  const endCursor = toDateKey(end);

  while (true) {
    const week = [];
    for (let i = 0; i < 7; i += 1) {
      const inRange = cursor <= endCursor;
      week.push(
        inRange
          ? { date: cursor, entry: entriesByDate.get(cursor) ?? null, weekday: i }
          : { date: null, entry: null, weekday: i },
      );
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
    if (cursor > endCursor) break;
  }

  return { weeks, startDate: toDateKey(start), endDate: endCursor };
}

/**
 * Month labels positioned over the column where each month first appears.
 * Labels closer than 3 columns to the previous one are skipped so they don't overlap
 * (happens when the window starts mid-month).
 */
export function buildMonthLabels(weeks) {
  const labels = [];
  let lastMonth = null;
  let lastIndex = -Infinity;
  weeks.forEach((week, index) => {
    const firstReal = week.find((d) => d.date);
    if (!firstReal) return;
    const month = fromDateKey(firstReal.date).getMonth();
    if (month !== lastMonth) {
      lastMonth = month;
      if (index - lastIndex < 3) return;
      labels.push({ columnIndex: index, month });
      lastIndex = index;
    }
  });
  return labels;
}
