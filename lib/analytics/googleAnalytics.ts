/**
 * Capa única sobre GA4.
 *
 * Usa `sendGAEvent` de `@next/third-parties`, que empuja al `dataLayer` que ya
 * inicializa el componente `GoogleAnalytics` del layout raíz. Los nombres de
 * evento son los recomendados por GA4, que no coinciden con los de Meta:
 * `ViewContent` es `view_item`, `CompleteRegistration` es `sign_up`, etc.
 */

import { sendGAEvent } from "@next/third-parties/google";

const CURRENCY = "EUR";

const sendEvent = (event: string, params: Record<string, unknown> = {}): void => {
  if (typeof window === "undefined") {
    return;
  }
  sendGAEvent("event", event, params);
};

interface VehicleItemInput {
  id: string;
  name?: string;
  price?: number | null;
  category?: string | null;
}

const buildItems = ({ id, name, price, category }: VehicleItemInput) => [
  {
    item_id: id,
    ...(name ? { item_name: name } : {}),
    ...(category ? { item_brand: category } : {}),
    ...(typeof price === "number" && price > 0 ? { price } : {}),
    quantity: 1,
  },
];

const buildValue = (price?: number | null) =>
  typeof price === "number" && price > 0
    ? { value: price, currency: CURRENCY }
    : {};

export const gaViewItem = (vehicle: VehicleItemInput): void =>
  sendEvent("view_item", {
    ...buildValue(vehicle.price),
    items: buildItems(vehicle),
  });

export const gaSearch = (searchTerm?: string): void =>
  sendEvent("search", { search_term: searchTerm ?? "" });

export const gaSignUp = (method: string): void =>
  sendEvent("sign_up", { method });

export const gaGenerateLead = (leadSource: string, vehicleId?: string): void =>
  sendEvent("generate_lead", {
    lead_source: leadSource,
    ...(vehicleId ? { items: [{ item_id: vehicleId, quantity: 1 }] } : {}),
  });

/** GA4 no tiene evento estándar de contacto; se envía como personalizado. */
export const gaContact = (
  channel: "phone" | "whatsapp",
  vehicle: VehicleItemInput,
): void =>
  sendEvent("contact", {
    method: channel,
    items: buildItems(vehicle),
  });

export const gaAddToWishlist = (vehicle: VehicleItemInput): void =>
  sendEvent("add_to_wishlist", {
    ...buildValue(vehicle.price),
    items: buildItems(vehicle),
  });

export const gaPurchase = ({
  transactionId,
  value,
  currency,
  contentName,
  contentIds,
}: {
  transactionId: string;
  value: number;
  currency: string;
  contentName?: string;
  contentIds?: string[];
}): void =>
  sendEvent("purchase", {
    transaction_id: transactionId,
    value,
    currency,
    items: (contentIds?.length ? contentIds : [transactionId]).map((id) => ({
      item_id: id,
      ...(contentName ? { item_name: contentName } : {}),
      price: value,
      quantity: 1,
    })),
  });
