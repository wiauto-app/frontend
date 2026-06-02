import { CATALOG_DEGRADED_QUERY_KEYS } from "./constants";

export const isIndexableListingPathname = (
  pathname: string,
  search: string,
): boolean => {
  if (!pathname.startsWith("/vehiculos")) {
    return false;
  }

  if (!search) {
    return true;
  }

  const params = new URLSearchParams(search);
  return !CATALOG_DEGRADED_QUERY_KEYS.some((key) => params.has(key));
};
