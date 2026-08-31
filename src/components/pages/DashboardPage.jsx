import { useState } from "react";
import { Flame, NotebookPen, Trophy } from "lucide-react";
import { useJournal } from "@/hooks/useJournal";
import { MoodHeatmap } from "@/components/MoodHeatmap";
import { JournalEditor } from "@/components/JournalEditor";
import { StatCard } from "@/components/StatCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/EmptyState";
import { calculateStreaks } from "@/utils/streaks";
import { formatShortDate, todayKey } from "@/utils/date";

export function DashboardPage({ onNavigate = () => {} }) {
  const { entries, entriesByDate, status, error, reload, saveEntry, removeEntry } = useJournal();
  const [selectedDate, setSelectedDate] = useState(todayKey());

  const streaks = calculateStreaks(entries);
  const selectedEntry = entriesByDate.get(selectedDate) ?? null;
  const isEmpty = status === "ready" && entries.length === 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {formatShortDate(todayKey())}
        </p>
        <h1 className="mt-2 max-w-2xl font-serif text-3xl leading-tight text-foreground sm:text-4xl">
          {isEmpty ? "Welcome to MoodMap" : "A year of your days, one square at a time"}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {isEmpty
            ? "Start logging your mood today. Pick a rating from 1 to 5, add a few lines about your day, and your heatmap will begin to fill in."
            : "Rate your mood, write what happened, and watch patterns emerge across the last twelve months."}
        </p>
      </section>

      {status === "error" ? <ErrorState message={error} onRetry={reload} /> : null}
      {status === "loading" ? <LoadingState /> : null}

      {status === "ready" ? (
        <>
          <section aria-label="Your stats" className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Current streak"
              value={streaks.current}
              hint={
                streaks.current === 0
                  ? "Log today to start a streak"
                  : `${streaks.current === 1 ? "day" : "days"} in a row`
              }
              icon={Flame}
            />
            <StatCard
              label="Longest streak"
              value={streaks.longest}
              hint={streaks.longest ? "Your personal best" : "No streak yet"}
              icon={Trophy}
            />
            <StatCard
              label="Total days logged"
              value={streaks.total}
              hint={
                streaks.lastEntryDate
                  ? `Last entry ${formatShortDate(streaks.lastEntryDate)}`
                  : "Nothing logged yet"
              }
              icon={NotebookPen}
            />
          </section>

          <section
            aria-labelledby="heatmap-heading"
            className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6"
          >
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="heatmap-heading" className="font-serif text-xl text-foreground">
                Last 12 months
              </h2>
              <p className="text-xs text-muted-foreground">
                {streaks.total} of the last 365 days logged
              </p>
            </div>
            <MoodHeatmap
              entriesByDate={entriesByDate}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
              <JournalEditor
                date={selectedDate}
                entry={selectedEntry}
                onSave={saveEntry}
                onDelete={removeEntry}
              />
            </div>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
                <h2 className="font-serif text-lg text-foreground">Selected day</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Date</dt>
                    <dd className="text-foreground">{formatShortDate(selectedDate)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Mood</dt>
                    <dd className="text-foreground">
                      {selectedEntry ? `${selectedEntry.mood} / 5` : "Not logged"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Journal</dt>
                    <dd className="text-foreground">{selectedEntry?.text ? "Written" : "Empty"}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Tags</dt>
                    <dd className="max-w-[60%] text-right text-foreground">
                      {selectedEntry?.tags.length
                        ? selectedEntry.tags.map((t) => `#${t}`).join(" ")
                        : "None"}
                    </dd>
                  </div>
                </dl>
              </div>

              {isEmpty ? (
                <EmptyState
                  icon={NotebookPen}
                  title="Your heatmap is waiting"
                  description="Nothing logged yet — save your first entry and your streaks, insights and word cloud will come to life."
                />
              ) : (
                <div className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
                  <h2 className="font-serif text-lg text-foreground">Keep going</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Browse everything you&apos;ve written, or look at your mood patterns and most
                    frequent words.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate("journal")}
                      className="inline-flex min-h-11 items-center rounded-xl border border-border px-4 text-sm font-medium text-foreground hover:bg-accent"
                    >
                      All entries
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate("insights")}
                      className="inline-flex min-h-11 items-center rounded-xl border border-border px-4 text-sm font-medium text-foreground hover:bg-accent"
                    >
                      Insights
                    </button>
                  </div>
                </div>
              )}
            </aside>
          </section>
        </>
      ) : null}
    </div>
  );
}
