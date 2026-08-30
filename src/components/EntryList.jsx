import { MOOD_LABELS } from "@/components/MoodScale";
import { formatShortDate } from "@/utils/date";

function preview(text) {
  if (!text) return "No journal text for this day.";
  return text.length > 160 ? `${text.slice(0, 160).trimEnd()}…` : text;
}

export function EntryList({ entries, selectedDate, onSelect }) {
  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li key={entry.date}>
          <button
            type="button"
            onClick={() => onSelect(entry.date)}
            aria-current={selectedDate === entry.date ? "true" : undefined}
            className={`w-full rounded-2xl border bg-card p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              selectedDate === entry.date
                ? "border-foreground/25 shadow-soft"
                : "border-border hover:border-foreground/20"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-foreground">
                {formatShortDate(entry.date)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`size-3 rounded-[3px] mood-cell-${entry.mood}`} aria-hidden="true" />
                {entry.mood}/5 · {MOOD_LABELS[entry.mood]}
              </span>
            </div>
            <p
              className={`mt-2 text-sm leading-relaxed ${
                entry.text ? "text-muted-foreground" : "italic text-muted-foreground/80"
              }`}
            >
              {preview(entry.text)}
            </p>
            {entry.tags.length ? (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  );
}
