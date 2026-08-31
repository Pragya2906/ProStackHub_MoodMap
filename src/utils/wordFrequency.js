/** Fully local word-frequency processing for the word cloud (no AI/ML, no network). */

const STOPWORDS = new Set(
  `a about above after again against all am an and any are aren't as at be because been before being
   below between both but by can can't cannot could couldn't did didn't do does doesn't doing don't
   down during each few for from further had hadn't has hasn't have haven't having he he'd he'll he's
   her here here's hers herself him himself his how how's i i'd i'll i'm i've if in into is isn't it
   it's its itself let's me more most mustn't my myself no nor not of off on once only or other ought
   our ours ourselves out over own same shan't she she'd she'll she's should shouldn't so some such
   than that that's the their theirs them themselves then there there's these they they'd they'll
   they're they've this those through to too under until up very was wasn't we we'd we'll we're we've
   were weren't what what's when when's where where's which while who who's whom why why's with won't
   would wouldn't you you'd you'll you're you've your yours yourself yourselves just really quite
   also got get gets getting going went was will still even much many thing things today day feel
   felt like lot bit maybe though because am`
    .split(/\s+/)
    .filter(Boolean),
);

const MIN_LENGTH = 3;

/** Splits text into normalised word tokens (lowercase, no punctuation, no digits-only tokens). */
export function tokenize(text) {
  if (typeof text !== "string" || !text) return [];
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .split(/[^a-z']+/)
    .map((token) => token.replace(/^'+|'+$/g, ""))
    .filter((token) => token.length >= MIN_LENGTH && !STOPWORDS.has(token));
}

/**
 * Counts word frequency across entries and returns the top `limit` words,
 * each with a 1..5 `weight` used for visual sizing.
 */
export function buildWordFrequencies(entries, limit = 40) {
  const counts = new Map();
  for (const entry of entries ?? []) {
    for (const word of tokenize(entry.text)) {
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
  }

  const ranked = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);

  if (ranked.length === 0) return [];

  const max = ranked[0][1];
  const min = ranked[ranked.length - 1][1];
  const span = Math.max(max - min, 1);

  return ranked.map(([word, count]) => ({
    word,
    count,
    weight: max === min ? 3 : 1 + Math.round(((count - min) / span) * 4),
  }));
}
