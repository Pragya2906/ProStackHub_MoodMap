/**
 * Journal CRUD. The only module the UI uses to touch stored entries.
 * Entry shape: { date: "YYYY-MM-DD", mood: 1..5, text: string, tags: string[], createdAt, updatedAt }
 */
import { withStore, DbError } from "@/db/moodDb";
import { isValidDateKey } from "@/utils/date";

const MAX_TAGS = 12;

/** Coerces stored/incoming data into a valid entry, or throws for unusable input. */
export function normalizeEntry(input) {
  if (!input || typeof input !== "object") throw new DbError("Invalid journal entry.");
  const date = String(input.date ?? "");
  if (!isValidDateKey(date)) throw new DbError("Invalid journal date.");

  const mood = Number(input.mood);
  if (!Number.isInteger(mood) || mood < 1 || mood > 5) {
    throw new DbError("Mood must be a whole number between 1 and 5.");
  }

  const text = typeof input.text === "string" ? input.text.trim() : "";
  const tags = Array.isArray(input.tags)
    ? Array.from(
        new Set(
          input.tags
            .filter((t) => typeof t === "string")
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean),
        ),
      ).slice(0, MAX_TAGS)
    : [];

  return { date, mood, text, tags };
}

/** Ignores rows that predate a schema change or were corrupted, instead of crashing the UI. */
function safeRead(rows) {
  const out = [];
  for (const row of rows ?? []) {
    try {
      out.push({ ...normalizeEntry(row), createdAt: row.createdAt, updatedAt: row.updatedAt });
    } catch {
      /* skip invalid row */
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

export async function getAllEntries() {
  const rows = await withStore("readonly", (store) => store.getAll());
  return safeRead(rows);
}

export async function getEntry(date) {
  if (!isValidDateKey(date)) return null;
  const row = await withStore("readonly", (store) => store.get(date));
  return row ? (safeRead([row])[0] ?? null) : null;
}

/** Inclusive range query using the by-date index. */
export async function getEntriesInRange(startDate, endDate) {
  if (!isValidDateKey(startDate) || !isValidDateKey(endDate)) return [];
  const rows = await withStore("readonly", (store) =>
    store.index("by-date").getAll(IDBKeyRange.bound(startDate, endDate)),
  );
  return safeRead(rows);
}

/** Creates or replaces the entry for a day (one entry per calendar day). */
export async function saveEntry(input) {
  const entry = normalizeEntry(input);
  const existing = await getEntry(entry.date);
  const now = new Date().toISOString();
  const record = {
    ...entry,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await withStore("readwrite", (store) => store.put(record));
  return record;
}

export async function updateEntry(date, patch) {
  const existing = await getEntry(date);
  if (!existing) throw new DbError("That entry no longer exists.");
  return saveEntry({ ...existing, ...patch, date });
}

export async function deleteEntry(date) {
  if (!isValidDateKey(date)) throw new DbError("Invalid journal date.");
  await withStore("readwrite", (store) => store.delete(date));
  return date;
}
