import { activeFiltersService } from "../../services/activeFiltersService";

export { activeFiltersService };

/** @deprecated Usa `activeFiltersService.getActiveFilters` */
export const findActiveFilters = activeFiltersService.getActiveFilters.bind(
  activeFiltersService,
);
