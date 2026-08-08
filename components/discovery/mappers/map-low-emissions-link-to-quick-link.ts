import type { StrapiCard } from "@/interfaces/strapi-components.interface";
import { getStrapiMediaUrl } from "@/lib/strapi-media";

import type { QuickLink } from "../types";
import { resolveLowEmissionsQuickLinkIcon } from "../utils/resolve-low-emissions-quick-link-icon";

export const mapLowEmissionsLinkToQuickLink = (
  link: StrapiCard,
): QuickLink => {
  const href = link.boton?.url?.trim() || "#";

  return {
    label: link.titulo?.trim() || "",
    description: link.descripcion?.trim() || undefined,
    href,
    Icon: resolveLowEmissionsQuickLinkIcon(href),
    imageUrl: getStrapiMediaUrl(link.imagen?.url),
    borderColor: link.colorFondo?.trim() || undefined,
    titleColor: link.colorTexto?.trim() || undefined,
  };
};
