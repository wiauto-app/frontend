"use client";

import { Suspense, type ReactNode } from "react";
import { DealersListingFiltersProvider } from "../hooks/useDealersListingFilters";

type ConcesionariasListingShellProps = {
  children: ReactNode;
};

export const ConcesionariasListingShell = ({
  children,
}: ConcesionariasListingShellProps) => (
  <Suspense>
    <DealersListingFiltersProvider>{children}</DealersListingFiltersProvider>
  </Suspense>
);
