"use client";

import { Suspense, type ReactNode } from "react";

import { DealershipVehiclesFiltersProvider } from "../hooks/useDealershipVehiclesListingFilters";

type DealershipVehiclesListingShellProps = {
  slug: string;
  children: ReactNode;
};

export const DealershipVehiclesListingShell = ({
  slug,
  children,
}: DealershipVehiclesListingShellProps) => (
  <Suspense>
    <DealershipVehiclesFiltersProvider slug={slug}>
      {children}
    </DealershipVehiclesFiltersProvider>
  </Suspense>
);
