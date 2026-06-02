/** Separa un segmento de path o valor de query en slugs (coma). */
export const splitCommaSlugs = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

/** Une slugs de catálogo en un segmento de path (coma). */
export const joinCommaSlugs = (slugs: string[] | undefined): string | undefined => {
  const filtered = slugs?.map((slug) => slug.trim()).filter((slug) => slug.length > 0);
  if (!filtered || filtered.length === 0) {
    return undefined;
  }
  return filtered.join(",");
};
