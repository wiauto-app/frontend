import { Suspense } from "react";

import { filtersService } from "../[[...slug]]/services/filtersService";

import { VehiclesFiltersPanel } from "./VehiclesFiltersPanel";

export const VehiclesFilters = async () => {
  const catalog = await filtersService.getFilters();
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-none bg-slate-100" />}>
      <VehiclesFiltersPanel catalog={catalog} />
    </Suspense>
  );
};
