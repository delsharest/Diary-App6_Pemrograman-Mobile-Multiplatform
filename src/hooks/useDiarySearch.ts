import { useCallback, useEffect, useMemo, useState } from "react";
import type { DiaryEntry } from "../context/DiaryContext";

export function useDiarySearch(entries: DiaryEntry[], mood: string = "") {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset kedua nilai agar hasil langsung pulih tanpa menunggu debounce.
  const resetSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, []);

  const filteredEntries = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesQuery = !q || [entry.title, entry.preview, entry.date]
        .some((text) => text.toLowerCase().includes(q));
      const matchesMood = !mood || entry.mood === mood;
      return matchesQuery && matchesMood;
    });
  }, [entries, debouncedQuery, mood]);

  return { query, setQuery, resetSearch, filteredEntries,
    resultCount: filteredEntries.length };
}
