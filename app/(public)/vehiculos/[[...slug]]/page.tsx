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
import { LoadingComponent } from "@/components/ui/loadingComponent";
import { FRONTEND_URL } from "@/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { FiltersTitle } from "./filtersTitle";

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

  return (
    <Suspense fallback={<LoadingComponent />}>
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
          <div className="container-custom mx-auto flex min-h-screen gap-5">
            <div className="hidden lg:block w-72 shrink-0">
              <Suspense
                fallback={
                  <div className="h-96 animate-pulse rounded-none bg-slate-100" />
                }
              >
                <VehiclesFilters />
              </Suspense>
            </div>
            <div className="min-w-0 flex-1  px-4 py-6 sm:px-6 flex flex-col gap-2">
              <FiltersTitle title={activeFilters.title} />
              <ActiveFilters activeFilters={activeFilters} />
              <VehiclesPageContent
                vehicles={listing.vehicles}
                total={listing.total}
              />
            </div>
          </div>
        </div>
      </VehiclesListingShell>
    </Suspense>
  );
}
