import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ActiveFilters } from "@/app/(public)/vehiculos/components/activeFilters";
import { VehiclesFilters } from "@/app/(public)/vehiculos/components/VehiclesFilters";
import { VehiclesPageContent } from "@/app/(public)/vehiculos/components/VehiclesPageContent";
import { findAllVehicles } from "@/app/(public)/vehiculos/[[...slug]]/services/findAllVehicles.server";
import { toUrlSearchParams } from "@/app/(public)/vehiculos/[[...slug]]/utils/toUrlSearchParams";
import { activeFiltersService } from "@/app/(public)/vehiculos/services/activeFiltersService";
import { LoadingComponent } from "@/components/ui/loadingComponent";
import { buildDealershipDetailSeo } from "@/lib/seo/build-dealership-detail-seo";
import { JsonLdScript } from "@/lib/seo/json-ld-script";

import { DealerProfileHero } from "./components/DealerProfileHero";
import { DealerProfileSidebar } from "./components/DealerProfileSidebar";
import { DealerQuickStatsBar } from "./components/DealerQuickStatsBar";
import { DealerReviewsSection } from "./components/DealerReviewsSection";
import { DealerVehiclesSection } from "./components/DealerVehiclesSection";
import { DealershipVehiclesListingShell } from "./components/DealershipVehiclesListingShell";
import {
  getDealershipDetailBySlug,
  getDealershipReviewsByDealershipId,
} from "./services/getDealerBySlug.server";
import { mapDealershipToDealerProfile } from "./utils/mapDealershipToDealerProfile";
import { parseDealershipVehicleFilters } from "./utils/parseDealershipVehicleFilters";

type DealerProfilePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: DealerProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const dealership = await getDealershipDetailBySlug(slug);

  if (!dealership) {
    return { title: "Concesionario no encontrado | WiAuto" };
  }

  return buildDealershipDetailSeo({ dealership }).metadata;
}

export default async function DealerProfilePage({
  params,
  searchParams,
}: DealerProfilePageProps) {
  const { slug } = await params;
  const resolved_search_params = await searchParams;

  const dealership = await getDealershipDetailBySlug(slug);
  if (!dealership) {
    notFound();
  }

  const url_filters = parseDealershipVehicleFilters(
    toUrlSearchParams(resolved_search_params),
  );
  const vehicle_filters = {
    ...url_filters,
    dealership_ids: [dealership.id],
  };

  const [listing, active_filters, reviews_data] = await Promise.all([
    findAllVehicles(vehicle_filters),
    activeFiltersService.getActiveFilters(vehicle_filters),
    getDealershipReviewsByDealershipId(dealership.id),
  ]);

  const dealer = mapDealershipToDealerProfile({
    dealership,
    reviews: reviews_data.reviews,
    reviewTotal: reviews_data.total,
    publishedVehicles: listing.total,
  });

  const { breadcrumbItems, jsonLdGraph } = buildDealershipDetailSeo({
    dealership,
    reviewCount: reviews_data.total,
    rating: dealership.rating ?? 0,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <JsonLdScript data={jsonLdGraph} />
      <DealerProfileHero dealer={dealer} breadcrumbItems={breadcrumbItems} />

      <div className="container-custom mx-auto px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <aside className="lg:col-span-4 xl:col-span-3">
            <DealerProfileSidebar dealer={dealer} />
          </aside>

          <main className="lg:col-span-8 xl:col-span-9">
            <div className="pt-5 lg:pt-6">
              <DealerQuickStatsBar stats={dealer.quickStats} />

              <DealershipVehiclesListingShell slug={slug}>
                <div className="mb-6 min-w-0">
                  <div className="mb-4">
                    <ActiveFilters activeFilters={active_filters} />
                  </div>
                  <DealerVehiclesSection
                    total={listing.total}
                    filtersNode={
                      <Suspense
                        fallback={
                          <div className="h-96 animate-pulse rounded-none bg-slate-100" />
                        }
                      >
                        <VehiclesFilters />
                      </Suspense>
                    }
                  />
                  <Suspense fallback={<LoadingComponent />}>
                    <VehiclesPageContent
                      vehicles={listing.vehicles}
                      total={listing.total}
                       
                    />
                  </Suspense>
                </div>
              </DealershipVehiclesListingShell>

              <DealerReviewsSection dealer={dealer} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
