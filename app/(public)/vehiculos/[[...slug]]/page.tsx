import type { Metadata } from "next";

import { ActiveFilters } from "../components/activeFilters";
import { VehiclesPageContent } from "../components/VehiclesPageContent";
import { findAllVehicles } from "./services/findAllVehicles.server";
import { toUrlSearchParams } from "./utils/toUrlSearchParams";
import {
  buildCanonicalListingHref,
  buildIndexableCatalogListingPath,
  CATALOG_DEGRADED_QUERY_KEYS,
  isIndexableCatalogSlugPath,
  parseVehicleListingUrl,
} from "@/lib/vehicles/listing-url";
import { activeFiltersService } from "../services/activeFiltersService";
import { FRONTEND_URL } from "@/constants";
import { JsonLdScript } from "@/lib/seo/json-ld-script";
import {
  buildVehicleListingCopy,
  buildVehicleListingJsonLd,
  buildVehicleListingMetadata,
} from "@/lib/seo/build-vehicle-listing-seo";
import { FiltersTitle } from "../components/filtersTitle";
import { SHOW_MAP_KEY } from "./constants/filterKeys.constants";

/** Listados con menos de 2 resultados se tratan como thin content. */
const THIN_LISTING_RESULT_THRESHOLD = 2;

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const search_params = await props.searchParams;
  const slug_segments = slug ?? [];
  const filters = parseVehicleListingUrl(
    slug_segments,
    toUrlSearchParams(search_params),
  );

  const [listing, activeFilters] = await Promise.all([
    findAllVehicles(filters),
    activeFiltersService.getActiveFilters(filters),
  ]);

  const url_search_params = toUrlSearchParams(search_params);
  const has_degraded_catalog_query = CATALOG_DEGRADED_QUERY_KEYS.some((key) =>
    url_search_params.has(key),
  );
  const indexable_path =
    isIndexableCatalogSlugPath(slug_segments) && !has_degraded_catalog_query
      ? buildIndexableCatalogListingPath(filters)
      : null;
  const canonical_path = indexable_path ?? buildCanonicalListingHref(filters);

  return buildVehicleListingMetadata(activeFilters.title, {
    canonical: `${FRONTEND_URL}${canonical_path}`,
    noindex: listing.total < THIN_LISTING_RESULT_THRESHOLD,
  });
}

export default async function VehiclesListingPage(props: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await props.params;
  const search_params = await props.searchParams;
  const slug_segments = slug ?? [];
  const filters = parseVehicleListingUrl(
    slug_segments,
    toUrlSearchParams(search_params),
  );

  const [listing, activeFilters] = await Promise.all([
    findAllVehicles(filters),
    activeFiltersService.getActiveFilters(filters),
  ]);
  const isMapVisible = search_params[SHOW_MAP_KEY] === "true";
  const listingCopy = buildVehicleListingCopy(activeFilters.title);
  const canonicalPath = buildCanonicalListingHref(filters);

  return (
    <>
      <JsonLdScript
        data={buildVehicleListingJsonLd({
          title: listingCopy.title,
          description: listingCopy.description,
          canonicalUrl: `${FRONTEND_URL}${canonicalPath}`,
          vehicles: listing.data,
          page: listing.page,
          limit: listing.limit,
        })}
      />
      <VehiclesPageContent
        vehicles={listing.data}
        total={listing.total}
        isMapVisible={isMapVisible}
        titleNode={<FiltersTitle title={activeFilters.title} />}
        activeFiltersNode={<ActiveFilters activeFilters={activeFilters} />}
      />
    </>
  );
}
