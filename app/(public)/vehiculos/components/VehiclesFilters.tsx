import { filtersService } from "../[[...slug]]/services/filtersService";

import { VehiclesFiltersPanel } from "./VehiclesFiltersPanel";
import { Suspense } from "react";
export const VehiclesFilters = async () => {
  const catalog = await filtersService.getFilters();
  return (
    <Suspense>
      <VehiclesFiltersPanel catalog={catalog} />
    </Suspense>
  );
};
