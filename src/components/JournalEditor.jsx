import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { MoodScale } from "@/components/MoodScale";
import { TagInput } from "@/components/TagInput";
import { formatLongDate, todayKey } from "@/utils/date";

export function JournalEditor({ date, entry, onSave, onDelete }) {
    const [mood, setMood] = useState(entry?.mood ?? 3);
    const [text, setText] = useState(entry?.text ?? "");
    const [tags, setTags] = useState(entry?.tags ?? []);
    const [state, setState] = useState({ kind: "idle", message: "" });

    useEffect(() => {
        setMood(entry?.mood ?? 3);
        setText(entry?.text ?? "");
        setTags(entry?.tags ?? []);
        setState({ kind: "idle", message: "" });
    }, [date, entry]);

    const isFuture = useMemo(() => date > todayKey(), [date]);

    async function handleSubmit(event) {
        event.preventDefault();
        if (isFuture) {
            setState({ kind: "error", message: "You can't log a mood for a future date." });
            return;
        }
        setState({ kind: "saving", message: "" });
        try {
            await onSave({ date, mood, text, tags });
            setState({ kind: "success", message: "Saved." });
        } catch (err) {
            setState({ kind: "error", message: err?.message ?? "Could not save this entry." });
        }
    }

    async function handleDelete() {
        setState({ kind: "saving", message: "" });
        try {
            await onDelete(date);
            setState({ kind: "success", message: "Entry deleted." });
        } catch (err) {
            setState({ kind: "error", message: err?.message ?? "Could not delete this entry." });
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <header className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        {entry ? "Editing entry" : "New entry"}
                    </p>
                    <h2 className="mt-1 font-serif text-2xl text-foreground">{formatLongDate(date)}</h2>
                </div>
                {entry ? (
                    <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                        Logged
                    </span>
                ) : null}
            </header>

            <MoodScale value={mood} onChange={setMood} />

            <div>
                <label htmlFor="journal-text" className="text-sm font-medium text-foreground">
                    Journal
                </label>
                <textarea
                    id="journal-text"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    rows={7}
                    placeholder="What shaped today?"
                    className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"/>
                <p className="mt-1 text-xs text-muted-foreground">
                    {text.trim() ? `${text.trim().split(/\s+/).length} words` : "Optional — mood alone counts."}
                </p>
            </div>

            <TagInput tags={tags} onChange={setTags} />

            {state.kind === "error" ? (
                <p role="alert" className="text-sm text-destructive">
                    {state.message}
                </p>
            ) : null}
            {state.kind === "success" ? (
                <p role="status" className="text-sm text-muted-foreground">
                    {state.message}
                </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
                <button
                    type="submit"
                    disabled={state.kind === "saving"}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60">
                    {entry ? "Update entry" : "Save entry"}
                </button>
                {entry ? (
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={state.kind === "saving"}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-destructive/40 hover:text-destructive disabled:opacity-60">
                        <Trash2 className="size-4" aria-hidden="true" />
                        Delete
                    </button>
                ) : null}
            </div>
        </form>
    );
}
