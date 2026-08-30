import { useMemo } from "react";
import { buildHeatmapGrid, buildMonthLabels } from "@/utils/heatmap";
import { WEEKDAYS, formatLongDate, monthShortName, todayKey } from "@/utils/date";
import { MOOD_LABELS } from "@/components/MoodScale";

function cellClasses(entry, isSelected, isToday) {
    const base =
        "size-[11px] rounded-[3px] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:scale-125 sm:size-3";
    const level = entry ? `mood-cell-${entry.mood}` : "mood-cell-0";
    const ring = isSelected
        ? " ring-2 ring-ring ring-offset-1 ring-offset-background"
        : isToday
            ? " ring-1 ring-foreground/40"
            : "";
    return `${base} ${level}${ring}`;
}

export function MoodHeatmap({ entriesByDate, selectedDate, onSelectDate }) {
    const today = todayKey();
    const { weeks } = useMemo(() => buildHeatmapGrid(entriesByDate, today), [entriesByDate, today]);
    const monthLabels = useMemo(() => buildMonthLabels(weeks), [weeks]);

    return (
        <div className="space-y-3">
            <div className="overflow-x-auto pb-2" tabIndex={-1}>
                <div className="inline-flex min-w-max gap-2">
                    <div className="mt-[18px] flex flex-col gap-[3px] pr-1 text-[10px] text-muted-foreground">
                        {WEEKDAYS.map((day, index) => (
                            <span key={day} className="flex h-[11px] items-center sm:h-3" aria-hidden="true">
                                {index % 2 === 1 ? day : ""}
                            </span>
                        ))}
                    </div>

                    <div>
                        <div className="relative mb-1 h-4">
                            {monthLabels.map(({ columnIndex, month }) => (
                                <span
                                    key={`${month}-${columnIndex}`}
                                    className="absolute top-0 text-[10px] font-medium text-muted-foreground"
                                    style={{ left: `${columnIndex * 14}px` }}>
                                    {monthShortName(month)}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-[3px]" role="grid" aria-label="Mood heatmap for the last 12 months">
                            {weeks.map((week, weekIndex) => (
                                <div className="flex flex-col gap-[3px]" role="row" key={weekIndex}>
                                    {week.map((day, dayIndex) =>
                                        day.date ? (
                                            <button
                                                key={day.date}
                                                type="button"
                                                role="gridcell"
                                                onClick={() => onSelectDate(day.date)}
                                                className={cellClasses(day.entry, selectedDate === day.date, day.date === today)}
                                                title={`${formatLongDate(day.date)} — ${day.entry
                                                        ? `mood ${day.entry.mood} (${MOOD_LABELS[day.entry.mood]}), ${day.entry.text ? "journal entry saved" : "no journal text"
                                                        }`
                                                        : "no entry"
                                                    }`}
                                                aria-label={`${formatLongDate(day.date)}. ${day.entry
                                                        ? `Mood ${day.entry.mood} of 5, ${MOOD_LABELS[day.entry.mood]}. ${day.entry.text ? "Has a journal entry." : "No journal text."
                                                        }`
                                                        : "No entry."
                                                    } Open journal editor.`}/>
                                        ) : (
                                            <span
                                                key={`${weekIndex}-${dayIndex}`}
                                                className="size-[11px] sm:size-3"
                                                aria-hidden="true"
                                            />
                                        ),
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                <p>Tap any day to write or edit that day&apos;s journal.</p>
                <div className="flex items-center gap-1.5">
                    <span>Low</span>
                    {[0, 1, 2, 3, 4, 5].map((level) => (
                        <span
                            key={level}
                            className={`size-3 rounded-[3px] mood-cell-${level}`}
                            aria-hidden="true"
                        />
                    ))}
                    <span>High</span>
                </div>
            </div>
        </div>
    );
}
