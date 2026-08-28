/**
 * Capa única sobre `window.fbq`.
 *
 * Todos los eventos se envían con un `eventID` propio. Cuando el backend
 * implemente la Conversions API deberá reenviar ese mismo identificador para
 * que Meta deduplique navegador y servidor, por eso cada helper lo devuelve.
 */

type MetaPixelStandardEvent =
  | "PageView"
  | "ViewContent"
  | "Search"
  | "CompleteRegistration"
  | "Lead"
  | "Contact"
  | "AddToWishlist"
  | "Purchase";

declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      params?: Record<string, unknown>,
      options?: { eventID: string },
    ) => void;
  }
}

/** El catálogo es solo España, no hay multi-divisa en la parte pública. */
const CURRENCY = "EUR";

/** `content_type` del catálogo de automoción de Meta. */
const CONTENT_TYPE = "vehicle";

const PENDING_PURCHASE_KEY = "wiauto:meta-pending-purchase";

const createEventId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

/**
 * Devuelve el `eventID` enviado, o `null` si el pixel no está disponible
 * (SSR, bloqueadores de anuncios o falta de `META_PIXEL_ID`).
 */
export const trackMetaEvent = (
  event: MetaPixelStandardEvent,
  params: Record<string, unknown> = {},
): string | null => {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return null;
  }

  const eventId = createEventId();
  window.fbq("track", event, params, { eventID: eventId });
  return eventId;
};

export const trackMetaCustomEvent = (
  event: string,
  params: Record<string, unknown> = {},
): string | null => {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return null;
  }

  const eventId = createEventId();
  window.fbq("trackCustom", event, params, { eventID: eventId });
  return eventId;
};

interface VehicleContentInput {
  id: string;
  name?: string;
  price?: number | null;
  category?: string | null;
}

const buildVehicleContent = ({
  id,
  name,
  price,
  category,
}: VehicleContentInput): Record<string, unknown> => ({
  content_ids: [id],
  content_type: CONTENT_TYPE,
  ...(name ? { content_name: name } : {}),
  ...(category ? { content_category: category } : {}),
  ...(typeof price === "number" && price > 0
    ? { value: price, currency: CURRENCY }
    : {}),
});

/** Ficha de vehículo abierta. */
export const trackMetaViewContent = (vehicle: VehicleContentInput) =>
  trackMetaEvent("ViewContent", buildVehicleContent(vehicle));

/** Búsqueda de vehículos, con el término y los filtros aplicados. */
export const trackMetaSearch = ({
  searchString,
  filters,
}: {
  searchString?: string;
  filters?: object;
}) => {
  const activeFilters = filters
    ? Object.entries(filters)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key]) => key)
        .sort()
    : [];

  return trackMetaEvent("Search", {
    content_type: CONTENT_TYPE,
    ...(searchString ? { search_string: searchString } : {}),
    ...(activeFilters.length > 0
      ? { content_category: activeFilters.join(",") }
      : {}),
  });
};

/** Alta de cuenta completada. `method` distingue email de OAuth. */
export const trackMetaCompleteRegistration = (method: string) =>
  trackMetaEvent("CompleteRegistration", {
    content_name: "Registro de usuario",
    status: true,
    method,
  });

/** Formulario de solicitud de información enviado. */
export const trackMetaLead = ({
  contentName,
  vehicleId,
}: {
  contentName: string;
  vehicleId?: string;
}) =>
  trackMetaEvent("Lead", {
    content_name: contentName,
    ...(vehicleId
      ? { content_ids: [vehicleId], content_type: CONTENT_TYPE }
      : {}),
  });

/** Contacto directo con el vendedor (teléfono o WhatsApp). */
export const trackMetaContact = ({
  channel,
  vehicle,
}: {
  channel: "phone" | "whatsapp";
  vehicle: VehicleContentInput;
}) =>
  trackMetaEvent("Contact", {
    ...buildVehicleContent(vehicle),
    channel,
  });

/** Vehículo guardado en una lista de favoritos. */
export const trackMetaAddToWishlist = (vehicle: VehicleContentInput) =>
  trackMetaEvent("AddToWishlist", buildVehicleContent(vehicle));

export const trackMetaPurchase = ({
  value,
  currency = CURRENCY,
  contentName,
  contentIds,
}: {
  value: number;
  currency?: string;
  contentName?: string;
  contentIds?: string[];
}) =>
  trackMetaEvent("Purchase", {
    value,
    currency,
    content_type: "product",
    ...(contentName ? { content_name: contentName } : {}),
    ...(contentIds?.length ? { content_ids: contentIds } : {}),
  });

interface PendingPurchase {
  value: number;
  currency: string;
  contentName: string;
  contentIds?: string[];
}

/**
 * Stripe redirige fuera del sitio y vuelve solo con `?checkout=success`, sin el
 * importe. Guardamos el detalle antes de salir para poder emitir un `Purchase`
 * con valor real al regresar.
 */
export const rememberPendingMetaPurchase = (purchase: PendingPurchase): void => {
  try {
    sessionStorage.setItem(PENDING_PURCHASE_KEY, JSON.stringify(purchase));
  } catch {
    // sessionStorage puede fallar en modo privado; el Purchase saldrá sin valor.
  }
};

/** Lee y limpia la compra pendiente. Devuelve `null` si no hay ninguna. */
export const consumePendingMetaPurchase = (): PendingPurchase | null => {
  try {
    const raw = sessionStorage.getItem(PENDING_PURCHASE_KEY);
    if (!raw) {
      return null;
    }
    sessionStorage.removeItem(PENDING_PURCHASE_KEY);
    return JSON.parse(raw) as PendingPurchase;
  } catch {
    return null;
  }
};
