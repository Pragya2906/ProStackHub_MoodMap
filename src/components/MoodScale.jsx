export const MOOD_LABELS = {
  1: "Rough",
  2: "Low",
  3: "Steady",
  4: "Good",
  5: "Great",
};

/** Accessible radio group for the 1–5 mood rating. */
export function MoodScale({ value, onChange, name = "mood" }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-foreground">Mood</legend>
      <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Mood rating from 1 to 5">
        {[1, 2, 3, 4, 5].map((level) => {
          const active = value === level;
          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={active}
              name={name}
              onClick={() => onChange(level)}
              className={`flex min-h-11 flex-1 min-w-[74px] flex-col items-center justify-center gap-1 rounded-xl border px-3 py-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? "border-foreground/25 bg-accent text-accent-foreground shadow-soft"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}>
              <span className={`size-3.5 rounded-full mood-cell-${level}`} aria-hidden="true" />
              <span className="font-medium">{level}</span>
              <span>{MOOD_LABELS[level]}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
