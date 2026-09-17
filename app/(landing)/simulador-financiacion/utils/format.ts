import type { FinancingCurrency } from "@/interfaces/financing-simulator.interface";

export const formatCurrency = (
  value: number,
  currency: FinancingCurrency = "USD",
  options?: { decimals?: boolean },
): string => {
  const maximumFractionDigits = options?.decimals ? 2 : 0;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits,
    minimumFractionDigits: options?.decimals ? 2 : 0,
  }).format(Number.isFinite(value) ? value : 0);

  return formatted;
};

export const formatPercent = (value: number, digits = 2): string =>
  `${Number.isFinite(value) ? value.toFixed(digits) : "0.00"}%`;

export const formatScheduleDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};
