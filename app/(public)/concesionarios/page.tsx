import { Suspense } from "react";
import { LoadingComponent } from "@/components/ui/loadingComponent";
import { ConcesionariasListingShell } from "./components/ConcesionariasListingShell";
import { ConcesionariasHero } from "./components/ConcesionariasHero";
import { ConcesionariasFiltersPanel } from "./components/ConcesionariasFiltersPanel";
import { ConcesionariasPageContent } from "./components/ConcesionariasPageContent";
import { findAllDealershipsServer } from "./services/findAllDealerships.server";
import { parseDealerSearchParams } from "./utils/dealerSearchParams";

export const metadata = {
  title: "Concesionarios | WiAuto",
  description:
    "Encuentra concesionarios verificados y confiables cerca de ti. Filtra por provincia, calificación y vehículos disponibles.",
};

export default async function ConcesionariasPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search_params = await props.searchParams;
  const filters = parseDealerSearchParams(search_params);
  const listing = await findAllDealershipsServer(filters);

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
                page={listing.page}
                limit={listing.limit}
              />
            </div>
          </div>
        </div>
      </ConcesionariasListingShell>
    </Suspense>
  );
}
