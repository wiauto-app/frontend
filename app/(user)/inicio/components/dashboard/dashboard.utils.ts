import type {
  OwnerDashboardGranularity,
  OwnerDashboardMetric,
} from "@/interfaces/owner-dashboard.interface";

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat("es-ES").format(value);

export const formatEuros = (value: number): string =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatPercentChange = (changePercent: number | null): string => {
  if (changePercent === null) {
    return "Sin datos previos";
  }

  const prefix = changePercent > 0 ? "+" : "";
  return `${prefix}${changePercent}% vs período anterior`;
};

export const isMetricPositive = (metric: OwnerDashboardMetric): boolean =>
  (metric.change_percent ?? 0) >= 0;

export const formatDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDefaultDashboardDateRange = (): {
  startDate: string;
  endDate: string;
} => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);

  return {
    startDate: formatDateInputValue(startDate),
    endDate: formatDateInputValue(endDate),
  };
};

export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) {
    return false;
  }

  return startDate <= endDate;
};

export const getDateRangeError = (
  startDate: string,
  endDate: string,
): string | null => {
  if (!startDate || !endDate) {
    return "Selecciona una fecha de inicio y una de fin.";
  }

  if (!isValidDateRange(startDate, endDate)) {
    return "La fecha de inicio debe ser anterior o igual a la de fin.";
  }

  return null;
};

export const formatBucketDate = (
  isoDate: string,
  granularity: OwnerDashboardGranularity,
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

export const getViewsChartSubtitle = (
  granularity: OwnerDashboardGranularity,
): string => {
  switch (granularity) {
    case "day":
      return "Evolución diaria de visitas en el período seleccionado.";
    case "week":
      return "Evolución semanal de visitas en el período seleccionado.";
    case "month":
      return "Evolución mensual de visitas en el período seleccionado.";
  }
};

export const formatPhone = (
  phoneCode: string | null | undefined,
  phone: string | null | undefined,
): string | null => {
  if (!phone) {
    return null;
  }

  return phoneCode ? `${phoneCode} ${phone}` : phone;
};

export const buildSparklinePath = (values: number[]): string | null => {
  if (values.length < 2) {
    return null;
  }

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const width = 100;
  const height = 30;
  const step = width / (values.length - 1);

  const points = values.map((value, index) => {
    const x = index * step;
    const normalized = (value - min) / range;
    const y = height - normalized * height;
    return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  return points.join(" ");
};
