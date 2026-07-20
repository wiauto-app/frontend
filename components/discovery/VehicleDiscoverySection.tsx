import { cn } from "@/lib/utils";
import { provincesCatalogService } from "@/services/locations/provincesCatalogService";
import { heroFacetService } from "@/services/search/heroFacetService";
import { buildVehicleDiscoverySections } from "./buildVehicleDiscoverySections";
import {
  DISCOVERY_DEFAULT_TITLE,
  DISCOVERY_PROVINCES_LIMIT,
} from "./vehicleDiscovery.constants";
import { VehicleDiscoveryAccordion } from "./VehicleDiscoveryAccordion";
import { VehicleDiscoveryQuickCards } from "./VehicleDiscoveryQuickCards";
import type { VehicleDiscoverySectionProps } from "./types";
import { FaLeaf } from "react-icons/fa";
import Image from "next/image";

const DEFAULT_DESCRIPTION =
  "Explora las opciones más eficientes para moverte mejor y cuidar del planeta";

const renderHighlightedTitle = (title: string) => {
  const highlight = "bajas emisiones";
  const index = title.toLowerCase().indexOf(highlight);

  if (index === -1) {
    return title;
  }

  return (
    <>
      {title.slice(0, index)}
      <span className="text-nature">{title.slice(index, index + highlight.length)}</span>
      {title.slice(index + highlight.length)}
    </>
  );
};

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
    <section
      className={cn(className, "flex flex-col space-y-4")}
      aria-labelledby="vehicle-discovery-title"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="gap-5 flex flex-col justify-center items-center lg:items-start">
          <h2
            id="vehicle-discovery-title"
            className="text-2xl text-center lg:text-left lg:text-4xl font-bold text-foreground "
          >
            <span className="flex flex-wrap items-center gap-2">
              {renderHighlightedTitle(title)}
              <FaLeaf className="w-4 h-4 text-nature" aria-hidden />
            </span>
          </h2>
          <p className="text-sm text-center lg:text-left text-muted-foreground">{description}</p>
        </div>
        {imageUrl ? (
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ) : (
          <div />
        )}
      </div>

      {quickLinks && quickLinks.length > 0 ? (
        <VehicleDiscoveryQuickCards
          quickLinks={quickLinks}
          className=""
        />
      ) : null}

      <VehicleDiscoveryAccordion sections={resolvedSections} />
    </section>
  );
};
