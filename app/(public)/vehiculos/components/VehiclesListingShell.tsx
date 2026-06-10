"use client";

import { Suspense, type ReactNode } from "react";

import { VehiclesListingFiltersProvider } from "../hooks/useVehiclesListingFilters";

type VehiclesListingShellProps = {
  children: ReactNode;
};

export const VehiclesListingShell = ({
  children,
}: VehiclesListingShellProps) => (
  <Suspense>
    {" "}
    <VehiclesListingFiltersProvider>{children}</VehiclesListingFiltersProvider>
  </Suspense>
);
