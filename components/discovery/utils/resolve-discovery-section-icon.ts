import type { LucideIcon } from "lucide-react";
import { MapPinIcon, Settings2, Tag } from "lucide-react";

export const resolveDiscoverySectionIcon = (
  sectionId: string,
): LucideIcon | undefined => {
  switch (sectionId) {
    case "provinces":
      return MapPinIcon;
    case "makes":
      return Tag;
    case "more-filters":
      return Settings2;
    default:
      return undefined;
  }
};
