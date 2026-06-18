import { Suspense } from "react";
import { LoadingComponent } from "@/components/ui/loadingComponent";
import { ConcesionariasListingShell } from "../components/ConcesionariasListingShell";
import { ConcesionariasHero } from "../components/ConcesionariasHero";
import { ConcesionariasFiltersPanel } from "../components/ConcesionariasFiltersPanel";
import { ConcesionariasPageContent } from "../components/ConcesionariasPageContent";
import { findAllDealers } from "./services/findAllDealers.server";
import { toUrlSearchParams } from "../utils/toUrlSearchParams";
import { parseDealersUrl } from "../utils/dealersUrl";

export const metadata = {
  title: "Concesionarios | WiAuto",
  description:
    "Encuentra concesionarios verificados y confiables cerca de ti. Filtra por ubicación, tipo, servicios y calificación.",
};

export default async function ConcesionariasPage(props: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await props.params;
  const search_params = await props.searchParams;
  const slug_segments = slug ?? [];

  const filters = parseDealersUrl(
    slug_segments,
    toUrlSearchParams(search_params),
  );

  const listing = await findAllDealers(filters);

  return (
    <Suspense fallback={<LoadingComponent />}>
      <ConcesionariasListingShell>
        <div>
          <ConcesionariasHero />

          <div className="container-custom mx-auto flex min-h-screen flex-col gap-5 lg:flex-row">
            <div className="hidden w-72 shrink-0 lg:block">
              <Suspense
                fallback={
                  <div className="h-96 animate-pulse rounded-none bg-slate-100" />
                }
              >
                <ConcesionariasFiltersPanel />
              </Suspense>
            </div>

            <div className="min-w-0 flex-1">
              <ConcesionariasPageContent
                dealers={listing.dealers}
                total={listing.total}
              />
            </div>
          </div>
        </div>
      </ConcesionariasListingShell>
    </Suspense>
  );
}
