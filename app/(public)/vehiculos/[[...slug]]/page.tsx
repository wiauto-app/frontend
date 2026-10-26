import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

import { ActiveFilters } from "../components/activeFilters";
import { VehiclesPageContent } from "../components/VehiclesPageContent";
import { findAllVehicles } from "./services/findAllVehicles.server";
import { toUrlSearchParams } from "./utils/toUrlSearchParams";
import {
  normalizeVehicleListingHref,
  parseVehicleListingUrl,
  resolveListingIndexability,
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
import { DirectionalTransition } from "@/components/view-transitions/directional-transition";

/** Listados con menos de 2 resultados se tratan como thin content. */
const THIN_LISTING_RESULT_THRESHOLD = 2;

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const search_params = await props.searchParams;
  const slug_segments = slug ?? [];
  const url_search_params = toUrlSearchParams(search_params);

  const normalized_href_for_metadata = normalizeVehicleListingHref(
    slug_segments,
    url_search_params,
  );
  if (normalized_href_for_metadata) {
    permanentRedirect(normalized_href_for_metadata);
  }

  const filters = parseVehicleListingUrl(slug_segments, url_search_params);

  const [listing, activeFilters] = await Promise.all([
    findAllVehicles(filters),
    activeFiltersService.getActiveFilters(filters),
  ]);

  const { isIndexable, canonicalPath } = resolveListingIndexability(filters);

  return buildVehicleListingMetadata(activeFilters.title, {
    canonical: `${FRONTEND_URL}${canonicalPath}`,
    noindex: !isIndexable || listing.total < THIN_LISTING_RESULT_THRESHOLD,
  });
}

export default async function VehiclesListingPage(props: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await props.params;
  const search_params = await props.searchParams;
  const slug_segments = slug ?? [];
  const url_search_params = toUrlSearchParams(search_params);

  const normalized_href = normalizeVehicleListingHref(
    slug_segments,
    url_search_params,
  );
  if (normalized_href) {
    permanentRedirect(normalized_href);
  }

  const filters = parseVehicleListingUrl(slug_segments, url_search_params);

  const [listing, activeFilters] = await Promise.all([
    findAllVehicles(filters),
    activeFiltersService.getActiveFilters(filters),
  ]);
  const isMapVisible = search_params[SHOW_MAP_KEY] === "true";
  const listingCopy = buildVehicleListingCopy(activeFilters.title);
  const { canonicalPath } = resolveListingIndexability(filters);

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
      <DirectionalTransition>
        <div>
          <VehiclesPageContent
            vehicles={listing.data}
            total={listing.total}
            isMapVisible={isMapVisible}
            titleNode={<FiltersTitle title={activeFilters.title} />}
            activeFiltersNode={<ActiveFilters activeFilters={activeFilters} />}
            recordSearch
          />
        </div>
      </DirectionalTransition>
    </>
  );
}
