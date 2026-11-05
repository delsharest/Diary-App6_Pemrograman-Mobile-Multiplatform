import { useMemo } from "react";
import type { DiaryEntry } from "../context/DiaryContext";

export function useLikedEntries(entries: DiaryEntry[], likedIds: Set<number>) {
  return useMemo(() => entries.filter((entry) => likedIds.has(entry.id)),
    [entries, likedIds]);
}
