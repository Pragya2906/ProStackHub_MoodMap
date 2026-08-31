/** Date helpers. All keys are local-time "YYYY-MM-DD" so days never shift across timezones. */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parses a key into a local-noon Date (noon avoids DST edge shifts). */
export function fromDateKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function isValidDateKey(key) {
  if (typeof key !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const [y, m, d] = key.split("-").map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export function todayKey() {
  return toDateKey(new Date());
}

export function addDays(key, amount) {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
}

/** Whole-day difference between two keys (b - a). Safe across months and years. */
export function daysBetween(a, b) {
  const MS_PER_DAY = 86_400_000;
  return Math.round((fromDateKey(b) - fromDateKey(a)) / MS_PER_DAY);
}

export function monthShortName(monthIndex) {
  return MONTHS[monthIndex];
}

export function formatLongDate(key) {
  if (!isValidDateKey(key)) return "";
  return fromDateKey(key).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(key) {
  if (!isValidDateKey(key)) return "";
  return fromDateKey(key).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
