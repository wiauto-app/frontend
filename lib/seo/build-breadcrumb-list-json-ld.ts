import { absoluteUrl } from "./absolute-url";
import type { BreadcrumbItem } from "./breadcrumb.types";

export const buildBreadcrumbListJsonLd = (items: BreadcrumbItem[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    ...(item.href ? { item: absoluteUrl(item.href) } : {}),
  })),
});
