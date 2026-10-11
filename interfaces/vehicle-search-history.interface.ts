/**
 * Búsqueda reciente registrada por el backend (GET /v1/vehicles con
 * `x-record-search: 1`). `query` usa las claves DTO de GET /v1/vehicles.
 */
export interface VehicleSearchHistoryItem {
  id: string;
  query: Record<string, unknown>;
  /** Resumen en español, p. ej. "BMW Serie 3 · 2018-2022 · Diésel". */
  label: string;
  filters_count: number;
  results_count: number | null;
  search_count: number;
  /** ISO 8601. */
  last_searched_at: string;
}
