/**
 * Embudo de publicación: Meta (fbq) + dataLayer (GA4 vía GTM).
 * No sustituye lib/analytics/events.ts (PageView, ViewContent, Lead, etc.).
 */

import { readStoredConsent } from "@/lib/analytics/consent";

export type FunnelEvent =
  | "publicar_click"
  | "publicar_inicio"
  | "sign_up"
  | "login"
  | "publicar_tipo"
  | "publicar_fotos"
  | "publicar_datos"
  | "anuncio_publicado";

const ONCE_EVENTS: FunnelEvent[] = [
  "publicar_inicio",
  "publicar_tipo",
  "publicar_fotos",
  "publicar_datos",
];

const META_CUSTOM: Partial<Record<FunnelEvent, string>> = {
  publicar_click: "PublicarClick",
  publicar_inicio: "PublicarInicio",
  publicar_tipo: "PublicarTipo",
  publicar_fotos: "PublicarFotos",
  publicar_datos: "PublicarDatos",
  anuncio_publicado: "AnuncioPublicado",
};

const VEHICLE_DATA_EVENT_ID_KEY = "wiauto:vehicle_data_event_id";
const PUBLISH_CONTEXT_KEY = "wia_publish_context";

const BLOCKED_PARAM_KEYS = new Set([
  "email",
  "phone",
  "telefono",
  "tel",
  "phone_code",
]);

export interface PublishFunnelContext {
  brand?: string;
  model?: string;
  year?: number;
  vehicleType?: string;
}

export const hasMarketingConsent = (): boolean =>
  readStoredConsent()?.marketing === true;

export const newEventId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const getMetaCookies = (): { fbp?: string; fbc?: string } => {
  if (typeof document === "undefined") {
    return {};
  }

  const read = (name: string) =>
    document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1];

  let fbc = read("_fbc");
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbc && fbclid) {
    fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  return { fbp: read("_fbp"), fbc };
};

export const rememberVehicleDataEventId = (eventId: string): void => {
  try {
    sessionStorage.setItem(VEHICLE_DATA_EVENT_ID_KEY, eventId);
  } catch {
    // modo privado
  }
};

/** Lee el event id de PublicarDatos sin borrarlo. Se limpia en `resetPublishFunnel`. */
export const peekVehicleDataEventId = (): string | undefined => {
  try {
    return sessionStorage.getItem(VEHICLE_DATA_EVENT_ID_KEY) ?? undefined;
  } catch {
    return undefined;
  }
};

const readPublishContext = (): PublishFunnelContext => {
  try {
    const raw = sessionStorage.getItem(PUBLISH_CONTEXT_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as PublishFunnelContext;
  } catch {
    return {};
  }
};

const writePublishContext = (patch: PublishFunnelContext): void => {
  try {
    const next = { ...readPublishContext(), ...patch };
    sessionStorage.setItem(PUBLISH_CONTEXT_KEY, JSON.stringify(next));
  } catch {
    // modo privado
  }
};

export const getPublishFunnelContext = (): PublishFunnelContext =>
  readPublishContext();

export const resetPublishFunnel = (): void => {
  if (typeof sessionStorage === "undefined") {
    return;
  }
  for (const event of ONCE_EVENTS) {
    sessionStorage.removeItem(`wia_${event}`);
  }
  try {
    sessionStorage.removeItem(VEHICLE_DATA_EVENT_ID_KEY);
    sessionStorage.removeItem(PUBLISH_CONTEXT_KEY);
  } catch {
    // ignore
  }
};

const sanitizeParams = (
  params: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> => {
  const clean: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || BLOCKED_PARAM_KEYS.has(key)) {
      continue;
    }

    if (key === "price") {
      const price = typeof value === "number" ? value : Number(value);
      if (Number.isFinite(price)) {
        clean.price = price;
      }
      continue;
    }

    clean[key] = value;
  }

  return clean;
};

const pushDataLayer = (
  event: FunnelEvent,
  eventId: string,
  params: Record<string, string | number | boolean>,
): void => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, event_id: eventId, ...params });
};

const sendMeta = (
  event: FunnelEvent,
  eventId: string,
  params: Record<string, string | number | boolean>,
): void => {
  if (!hasMarketingConsent() || typeof window.fbq !== "function") {
    return;
  }

  const isRegistration = event === "sign_up" && params.new_user === true;
  const metaName = isRegistration ? "CompleteRegistration" : META_CUSTOM[event];

  if (!metaName) {
    return;
  }

  const data: Record<string, unknown> = { ...params };
  if (typeof params.price === "number") {
    data.value = params.price;
    data.currency = "EUR";
  }

  window.fbq(
    isRegistration ? "track" : "trackCustom",
    metaName,
    data,
    { eventID: eventId },
  );
};

/** Envía un evento a Meta (si hay consentimiento) y al dataLayer. Devuelve el event_id usado. */
export const track = (
  event: FunnelEvent,
  params: Record<string, string | number | boolean | undefined> = {},
  eventId: string = newEventId(),
): string => {
  if (typeof window === "undefined") {
    return eventId;
  }

  const safeParams = sanitizeParams(params);

  if (ONCE_EVENTS.includes(event)) {
    const key = `wia_${event}`;
    if (sessionStorage.getItem(key)) {
      return eventId;
    }
    sessionStorage.setItem(key, "1");
  }

  if (event === "publicar_datos") {
    rememberVehicleDataEventId(eventId);
    writePublishContext({
      ...(typeof safeParams.brand === "string" ? { brand: safeParams.brand } : {}),
      ...(typeof safeParams.model === "string" ? { model: safeParams.model } : {}),
      ...(typeof safeParams.year === "number" ? { year: safeParams.year } : {}),
    });
  }

  if (event === "publicar_tipo" && typeof safeParams.vehicle_type === "string") {
    writePublishContext({ vehicleType: safeParams.vehicle_type });
  }

  sendMeta(event, eventId, safeParams);
  pushDataLayer(event, eventId, safeParams);

  return eventId;
};

export type PublicarClickSource = "header" | "home" | "menu" | "otros";

export const trackPublicarClick = (source: PublicarClickSource): void => {
  track("publicar_click", { source });
};

export const isPublishEntryHref = (href: string): boolean => {
  const path = href.split("?")[0]?.split("#")[0] ?? "";
  return path === "/publicar" || path === "/vender-vehiculo";
};
