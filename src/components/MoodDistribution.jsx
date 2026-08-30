import { MOOD_LABELS } from "@/components/MoodScale";

export function MoodDistribution({ distribution, total }) {
  return (
    <ul className="space-y-3">
      {[5, 4, 3, 2, 1].map((level) => {
        const count = distribution[level] ?? 0;
        const percent = total ? Math.round((count / total) * 100) : 0;
        return (
          <li key={level} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs text-muted-foreground">
              {level} · {MOOD_LABELS[level]}
            </span>
            <div
              className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted"
              role="img"
              aria-label={`Mood ${level}: ${count} entries, ${percent} percent`}
            >
              <div
                className={`h-full rounded-full mood-cell-${level}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="w-14 shrink-0 text-right text-xs text-muted-foreground">
              {count} · {percent}%
            </span>
          </li>
        );
      })}
    </ul>
  );
}
