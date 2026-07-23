import type { Metadata } from "next";
import { Suspense } from "react";

import { ActiveFilters } from "../components/activeFilters";
import { VehiclesPageContent } from "../components/VehiclesPageContent";
import { VehiclesToolbar } from "../components/VehiclesToolbar";
import { VehiclesFilters } from "../components/VehiclesFilters";
import { VehiclesListingShell } from "../components/VehiclesListingShell";
import { findAllVehicles } from "./services/findAllVehicles.server";
import { toUrlSearchParams } from "./utils/toUrlSearchParams";
import {
  buildCanonicalListingHref,
  parseVehicleListingUrl,
} from "@/lib/vehicles/listing-url";
import { activeFiltersService } from "../services/activeFiltersService";
import { FRONTEND_URL } from "@/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { FiltersTitle } from "../components/filtersTitle";
import { FiltersLoading } from "../components/filtersLoading";
import { MapButton } from "../components/mapButton";
import { SHOW_MAP_KEY } from "./constants/filterKeys.constants";
import { cn } from "@/lib/utils";
import { VehiclesMap } from "../components/vehiclesMap";

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const search_params = await props.searchParams;
  const slug_segments = slug ?? [];
  const filters = parseVehicleListingUrl(
    slug_segments,
    toUrlSearchParams(search_params),
  );

  const [listing, activeFilters] = await Promise.all([
    findAllVehicles(filters),
    activeFiltersService.getActiveFilters(filters),
  ]);

  const canonical_path = buildCanonicalListingHref(filters);

  return {
    title: `${listing.total} resultados de ${activeFilters.title}`,
    description: `Encuentra ${listing.total} vehículos en ${activeFilters.title} en Wiauto.com`,
    openGraph: {
      title: `${listing.total} resultados de ${activeFilters.title}`,
      description: `Encuentra ${listing.total} vehículos en ${activeFilters.title} en Wiauto.com`,
      images: [
        {
          url: `${FRONTEND_URL}/images/og-image.png`,
        },
      ],
    },
    alternates: {
      canonical: `${FRONTEND_URL}${canonical_path}`,
    },
  };
}

export default async function VehiclesListingPage(props: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await props.params;
  const search_params = await props.searchParams;
  const slug_segments = slug ?? [];
  const filters = parseVehicleListingUrl(
    slug_segments,
    toUrlSearchParams(search_params),
  );

  const [listing, activeFilters] = await Promise.all([
    findAllVehicles(filters),
    activeFiltersService.getActiveFilters(filters),
  ]);

  const isMapVisible = search_params[SHOW_MAP_KEY] === "true";
  return (
    <VehiclesListingShell>
      <div>
        <VehiclesToolbar
          filtersNode={
            <Suspense
              fallback={
                <div className="flex items-center">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-5  w-28" />
                  ))}
                </div>
              }
            >
              <VehiclesFilters />
            </Suspense>
          }
        />
        <div
          className={cn(
            "mx-auto flex  gap-5",
            !isMapVisible ? "container-custom" : "container-custom-full",
          )}
        >
          <Suspense fallback={<FiltersLoading />}>
            <VehiclesFilters />
          </Suspense>

          <div className="flex-1 py-2 mx-auto min-w-4xl max-w-4xl">
            <div className="flex  items-center justify-between">
              <FiltersTitle title={activeFilters.title} />
              <MapButton />
            </div>
            <ActiveFilters activeFilters={activeFilters} />
            <VehiclesPageContent
              vehicles={listing.vehicles}
              total={listing.total}
            />
          </div>
          <VehiclesMap
            vehicles={listing.vehicles}
            total={listing.total}
            isMapVisible={isMapVisible}
          />
        </div>
      </div>
    </VehiclesListingShell>
  );
}
