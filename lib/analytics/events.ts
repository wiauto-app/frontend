/**
 * API pública de analítica. Cada función emite el evento equivalente en Meta
 * Pixel y en GA4, de forma que los puntos de instrumentación de la aplicación
 * no tengan que conocer las particularidades de cada plataforma.
 */

import {
  gaAddToWishlist,
  gaContact,
  gaGenerateLead,
  gaNewsletterSignup,
  gaPurchase,
  gaSearch,
  gaSignUp,
  gaViewItem,
} from "./googleAnalytics";
import {
  CONTACT_METHOD,
  getContactMethodFromHref,
  type ContactLocation,
  type ContactMethod,
  type NewsletterLocation,
} from "./contactMethod";
import {
  trackMetaAddToWishlist,
  trackMetaCompleteRegistration,
  trackMetaContact,
  trackMetaLead,
  trackMetaPurchase,
  trackMetaSearch,
  trackMetaViewContent,
} from "./metaPixel";

export interface VehicleAnalyticsItem {
  id: string;
  name?: string;
  price?: number | null;
  category?: string | null;
}

const PENDING_PURCHASE_KEY = "wiauto:pending-purchase";

const createId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

/** Ficha de vehículo abierta. */
export const trackViewContent = (vehicle: VehicleAnalyticsItem): void => {
  trackMetaViewContent(vehicle);
  gaViewItem(vehicle);
};

/** Búsqueda de vehículos. */
export const trackSearch = ({
  searchString,
  filters,
}: {
  searchString?: string;
  filters?: object;
}): void => {
  trackMetaSearch({ searchString, filters });
  gaSearch(searchString);
};

/** Alta de cuenta completada. */
export const trackCompleteRegistration = (method: string): void => {
  trackMetaCompleteRegistration(method);
  gaSignUp(method);
};

/**
 * Formulario de solicitud de información enviado. `leadSource` fija el
 * `lead_source` de GA4; si se omite se usa `contentName`, como hasta ahora.
 */
export const trackLead = ({
  contentName,
  vehicleId,
  leadSource,
}: {
  contentName: string;
  vehicleId?: string;
  leadSource?: string;
}): void => {
  trackMetaLead({ contentName, vehicleId });
  gaGenerateLead(leadSource ?? contentName, vehicleId);
};

/**
 * Contacto directo (teléfono, WhatsApp o email). Meta solo recibe los
 * contactos con vehículo, que son los que alimentan el catálogo.
 */
export const trackContact = ({
  channel,
  vehicle,
  location,
}: {
  channel: ContactMethod;
  vehicle?: VehicleAnalyticsItem;
  location?: ContactLocation;
}): void => {
  if (vehicle && channel !== CONTACT_METHOD.EMAIL) {
    trackMetaContact({ channel, vehicle });
  }
  gaContact(channel, vehicle, location);
};

/** Clic en un enlace `tel:`, `mailto:` o de WhatsApp. Ignora el resto. */
export const trackContactHref = (
  href: string | null | undefined,
  location: ContactLocation,
): void => {
  const channel = getContactMethodFromHref(href);
  if (!channel) {
    return;
  }
  trackContact({ channel, location });
};

/** Alta en el newsletter completada. */
export const trackNewsletterSignup = (location: NewsletterLocation): void => {
  gaNewsletterSignup(location);
};

/** Vehículo guardado en favoritos. */
export const trackAddToWishlist = (vehicle: VehicleAnalyticsItem): void => {
  trackMetaAddToWishlist(vehicle);
  gaAddToWishlist(vehicle);
};

interface PendingPurchase {
  transactionId: string;
  value: number;
  currency: string;
  contentName: string;
  contentIds?: string[];
}

/**
 * Stripe redirige fuera del sitio y vuelve solo con `?checkout=success`, sin el
 * importe. Guardamos el detalle antes de salir para poder emitir la compra con
 * valor real al regresar. El `transactionId` permite que GA4 descarte
 * duplicados si el evento llegara dos veces.
 */
export const rememberPendingPurchase = (
  purchase: Omit<PendingPurchase, "transactionId">,
): void => {
  try {
    sessionStorage.setItem(
      PENDING_PURCHASE_KEY,
      JSON.stringify({ ...purchase, transactionId: createId() }),
    );
  } catch {
    // sessionStorage puede fallar en modo privado; la compra saldrá sin valor.
  }
};

/** Emite la compra guardada antes de ir a Stripe, si la hay. */
export const trackPendingPurchase = (): void => {
  let pending: PendingPurchase | null = null;

  try {
    const raw = sessionStorage.getItem(PENDING_PURCHASE_KEY);
    if (!raw) {
      return;
    }
    sessionStorage.removeItem(PENDING_PURCHASE_KEY);
    pending = JSON.parse(raw) as PendingPurchase;
  } catch {
    return;
  }

  trackMetaPurchase(pending);
  gaPurchase(pending);
};
