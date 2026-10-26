import type { OwnerStatisticsGranularity } from "@/interfaces/owner-statistics.interface";

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat("es-ES").format(value);

export const formatPercent = (value: number | null): string => {
  if (value === null) {
    return "Sin datos";
  }

  return `${value}%`;
};

export const formatMinutes = (value: number | null): string => {
  if (value === null) {
    return "Sin datos";
  }

  if (value < 60) {
    return `${value} min`;
  }

  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
};

export const formatDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDefaultEstadisticasDateRange = (): {
  since: string;
  until: string;
} => {
  const until = new Date();
  const since = new Date();
  since.setDate(since.getDate() - 29);

  return {
    since: formatDateInputValue(since),
    until: formatDateInputValue(until),
  };
};

export const isValidDateRange = (since: string, until: string): boolean => {
  if (!since || !until) {
    return false;
  }

  return since <= until;
};

export const getDateRangeError = (
  since: string,
  until: string,
): string | null => {
  if (!since || !until) {
    return "Selecciona una fecha de inicio y una de fin.";
  }

  if (!isValidDateRange(since, until)) {
    return "La fecha de inicio debe ser anterior o igual a la de fin.";
  }

  return null;
};

export const formatBucketDate = (
  isoDate: string,
  granularity: OwnerStatisticsGranularity,
): string => {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  if (granularity === "month") {
    return new Intl.DateTimeFormat("es-ES", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
};
