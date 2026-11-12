"use client";

import { Suspense, type ReactNode } from "react";

import { DealershipVehiclesFiltersProvider } from "../hooks/useDealershipVehiclesListingFilters";

type DealershipVehiclesListingShellProps = {
  slug: string;
  dealershipId: string;
  children: ReactNode;
};

export const DealershipVehiclesListingShell = ({
  slug,
  dealershipId,
  children,
}: DealershipVehiclesListingShellProps) => (
  <Suspense>
    <DealershipVehiclesFiltersProvider slug={slug} dealershipId={dealershipId}>
      {children}
    </DealershipVehiclesFiltersProvider>
  </Suspense>
);
