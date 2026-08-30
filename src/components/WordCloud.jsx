import { useMemo } from "react";
import { MessageSquareDashed } from "lucide-react";
import { buildWordFrequencies } from "@/utils/wordFrequency";
import { EmptyState } from "@/components/EmptyState";

const SIZE_BY_WEIGHT = {
  1: "text-sm",
  2: "text-base",
  3: "text-lg",
  4: "text-2xl",
  5: "text-3xl",
};

const TONE_BY_WEIGHT = {
  1: "text-muted-foreground",
  2: "text-muted-foreground",
  3: "text-foreground/80",
  4: "text-foreground",
  5: "text-primary",
};

export function WordCloud({ entries }) {
  const words = useMemo(() => buildWordFrequencies(entries), [entries]);

  if (words.length === 0) {
    return (
      <EmptyState
        icon={MessageSquareDashed}
        title="No words to map yet"
        description="Write a few sentences in your journal entries and your most frequent themes will surface here."
      />
    );
  }

  return (
    <ul className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
      {words.map(({ word, count, weight }) => (
        <li key={word}>
          <span
            className={`font-serif leading-tight ${SIZE_BY_WEIGHT[weight]} ${TONE_BY_WEIGHT[weight]}`}
            title={`${word}: ${count} ${count === 1 ? "mention" : "mentions"}`}
          >
            {word}
            <span className="sr-only">{`, ${count} mentions`}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
