import type {
  BillingMeEntitlementEntry,
  BillingPlanEntitlement,
  EntitlementBooleanValue,
  EntitlementFeatureKey,
  EntitlementLimitValue,
  EntitlementUnlimitedValue,
} from "@/interfaces/billing.interface";

export interface EntitlementDisplayItem {
  feature: string;
  label: string;
  included: boolean;
  valueLabel: string | null;
}

const FEATURE_LABELS: Record<string, string> = {
  vehicles: "Vehículos activos",
  photos_per_vehicle: "Fotos por vehículo",
  videos_per_vehicle: "Vídeos por vehículo",
  ai_requests: "Consultas de IA",
  users: "Usuarios del equipo",
  video_upload: "Subida de vídeos",
  ai_generation: "Generación con IA",
  statistics: "Estadísticas avanzadas",
  featured_listings: "Anuncios destacados",
  dismissed_vehicles: "Vehículos descartados",
  advanced_listing_editor: "Editor avanzado de anuncios",
};

const FEATURE_ORDER: EntitlementFeatureKey[] = [
  "vehicles",
  "photos_per_vehicle",
  "videos_per_vehicle",
  "video_upload",
  "ai_requests",
  "ai_generation",
  "users",
  "statistics",
  "featured_listings",
  "dismissed_vehicles",
  "advanced_listing_editor",
];

export const getEntitlementFeatureLabel = (feature: string): string =>
  FEATURE_LABELS[feature] ?? feature.replaceAll("_", " ");

const isBooleanValue = (value: BillingPlanEntitlement["value"]): value is EntitlementBooleanValue =>
  typeof value === "object" && value !== null && "bool" in value;

const isLimitValue = (value: BillingPlanEntitlement["value"]): value is EntitlementLimitValue =>
  typeof value === "object" && value !== null && "limit" in value;

const isUnlimitedValue = (
  value: BillingPlanEntitlement["value"],
): value is EntitlementUnlimitedValue =>
  typeof value === "object" && value !== null && "unlimited" in value;

export const formatCatalogEntitlement = (
  entitlement: BillingPlanEntitlement,
): EntitlementDisplayItem => {
  const label = getEntitlementFeatureLabel(entitlement.feature);

  if (entitlement.value_type === "unlimited" || isUnlimitedValue(entitlement.value)) {
    return {
      feature: entitlement.feature,
      label,
      included: true,
      valueLabel: `${label} ilimitados`,
    };
  }

  if (entitlement.value_type === "boolean" || isBooleanValue(entitlement.value)) {
    const included = isBooleanValue(entitlement.value) ? entitlement.value.bool === true : false;
    return {
      feature: entitlement.feature,
      label,
      included,
      valueLabel: included ? label : null,
    };
  }

  const limit = isLimitValue(entitlement.value) ? entitlement.value.limit : 0;
  if (limit <= 0) {
    return {
      feature: entitlement.feature,
      label,
      included: false,
      valueLabel: null,
    };
  }

  return {
    feature: entitlement.feature,
    label,
    included: true,
    valueLabel: `${limit} ${label.toLowerCase()}`,
  };
};

export const listCatalogEntitlementDisplays = (
  entitlements: BillingPlanEntitlement[] | undefined | null,
): EntitlementDisplayItem[] => {
  if (!entitlements?.length) {
    return [];
  }

  const byFeature = new Map(entitlements.map((item) => [item.feature, item]));
  const knownOrder = FEATURE_ORDER as readonly string[];
  const orderedFeatures = [
    ...FEATURE_ORDER.filter((feature) => byFeature.has(feature)),
    ...entitlements
      .map((item) => item.feature)
      .filter((feature) => !knownOrder.includes(feature)),
  ];

  const seen = new Set<string>();
  const items: EntitlementDisplayItem[] = [];

  for (const feature of orderedFeatures) {
    if (seen.has(feature)) {
      continue;
    }
    seen.add(feature);

    const entitlement = byFeature.get(feature);
    if (!entitlement) {
      continue;
    }

    const display = formatCatalogEntitlement(entitlement);
    if (!display.included || !display.valueLabel) {
      continue;
    }

    items.push(display);
  }

  return items;
};

export const formatUsageVsLimit = (
  entry: BillingMeEntitlementEntry | undefined,
  fallbackUsed?: number,
  fallbackLimit?: number | null,
): string | null => {
  if (entry) {
    if (entry.type === "boolean") {
      return entry.value ? "Incluido" : "No incluido";
    }

    const used = entry.used ?? fallbackUsed ?? 0;

    if (entry.type === "unlimited" || entry.unlimited) {
      return `${used} / Ilimitados`;
    }

    if (entry.limit == null) {
      return `${used}`;
    }

    return `${used} / ${entry.limit}`;
  }

  if (fallbackUsed == null && fallbackLimit == null) {
    return null;
  }

  const used = fallbackUsed ?? 0;
  if (fallbackLimit == null) {
    return `${used}`;
  }

  return `${used} / ${fallbackLimit}`;
};
