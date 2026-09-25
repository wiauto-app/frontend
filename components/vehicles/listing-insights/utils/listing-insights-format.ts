import type {
  CheckSeverity,
  FunnelMetricKey,
  FunnelTrend,
  InsightConfidence,
  ListingHealthTier,
  PriceVerdict,
} from "@/interfaces/vehicle-insights.interface";

const eurFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 1,
});

export const formatPriceEur = (value: number): string =>
  eurFormatter.format(value);

export const formatEurosCents = (value: number): string => {
  const euros = Math.floor(value / 100);
  const cents = value % 100;
  return `${euros},${cents.toString().padStart(2, "0")} €`;
};

export const formatDecimal = (value: number): string =>
  numberFormatter.format(value);

export const formatSignedPercent = (value: number): string => {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${numberFormatter.format(value)} %`;
};

export const formatShortDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const PRICE_VERDICT_LABEL: Record<PriceVerdict, string> = {
  sospechosamente_bajo: "Sospechosamente bajo",
  bajo: "Por debajo del mercado",
  competitivo: "Precio competitivo",
  alto: "Por encima del mercado",
  muy_alto: "Muy por encima del mercado",
};

export const PRICE_VERDICT_BADGE_CLASS: Record<PriceVerdict, string> = {
  sospechosamente_bajo:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300",
  bajo: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300",
  competitivo:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300",
  alto: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300",
  muy_alto:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300",
};

export const PRICE_VERDICT_MARKER_CLASS: Record<PriceVerdict, string> = {
  sospechosamente_bajo: "bg-red-600 dark:bg-red-400",
  bajo: "bg-sky-600 dark:bg-sky-400",
  competitivo: "bg-emerald-600 dark:bg-emerald-400",
  alto: "bg-amber-600 dark:bg-amber-400",
  muy_alto: "bg-red-600 dark:bg-red-400",
};

export const CONFIDENCE_LABEL: Record<InsightConfidence, string> = {
  high: "Confianza alta",
  medium: "Confianza media",
  low: "Confianza baja",
};

export const HEALTH_TIER_LABEL: Record<ListingHealthTier, string> = {
  high: "Anuncio sólido",
  medium: "Mejorable",
  low: "Necesita atención",
};

export const HEALTH_TIER_TEXT_CLASS: Record<ListingHealthTier, string> = {
  high: "text-emerald-600 dark:text-emerald-400",
  medium: "text-amber-600 dark:text-amber-400",
  low: "text-red-600 dark:text-red-400",
};

export const HEALTH_TIER_CHIP_CLASS: Record<ListingHealthTier, string> = {
  high: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  medium:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  low: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export const SEVERITY_LABEL: Record<CheckSeverity, string> = {
  critical: "Crítico",
  high: "Alto",
  medium: "Medio",
  low: "Bajo",
};

export const SEVERITY_DOT_CLASS: Record<CheckSeverity, string> = {
  critical: "bg-red-600 dark:bg-red-400",
  high: "bg-orange-500 dark:bg-orange-400",
  medium: "bg-amber-500 dark:bg-amber-400",
  low: "bg-sky-500 dark:bg-sky-400",
};

export const FUNNEL_METRIC_LABEL: Record<FunnelMetricKey, string> = {
  views: "Visitas",
  contact_clicks: "Clics en contacto",
  leads: "Contactos",
  chats: "Chats",
};

export const FUNNEL_TREND_LABEL: Record<FunnelTrend, string> = {
  above: "Por encima",
  on_par: "En la media",
  below: "Por debajo",
};

export const FUNNEL_TREND_CLASS: Record<FunnelTrend, string> = {
  above: "text-emerald-600 dark:text-emerald-400",
  on_par: "text-muted-foreground",
  below: "text-red-600 dark:text-red-400",
};
