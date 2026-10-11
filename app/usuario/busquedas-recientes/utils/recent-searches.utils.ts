import type { VehicleSearchHistoryItem } from "@/interfaces/vehicle-search-history.interface";

const LOCALE = "es-ES";

const relativeTimeFormatter = new Intl.RelativeTimeFormat(LOCALE, {
  numeric: "auto",
  style: "short",
});

const numberFormatter = new Intl.NumberFormat(LOCALE);

const absoluteDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: "long",
  timeStyle: "short",
});

const RELATIVE_UNITS: ReadonlyArray<{
  unit: Intl.RelativeTimeFormatUnit;
  seconds: number;
}> = [
  { unit: "year", seconds: 60 * 60 * 24 * 365 },
  { unit: "month", seconds: 60 * 60 * 24 * 30 },
  { unit: "week", seconds: 60 * 60 * 24 * 7 },
  { unit: "day", seconds: 60 * 60 * 24 },
  { unit: "hour", seconds: 60 * 60 },
  { unit: "minute", seconds: 60 },
];

const parseDate = (iso: string): Date | null => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** "hace 2 h", "ayer", "hace 3 sem."; "ahora mismo" por debajo del minuto. */
export const formatRelativeTime = (iso: string, now = Date.now()): string => {
  const date = parseDate(iso);
  if (!date) {
    return "";
  }

  const diff_seconds = Math.round((date.getTime() - now) / 1000);
  const abs_seconds = Math.abs(diff_seconds);

  if (abs_seconds < 60) {
    return "ahora mismo";
  }

  const match =
    RELATIVE_UNITS.find(({ seconds }) => abs_seconds >= seconds) ??
    RELATIVE_UNITS[RELATIVE_UNITS.length - 1];

  return relativeTimeFormatter.format(
    Math.round(diff_seconds / match.seconds),
    match.unit,
  );
};

/** Fecha completa para `title`/lectores de pantalla. */
export const formatAbsoluteDate = (iso: string): string => {
  const date = parseDate(iso);
  return date ? absoluteDateFormatter.format(date) : "";
};

const formatResults = (count: number | null): string | null => {
  if (count === null || count === undefined || !Number.isFinite(count)) {
    return null;
  }
  if (count === 0) {
    return "Sin resultados";
  }
  return `${numberFormatter.format(count)} ${count === 1 ? "resultado" : "resultados"}`;
};

const formatSearchCount = (count: number): string | null => {
  if (!Number.isFinite(count) || count < 1) {
    return null;
  }
  return count === 1 ? "buscado 1 vez" : `buscado ${numberFormatter.format(count)} veces`;
};

/** Partes del meta: "37 resultados · buscado 3 veces · hace 2 h". */
export const getRecentSearchMeta = (
  item: VehicleSearchHistoryItem,
  now?: number,
): string[] =>
  [
    formatResults(item.results_count),
    formatSearchCount(item.search_count),
    formatRelativeTime(item.last_searched_at, now),
  ].filter((part): part is string => Boolean(part));

export const formatFiltersCount = (count: number): string | null => {
  if (!Number.isFinite(count) || count < 1) {
    return null;
  }
  return count === 1 ? "1 filtro" : `${count} filtros`;
};

export const getRecentSearchLabel = (item: VehicleSearchHistoryItem): string =>
  item.label?.trim() || "Búsqueda de vehículos";
