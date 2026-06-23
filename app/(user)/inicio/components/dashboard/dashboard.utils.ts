import type { OwnerDashboardMetric, OwnerDashboardPeriod } from "@/interfaces/owner-dashboard.interface";

export const PERIOD_OPTIONS: { value: OwnerDashboardPeriod; label: string }[] = [
  { value: "7d", label: "Últimos 7 días" },
  { value: "30d", label: "Últimos 30 días" },
  { value: "90d", label: "Últimos 90 días" },
];

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

export const formatBucketDate = (isoDate: string): string => {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  }).format(date);
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
