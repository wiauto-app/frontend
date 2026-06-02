import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

import { joinCommaSlugs } from "./split-comma-slugs";

export type CatalogFilterParams = Pick<
  FindAllVehiclesParams,
  | "makes_slugs"
  | "models_slugs"
  | "comunities_slugs"
  | "provinces_slugs"
  | "municipalities_slugs"
>;

/** Slugs de catálogo que van al PATH (Opción C: exactamente 1 por dimensión). */
export const resolveCatalogForPath = (
  params: CatalogFilterParams,
): CatalogFilterParams => {
  const makes = params.makes_slugs ?? [];
  const models = params.models_slugs ?? [];
  const path: CatalogFilterParams = {};

  if (makes.length === 1) {
    path.makes_slugs = makes;
  }

  if (makes.length === 1 && models.length === 1) {
    path.models_slugs = models;
  }

  if ((params.comunities_slugs?.length ?? 0) === 1) {
    path.comunities_slugs = params.comunities_slugs;
  }
  if ((params.provinces_slugs?.length ?? 0) === 1) {
    path.provinces_slugs = params.provinces_slugs;
  }
  if ((params.municipalities_slugs?.length ?? 0) === 1) {
    path.municipalities_slugs = params.municipalities_slugs;
  }

  return path;
};

const shouldEmitCatalogQuery = (
  slugs: string[] | undefined,
  in_path: string[] | undefined,
): slugs is string[] => {
  if (!slugs?.length) {
    return false;
  }
  if (slugs.length > 1) {
    return true;
  }
  return !in_path?.length || in_path[0] !== slugs[0];
};

/** Pares query amigable → valor para dimensiones degradadas a query. */
export const resolveCatalogForQuery = (
  params: CatalogFilterParams,
  in_path: CatalogFilterParams,
): Record<string, string> => {
  const query: Record<string, string> = {};

  if (shouldEmitCatalogQuery(params.makes_slugs, in_path.makes_slugs)) {
    query.marcas = joinCommaSlugs(params.makes_slugs)!;
  }

  if (shouldEmitCatalogQuery(params.models_slugs, in_path.models_slugs)) {
    query.modelos = joinCommaSlugs(params.models_slugs)!;
  }

  if (shouldEmitCatalogQuery(params.comunities_slugs, in_path.comunities_slugs)) {
    query.comunidades = joinCommaSlugs(params.comunities_slugs)!;
  }

  if (shouldEmitCatalogQuery(params.provinces_slugs, in_path.provinces_slugs)) {
    query.provincias = joinCommaSlugs(params.provinces_slugs)!;
  }

  if (
    shouldEmitCatalogQuery(
      params.municipalities_slugs,
      in_path.municipalities_slugs,
    )
  ) {
    query.municipios = joinCommaSlugs(params.municipalities_slugs)!;
  }

  return query;
};
