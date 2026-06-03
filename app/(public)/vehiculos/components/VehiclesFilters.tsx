
import { filtersService } from "../[[...slug]]/services/filtersService";

import { VehiclesFiltersPanel } from "./VehiclesFiltersPanel";

export const VehiclesFilters = async () => {
  const catalog = await filtersService.getFilters();
  return <VehiclesFiltersPanel catalog={catalog} />;
};
