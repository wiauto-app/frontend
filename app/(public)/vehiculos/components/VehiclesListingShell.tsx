"use client";

import type { ReactNode } from "react";

import { VehiclesListingFiltersProvider } from "../hooks/useVehiclesListingFilters";

type VehiclesListingShellProps = {
  children: ReactNode;
};

export const VehiclesListingShell = ({ children }: VehiclesListingShellProps) => (
  <VehiclesListingFiltersProvider>{children}</VehiclesListingFiltersProvider>
);
