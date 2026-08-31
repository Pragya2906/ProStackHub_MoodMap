import { useMemo, useState } from "react";
import { NotebookPen, Search } from "lucide-react";
import { useJournal } from "@/hooks/useJournal";
import { EntryList } from "@/components/EntryList";
import { JournalEditor } from "@/components/JournalEditor";
import { EmptyState, ErrorState, LoadingState } from "@/components/EmptyState";
import { MOOD_LABELS } from "@/components/MoodScale";
import { todayKey } from "@/utils/date";

export function JournalPage() {
  const { entries, entriesByDate, status, error, reload, saveEntry, removeEntry } = useJournal();
  const [query, setQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return entries
      .filter((entry) => (moodFilter === "all" ? true : entry.mood === Number(moodFilter)))
      .filter((entry) =>
        term
          ? entry.text.toLowerCase().includes(term) ||
            entry.tags.some((tag) => tag.includes(term)) ||
            entry.date.includes(term)
          : true,
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [entries, moodFilter, query]);

  const activeDate = selectedDate ?? filtered[0]?.date ?? todayKey();
  const activeEntry = entriesByDate.get(activeDate) ?? null;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <header>
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Journal</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Every entry you&apos;ve saved, newest first. Select one to read or edit it.
        </p>
      </header>

      {status === "error" ? <ErrorState message={error} onRetry={reload} /> : null}
      {status === "loading" ? <LoadingState /> : null}

      {status === "ready" ? (
        entries.length === 0 ? (
          <EmptyState
            icon={NotebookPen}
            title="No entries yet"
            description="Head to the dashboard, pick a day on your heatmap and write your first entry."
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <section aria-label="Entry list" className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <label htmlFor="journal-search" className="sr-only">
                    Search entries by text, tag or date
                  </label>
                  <input
                    id="journal-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search text, #tag or date"
                    className="min-h-11 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label htmlFor="mood-filter" className="sr-only">
                    Filter by mood
                  </label>
                  <select
                    id="mood-filter"
                    value={moodFilter}
                    onChange={(event) => setMoodFilter(event.target.value)}
                    className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-44"
                  >
                    <option value="all">All moods</option>
                    {[5, 4, 3, 2, 1].map((level) => (
                      <option key={level} value={level}>
                        {level} · {MOOD_LABELS[level]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-xs text-muted-foreground" role="status">
                {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
              </p>

              {filtered.length === 0 ? (
                <EmptyState
                  title="No matching entries"
                  description="Try a different search term or clear the mood filter."
                />
              ) : (
                <EntryList
                  entries={filtered}
                  selectedDate={activeDate}
                  onSelect={setSelectedDate}
                />
              )}
            </section>

            <section
              aria-label="Entry details"
              className="h-fit rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6 lg:sticky lg:top-24"
            >
              <JournalEditor
                date={activeDate}
                entry={activeEntry}
                onSave={saveEntry}
                onDelete={async (date) => {
                  await removeEntry(date);
                  setSelectedDate(null);
                }}
              />
            </section>
          </div>
        )
      ) : null}
    </div>
  );
}
