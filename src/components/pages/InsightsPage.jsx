import { BarChart3 } from "lucide-react";
import { useJournal } from "@/hooks/useJournal";
import { WordCloud } from "@/components/WordCloud";
import { MoodDistribution } from "@/components/MoodDistribution";
import { StatCard } from "@/components/StatCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/EmptyState";
import { calculateMoodStats, calculateStreaks } from "@/utils/streaks";
import { MOOD_LABELS } from "@/components/MoodScale";
import { formatShortDate } from "@/utils/date";

export function InsightsPage() {
  const { entries, status, error, reload } = useJournal();
  const stats = calculateMoodStats(entries);
  const streaks = calculateStreaks(entries);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <header>
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Insights</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Everything here is calculated in your browser from the entries you&apos;ve saved.
        </p>
      </header>

      {status === "error" ? <ErrorState message={error} onRetry={reload} /> : null}
      {status === "loading" ? <LoadingState label="Crunching your entries…" /> : null}

      {status === "ready" ? (
        entries.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="Nothing to analyse yet"
            description="Once you save a few entries, your mood averages, distribution and word cloud will appear here."
          />
        ) : (
          <>
            <section aria-label="Mood summary" className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Average mood"
                value={stats.average.toFixed(1)}
                hint={`Across ${stats.count} logged ${stats.count === 1 ? "day" : "days"}`}
              />
              <StatCard
                label="Most common mood"
                value={mostCommonMood(stats.distribution)}
                hint={MOOD_LABELS[Number(mostCommonMood(stats.distribution))] ?? ""}
              />
              <StatCard
                label="Words per entry"
                value={stats.averageWords}
                hint={`${stats.entriesWithText} ${
                  stats.entriesWithText === 1 ? "entry has" : "entries have"
                } journal text`}
              />
            </section>

            <section
              aria-labelledby="distribution-heading"
              className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6"
            >
              <h2 id="distribution-heading" className="font-serif text-xl text-foreground">
                Mood distribution
              </h2>
              <div className="mt-5">
                <MoodDistribution distribution={stats.distribution} total={stats.count} />
              </div>
            </section>

            <section
              aria-labelledby="wordcloud-heading"
              className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6"
            >
              <h2 id="wordcloud-heading" className="font-serif text-xl text-foreground">
                What you write about
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Most frequent meaningful words across your journal, with common stopwords removed.
              </p>
              <div className="mt-5">
                <WordCloud entries={entries} />
              </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
                <h2 className="font-serif text-xl text-foreground">Top tags</h2>
                {stats.topTags.length ? (
                  <ul className="mt-4 space-y-2 text-sm">
                    {stats.topTags.map(({ tag, count }) => (
                      <li key={tag} className="flex items-center justify-between gap-3">
                        <span className="text-foreground">#{tag}</span>
                        <span className="text-muted-foreground">
                          {count} {count === 1 ? "entry" : "entries"}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No tags yet — add tags to an entry to group your days.
                  </p>
                )}
              </div>

              <div className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
                <h2 className="font-serif text-xl text-foreground">Consistency</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <Row label="Current streak" value={`${streaks.current} days`} />
                  <Row label="Longest streak" value={`${streaks.longest} days`} />
                  <Row label="Total days logged" value={streaks.total} />
                  <Row
                    label="Best mood day"
                    value={
                      stats.bestDay
                        ? `${formatShortDate(stats.bestDay.date)} · ${stats.bestDay.mood}/5`
                        : "—"
                    }
                  />
                </dl>
              </div>
            </section>
          </>
        )
      ) : null}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

function mostCommonMood(distribution) {
  const entries = Object.entries(distribution).sort(
    (a, b) => b[1] - a[1] || Number(b[0]) - Number(a[0]),
  );
  return entries[0]?.[1] ? entries[0][0] : "—";
}
