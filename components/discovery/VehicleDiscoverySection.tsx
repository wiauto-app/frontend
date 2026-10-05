import { cn } from "@/lib/utils";
import { provincesCatalogService } from "@/services/locations/provincesCatalogService";
import { heroFacetService } from "@/services/search/heroFacetService";

import { buildVehicleDiscoverySections } from "./buildVehicleDiscoverySections";
import {
  DISCOVERY_DEFAULT_TITLE,
  DISCOVERY_PROVINCES_LIMIT,
} from "./vehicleDiscovery.constants";
import { VehicleDiscoveryMotionContent } from "./VehicleDiscoveryMotionContent";
import type { VehicleDiscoverySectionProps } from "./types";

const DEFAULT_DESCRIPTION =
  "Explora las opciones más eficientes para moverte mejor y cuidar del planeta";

export const VehicleDiscoverySectionSkeleton = () => (
  <section
    className="w-full animate-pulse rounded-xl bg-muted-foreground/10 p-6"
    aria-hidden
  >
    <div className="mb-6 h-7 w-2/3 rounded bg-muted" />
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="h-20 rounded-xl bg-white" />
      <div className="h-20 rounded-xl bg-white" />
      <div className="h-20 rounded-xl bg-white" />
    </div>
    <div className="h-48 rounded-xl bg-white" />
  </section>
);

export const VehicleDiscoverySection = async ({
  title = DISCOVERY_DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  imageUrl,
  quickLinks,
  sections,
  className,
}: VehicleDiscoverySectionProps) => {
  let resolvedSections = sections;

  if (!resolvedSections) {
    const [provincesPage, makes] = await Promise.all([
      provincesCatalogService.findAll({
        page: 1,
        limit: DISCOVERY_PROVINCES_LIMIT,
        order_by: "name",
        order_direction: "ASC",
      }),
      heroFacetService.getMakes(),
    ]);

    resolvedSections = buildVehicleDiscoverySections(provincesPage.data, makes);
  }

  if (resolvedSections.length === 0 && quickLinks?.length === 0) {
    return null;
  }

  return (
    <VehicleDiscoveryMotionContent
      className={cn(className)}
      title={title}
      description={description}
      imageUrl={imageUrl}
      quickLinks={quickLinks}
      sections={resolvedSections}
    />
  );
};
