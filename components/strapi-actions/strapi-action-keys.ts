export const STRAPI_ACTION_KEYS = {
  SEGUROS_FORM: "seguros_form",
} as const;

export type StrapiActionKey =
  (typeof STRAPI_ACTION_KEYS)[keyof typeof STRAPI_ACTION_KEYS];

export const isStrapiActionKey = (
  value: string | null | undefined,
): value is StrapiActionKey =>
  Boolean(
    value && Object.values(STRAPI_ACTION_KEYS).includes(value as StrapiActionKey),
  );
