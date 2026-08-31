/** Streak maths. Pure functions over a list of entries — no dates read from the clock unless passed in. */
import { daysBetween, todayKey } from "@/utils/date";

/**
 * current  – length of the run ending today or yesterday (yesterday still counts,
 *            so today's missing entry doesn't wipe the streak before bedtime).
 * longest  – longest run of consecutive calendar days anywhere in the data.
 * total    – number of logged days.
 */
export function calculateStreaks(entries, referenceKey = todayKey()) {
  const dates = Array.from(new Set((entries ?? []).map((e) => e.date))).sort();
  if (dates.length === 0) {
    return { current: 0, longest: 0, total: 0, lastEntryDate: null };
  }

  let longest = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i += 1) {
    run = daysBetween(dates[i - 1], dates[i]) === 1 ? run + 1 : 1;
    if (run > longest) longest = run;
  }

  const last = dates[dates.length - 1];
  const gapFromToday = daysBetween(last, referenceKey);

  let current = 0;
  if (gapFromToday === 0 || gapFromToday === 1) {
    current = 1;
    for (let i = dates.length - 1; i > 0; i -= 1) {
      if (daysBetween(dates[i - 1], dates[i]) === 1) current += 1;
      else break;
    }
  }

  return { current, longest, total: dates.length, lastEntryDate: last };
}

/** Mood stats used on the Insights page. */
export function calculateMoodStats(entries) {
  const list = entries ?? [];
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const entry of list) {
    distribution[entry.mood] = (distribution[entry.mood] ?? 0) + 1;
    sum += entry.mood;
  }
  const count = list.length;
  const withText = list.filter((e) => e.text.length > 0);
  const tagCounts = new Map();
  for (const entry of list) {
    for (const tag of entry.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }

  return {
    count,
    average: count ? sum / count : 0,
    distribution,
    bestDay: count ? list.reduce((a, b) => (b.mood > a.mood ? b : a)) : null,
    entriesWithText: withText.length,
    averageWords: withText.length
      ? Math.round(
          withText.reduce((acc, e) => acc + e.text.split(/\s+/).filter(Boolean).length, 0) /
            withText.length,
        )
      : 0,
    topTags: Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 8)
      .map(([tag, total]) => ({ tag, count: total })),
  };
}
