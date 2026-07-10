import type { LucideIcon } from "lucide-react";
import { BatteryCharging, CircuitBoard, Unplug } from "lucide-react";

import { PLUG_IN_HYBRID_FUEL_SLUG } from "../vehicleDiscovery.constants";

export const resolveLowEmissionsQuickLinkIcon = (
  href: string,
): LucideIcon | undefined => {
  const normalized_href = href.toLowerCase();

  if (
    normalized_href.includes(`combustible=${PLUG_IN_HYBRID_FUEL_SLUG}`) ||
    normalized_href.includes("enchufable")
  ) {
    return Unplug;
  }

  if (normalized_href.includes("combustible=electrico")) {
    return BatteryCharging;
  }

  if (normalized_href.includes("combustible=hibrido")) {
    return CircuitBoard;
  }

  return undefined;
};
