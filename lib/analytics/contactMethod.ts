/**
 * Tipos y utilidades de los eventos de contacto. Sin dependencias de cliente,
 * así los componentes de servidor (footer, /contacto) pueden decidir qué
 * enlaces envolver con seguimiento.
 */

export const CONTACT_METHOD = {
  PHONE: "phone",
  WHATSAPP: "whatsapp",
  EMAIL: "email",
} as const;

export type ContactMethod =
  (typeof CONTACT_METHOD)[keyof typeof CONTACT_METHOD];

export const CONTACT_LOCATION = {
  FOOTER: "footer",
  CONTACTO: "contacto",
  SOPORTE: "soporte",
  VEHICLE_DETAIL: "vehicle_detail",
} as const;

export type ContactLocation =
  (typeof CONTACT_LOCATION)[keyof typeof CONTACT_LOCATION];

export const NEWSLETTER_LOCATION = {
  FOOTER_NEWSLETTER: "footer_newsletter",
} as const;

export type NewsletterLocation =
  (typeof NEWSLETTER_LOCATION)[keyof typeof NEWSLETTER_LOCATION];

const WHATSAPP_HOSTS = new Set([
  "wa.me",
  "api.whatsapp.com",
  "web.whatsapp.com",
  "chat.whatsapp.com",
]);

/** Deduce el canal de contacto de un `href`, o `null` si no es de contacto. */
export const getContactMethodFromHref = (
  href: string | null | undefined,
): ContactMethod | null => {
  const value = href?.trim().toLowerCase();
  if (!value) {
    return null;
  }

  if (value.startsWith("tel:")) {
    return CONTACT_METHOD.PHONE;
  }
  if (value.startsWith("mailto:")) {
    return CONTACT_METHOD.EMAIL;
  }
  if (value.startsWith("whatsapp:")) {
    return CONTACT_METHOD.WHATSAPP;
  }

  try {
    const { hostname } = new URL(value);
    return WHATSAPP_HOSTS.has(hostname.replace(/^www\./, ""))
      ? CONTACT_METHOD.WHATSAPP
      : null;
  } catch {
    return null;
  }
};
