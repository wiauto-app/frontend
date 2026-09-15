import { HeroSearchFiltersProvider } from "@/components/home/HeroSearchFiltersContext";
import { VehiclesToolbar } from "../components/VehiclesToolbar";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { VehiclesListingShell } from "../components/VehiclesListingShell";
import { SaveSearchButton } from "../components/SaveSearchButton";
import { BuyAssistantBannerCard } from "../components/buyAssistantBannerCard";
import { FiltersLoading } from "../components/filtersLoading";
import { ListingContainer } from "../components/listingContainer";
const VehiclesFilters = dynamic(() =>
  import("../components/VehiclesFilters").then((mod) => mod.VehiclesFilters),
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <VehiclesListingShell>
      <HeroSearchFiltersProvider>
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
        <ListingContainer>
          <aside className="hidden 2xl:w-82 w-64 shrink-0 flex-col gap-2 lg:flex">
            <Suspense fallback={<FiltersLoading />}>
              <SaveSearchButton />
              <BuyAssistantBannerCard />

              <VehiclesFilters />
            </Suspense>
          </aside>
          <div className="relative w-full">
            {children}
          </div>
        </ListingContainer>
      </HeroSearchFiltersProvider>
    </VehiclesListingShell>
  );
}
