import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteEntry as dbDeleteEntry,
  getAllEntries,
  saveEntry as dbSaveEntry,
} from "@/services/journalService";

export function useJournal() {
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const rows = await getAllEntries();
      setEntries(rows);
      setStatus("ready");
    } catch (err) {
      setError(err?.message ?? "Could not read your journal.");
      setStatus("error");
    }
  }, []);

  // IndexedDB only exists in the browser, so loading happens after mount.
  useEffect(() => {load();}, [load]);

  const saveEntry = useCallback(async (input) => {
    const saved = await dbSaveEntry(input);
    setEntries((prev) =>
      [...prev.filter((e) => e.date !== saved.date), saved].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    );
    return saved;
  }, []);

  const removeEntry = useCallback(async (date) => {
    await dbDeleteEntry(date);
    setEntries((prev) => prev.filter((e) => e.date !== date));
  }, []);

  const entriesByDate = useMemo(() => new Map(entries.map((e) => [e.date, e])), [entries]);

  return {entries, entriesByDate, status, error, reload: load, saveEntry, removeEntry};
}