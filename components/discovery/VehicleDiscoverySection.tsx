import { cn } from "@/lib/utils";
import { heroFacetService } from "@/services/search/heroFacetService";
import {
  buildDefaultQuickLinks,
  buildVehicleDiscoverySections,
} from "./buildVehicleDiscoverySections";
import { DISCOVERY_DEFAULT_TITLE } from "./vehicleDiscovery.constants";
import { VehicleDiscoveryAccordion } from "./VehicleDiscoveryAccordion";
import { VehicleDiscoveryQuickCards } from "./VehicleDiscoveryQuickCards";
import type { VehicleDiscoverySectionProps } from "./types";

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
  quickLinks,
  sections,
  className,
}: VehicleDiscoverySectionProps) => {
  const resolvedQuickLinks = quickLinks ?? buildDefaultQuickLinks();

  let resolvedSections = sections;

  if (!resolvedSections) {
    const [provinces, makes] = await Promise.all([
      heroFacetService.getProvinces({}),
      heroFacetService.getMakes(),
    ]);

    resolvedSections = buildVehicleDiscoverySections(provinces, makes);
  }

  if (resolvedSections.length === 0 && resolvedQuickLinks.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        "w-full rounded-xl bg-muted-foreground/10 p-6",
        className,
      )}
      aria-labelledby="vehicle-discovery-title"
    >
      <h2
        id="vehicle-discovery-title"
        className="mb-6 text-xl font-bold text-foreground"
      >
        {title}
      </h2>

      {resolvedQuickLinks.length > 0 ? (
        <VehicleDiscoveryQuickCards
          quickLinks={resolvedQuickLinks}
          className="mb-6"
        />
      ) : null}

      <VehicleDiscoveryAccordion sections={resolvedSections} />
    </section>
  );
};
