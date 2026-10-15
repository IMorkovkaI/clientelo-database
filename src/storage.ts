import { DEFAULT_FILTERS } from "./ranking";
import type { SavedState, Criterion } from "./types";
export const STORAGE_KEY = "investor-atlas:v1";
export function parseSaved(raw: string | null, ids: string[]): SavedState {
  const fallback: SavedState = {
    version: 1,
    filters: { ...DEFAULT_FILTERS },
    draft: [],
  };
  try {
    const value = JSON.parse(raw ?? "null");
    if (value?.version !== 1) return fallback;
    const f = { ...DEFAULT_FILTERS };
    for (const key of [
      "query",
      "sectors",
      "stages",
      "geography",
      "amount",
      "focus",
    ] as const)
      if (typeof value.filters?.[key] === "string")
        f[key] = value.filters[key].slice(0, 200);
    for (const key of ["includeUnknown", "recentOnly"] as const)
      if (typeof value.filters?.[key] === "boolean")
        f[key] = value.filters[key];
    if (["EUR", "USD", "CZK"].includes(value.filters?.currency))
      f.currency = value.filters.currency;
    if (["fit", "name", "recent"].includes(value.filters?.sort))
      f.sort = value.filters.sort;
    f.must = Array.isArray(value.filters?.must)
      ? value.filters.must.filter((k: Criterion) =>
          ["sectors", "stages", "geography", "ticket", "focus"].includes(k),
        )
      : [];
    const seen = new Set<string>();
    const draft = Array.isArray(value.draft)
      ? value.draft
          .filter((d: { id: string; note: string }) => {
            if (
              !d ||
              !ids.includes(d.id) ||
              seen.has(d.id) ||
              typeof d.note !== "string"
            )
              return false;
            seen.add(d.id);
            return true;
          })
          .map((d: { id: string; note: string }) => ({
            id: d.id,
            note: d.note.slice(0, 2000),
          }))
      : [];
    return { version: 1, filters: f, draft };
  } catch {
    return fallback;
  }
}
export function moveDraft<T>(items: T[], index: number, delta: number): T[] {
  const target = index + delta;
  if (target < 0 || target >= items.length) return items;
  const copy = [...items];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}
