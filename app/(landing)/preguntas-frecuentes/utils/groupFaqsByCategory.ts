import type { StrapiFaq } from "@/interfaces/strapi-components.interface";

export interface FaqCategoryGroup {
  categoria: string;
  iconName: string | null;
  items: StrapiFaq[];
}

const UNCATEGORIZED = "Otras preguntas";

export const groupFaqsByCategory = (
  faqs: StrapiFaq[] | null | undefined,
): FaqCategoryGroup[] => {
  if (!faqs?.length) {
    return [];
  }

  const order: string[] = [];
  const map = new Map<string, FaqCategoryGroup>();

  for (const faq of faqs) {
    if (!faq.pregunta?.trim()) {
      continue;
    }

    const categoria = faq.categoria?.trim() || UNCATEGORIZED;

    const existing = map.get(categoria);
    if (existing) {
      existing.items.push(faq);
      if (!existing.iconName && faq.iconName) {
        existing.iconName = faq.iconName;
      }
      continue;
    }

    order.push(categoria);
    map.set(categoria, {
      categoria,
      iconName: faq.iconName,
      items: [faq],
    });
  }

  return order.map((key) => map.get(key)!);
};
