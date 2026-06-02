/** Une listas de slugs de catálogo sin duplicados (orden de primera aparición). */
export const mergeCatalogSlugLists = (
  ...lists: (string[] | undefined)[]
): string[] | undefined => {
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const list of lists) {
    for (const raw of list ?? []) {
      const slug = raw.trim();
      if (!slug || seen.has(slug)) {
        continue;
      }
      seen.add(slug);
      merged.push(slug);
    }
  }

  return merged.length > 0 ? merged : undefined;
};
