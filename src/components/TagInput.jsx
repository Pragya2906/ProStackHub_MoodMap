import { useState } from "react";
import { X } from "lucide-react";

export function TagInput({ tags, onChange }) {
  const [draft, setDraft] = useState("");

  function commit() {
    const value = draft.trim().toLowerCase();
    if (!value) return;
    if (!tags.includes(value)) onChange([...tags, value].slice(0, 12));
    setDraft("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit();
    } else if (event.key === "Backspace" && !draft && tags.length) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div>
      <label htmlFor="tag-input" className="text-sm font-medium text-foreground">
        Tags
      </label>
      <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-foreground"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              aria-label={`Remove tag ${tag}`}
              className="rounded-full p-0.5 text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id="tag-input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          placeholder={tags.length ? "Add another…" : "work, family, rest…"}
          className="min-w-[8rem] flex-1 bg-transparent py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Press Enter or comma to add a tag.</p>
    </div>
  );
}
