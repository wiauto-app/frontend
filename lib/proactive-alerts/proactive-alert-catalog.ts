export const PROACTIVE_ALERT_GROUP = {
  PRICE_MARKET: "price_market",
  VISIBILITY: "visibility",
  LEADS: "leads",
  FEATURED: "featured",
  SUMMARY: "summary",
} as const;

export type ProactiveAlertGroup =
  (typeof PROACTIVE_ALERT_GROUP)[keyof typeof PROACTIVE_ALERT_GROUP];

export interface ProactiveAlertCatalogItem {
  type: string;
  label: string;
  description: string;
  group: ProactiveAlertGroup;
  cooldown_days: number | null;
}

export const PROACTIVE_ALERT_GROUP_LABELS: Record<ProactiveAlertGroup, string> =
  {
    price_market: "Precio y mercado",
    visibility: "Visibilidad",
    leads: "Leads",
    featured: "Destacados",
    summary: "Resumen",
  };

/** Catálogo fase 1 (alineado con el backend planificado). */
export const PROACTIVE_ALERT_CATALOG: ProactiveAlertCatalogItem[] = [
  {
    type: "stale_low_views",
    label: "Pocas visitas tras publicar",
    description:
      "Tu anuncio lleva tiempo publicado con visitas por debajo de tu segmento y te sugerimos un precio más competitivo.",
    group: PROACTIVE_ALERT_GROUP.VISIBILITY,
    cooldown_days: 7,
  },
  {
    type: "price_above_market",
    label: "Precio por encima del mercado",
    description:
      "El diagnóstico detecta un precio alto o muy alto respecto a anuncios similares.",
    group: PROACTIVE_ALERT_GROUP.PRICE_MARKET,
    cooldown_days: 14,
  },
  {
    type: "matching_buyer_search",
    label: "Comprador buscando tu modelo",
    description:
      "Se ha creado una búsqueda guardada que encaja con tu vehículo.",
    group: PROACTIVE_ALERT_GROUP.LEADS,
    cooldown_days: 1,
  },
  {
    type: "cheaper_competitor",
    label: "Competidor más barato",
    description:
      "Se ha publicado un anuncio del mismo modelo y año similar a un precio inferior.",
    group: PROACTIVE_ALERT_GROUP.PRICE_MARKET,
    cooldown_days: 3,
  },
  {
    type: "hot_lead_unanswered",
    label: "Lead muy interesado sin respuesta",
    description:
      "Tienes un contacto muy interesado sin respuesta tuya en las últimas horas.",
    group: PROACTIVE_ALERT_GROUP.LEADS,
    cooldown_days: null,
  },
  {
    type: "leads_pending_reply",
    label: "Contactos pendientes de respuesta",
    description: "Resumen diario de leads con más de 24 h sin respuesta.",
    group: PROACTIVE_ALERT_GROUP.LEADS,
    cooldown_days: null,
  },
  {
    type: "views_no_leads",
    label: "Visitas sin contactos",
    description:
      "Tu anuncio recibe visitas pero no genera leads; revisa precio o fotos.",
    group: PROACTIVE_ALERT_GROUP.VISIBILITY,
    cooldown_days: 14,
  },
  {
    type: "views_drop",
    label: "Caída de visitas",
    description:
      "Las visitas de la semana han bajado de forma notable respecto a la anterior.",
    group: PROACTIVE_ALERT_GROUP.VISIBILITY,
    cooldown_days: 7,
  },
  {
    type: "listing_health_low",
    label: "Salud del anuncio baja",
    description:
      "El diagnóstico marca problemas claros en tu ficha (fotos, datos, etc.).",
    group: PROACTIVE_ALERT_GROUP.VISIBILITY,
    cooldown_days: 14,
  },
  {
    type: "featured_recommended",
    label: "Destacar recomendado",
    description:
      "El informe recomienda destacar el anuncio y tu plan lo permite.",
    group: PROACTIVE_ALERT_GROUP.FEATURED,
    cooldown_days: 14,
  },
  {
    type: "featured_expiring",
    label: "Destacado a punto de caducar",
    description: "Tu periodo de destacado termina en las próximas 24 horas.",
    group: PROACTIVE_ALERT_GROUP.FEATURED,
    cooldown_days: null,
  },
  {
    type: "weekly_summary",
    label: "Resumen semanal",
    description:
      "Cada lunes, un resumen de visitas, contactos y leads muy interesados.",
    group: PROACTIVE_ALERT_GROUP.SUMMARY,
    cooldown_days: null,
  },
];

export const PROACTIVE_ALERT_GROUP_ORDER: ProactiveAlertGroup[] = [
  PROACTIVE_ALERT_GROUP.PRICE_MARKET,
  PROACTIVE_ALERT_GROUP.VISIBILITY,
  PROACTIVE_ALERT_GROUP.LEADS,
  PROACTIVE_ALERT_GROUP.FEATURED,
  PROACTIVE_ALERT_GROUP.SUMMARY,
];

export const defaultEnabledProactiveAlertTypes = (): string[] =>
  PROACTIVE_ALERT_CATALOG.map((item) => item.type);
