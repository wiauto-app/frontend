import type { Metadata } from "next";
import { Suspense } from "react";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const search_params = await props.searchParams;
  const filters = parseVehicleListingUrl(
    slug ?? [],
    toUrlSearchParams(search_params),
  );
  const canonical_path = buildCanonicalListingHref(filters);

  return {
    alternates: {
      canonical: `${SITE_URL}${canonical_path}`,
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

  const listing = await findAllVehicles(filters);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB]">
          <div className="text-center">
            <div className="inline-block size-8 animate-spin rounded-full border-4 border-solid border-[#0061F2] border-r-transparent" />
            <p className="mt-4 text-slate-500">Cargando vehículos...</p>
          </div>
        </div>
      }
    >
      <VehiclesListingShell>
        <div>
          <VehiclesToolbar />
          <div className="container mx-auto flex min-h-screen gap-5">
            <div className="w-72 shrink-0">
              <VehiclesFilters />
            </div>
            <div className="min-w-0 flex-1">
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
