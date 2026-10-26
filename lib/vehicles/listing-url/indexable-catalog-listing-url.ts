import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

import { buildVehicleListingUrl } from "./build-listing-url";
import { resolveListingIndexability } from "./resolve-listing-indexability";

/** @deprecated Usar resolveListingIndexability sobre params parseados. */
export const isIndexableCatalogSlugPath = (segments: string[]): boolean => {
  if (segments.length === 0) {
    return true;
  }
  return segments.every((segment) =>
    /^(marca-|modelo-|provincia-|tipo-|estado-|combustible-|comunidad-)/.test(
      decodeURIComponent(segment),
    ),
  );
};

type IndexableCatalogListingPathParams = Pick<
  FindAllVehiclesParams,
  | "type_slug"
  | "condition"
  | "makes_slugs"
  | "models_slugs"
  | "provinces_slugs"
  | "comunities_slugs"
  | "fuel_type_slugs"
>;

/** @deprecated Usar buildVehicleListingHref + resolveListingIndexability. */
export const buildIndexableCatalogListingPath = (
  params: IndexableCatalogListingPathParams,
): string | null => {
  const { pathname } = buildVehicleListingUrl({
    page: 1,
    limit: 30,
    order_by: "created_at",
    order_direction: "DESC",
    ...params,
  });
  const { isIndexable } = resolveListingIndexability({
    page: 1,
    limit: 30,
    order_by: "created_at",
    order_direction: "DESC",
    ...params,
  });
  if (!isIndexable) {
    return resolveListingIndexability({
      page: 1,
      limit: 30,
      order_by: "created_at",
      order_direction: "DESC",
      ...params,
    }).canonicalPath;
  }
  return pathname === "/vehiculos" ? null : pathname;
};
