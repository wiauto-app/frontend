import type { HomeLowEmissionsLink } from "@/components/home/types/home-page.types";
import type { QuickLink } from "../types";
import { resolveLowEmissionsQuickLinkIcon } from "../utils/resolve-low-emissions-quick-link-icon";

export const mapLowEmissionsLinkToQuickLink = (
  link: HomeLowEmissionsLink,
): QuickLink => ({
  label: link.title,
  description: link.description,
  href: link.href,
  Icon: resolveLowEmissionsQuickLinkIcon(link.href),
  imageUrl: link.image_url,
  borderColor: link.border_color || undefined,
  titleColor: link.title_color || undefined,
});
