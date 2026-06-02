import { buildVehicleListingHref } from "./build-listing-url";
import { parseVehicleListingUrl } from "./parse-listing-url";

const normalizeHref = (href: string): string => {
  const url = new URL(href, "http://localhost");
  const entries = [...url.searchParams.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  );
  const search = new URLSearchParams(entries).toString();
  return search ? `${url.pathname}?${search}` : url.pathname;
};

export const normalizeVehicleListingHref = (
  slug: string[] | undefined,
  search_params: URLSearchParams,
): string | null => {
  const params = parseVehicleListingUrl(slug, search_params);
  const target = buildVehicleListingHref(params);

  const slug_path =
    slug && slug.length > 0 ? `/vehiculos/${slug.join("/")}` : "/vehiculos";
  const current_search = search_params.toString();
  const current = current_search
    ? `${slug_path}?${current_search}`
    : slug_path;

  if (normalizeHref(target) === normalizeHref(current)) {
    return null;
  }

  return target;
};
