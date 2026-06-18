import type { DealerFilters } from "../interfaces";

export const parseDealersUrl = (
  slug: string[],
  searchParams: URLSearchParams,
): DealerFilters => {
  const filters: DealerFilters = {};

  const query = searchParams.get("q");
  if (query) filters.query = query;

  const types = searchParams.get("types");
  if (types) filters.types = types.split(",").filter(Boolean);

  const services = searchParams.get("services");
  if (services) filters.services = services.split(",").filter(Boolean);

  const minRating = searchParams.get("min_rating");
  if (minRating) {
    const parsed = parseFloat(minRating);
    if (!isNaN(parsed)) filters.minRating = parsed;
  }

  const minVehicles = searchParams.get("min_vehicles");
  if (minVehicles) {
    const parsed = parseInt(minVehicles, 10);
    if (!isNaN(parsed)) filters.minVehicles = parsed;
  }

  const radius = searchParams.get("radius");
  if (radius) {
    const parsed = parseInt(radius, 10);
    if (!isNaN(parsed)) filters.radius = parsed;
  }

  const location = searchParams.get("location");
  if (location) filters.location = location;

  const page = searchParams.get("page");
  if (page) {
    const parsed = parseInt(page, 10);
    if (!isNaN(parsed)) filters.page = parsed;
  }

  const limit = searchParams.get("limit");
  if (limit) {
    const parsed = parseInt(limit, 10);
    if (!isNaN(parsed)) filters.limit = parsed;
  }

  const sort = searchParams.get("sort");
  if (sort) filters.sort = sort;

  return filters;
};

export const buildDealersHref = (filters: DealerFilters): string => {
  const params = new URLSearchParams();

  if (filters.query) params.set("q", filters.query);
  if (filters.types?.length) params.set("types", filters.types.join(","));
  if (filters.services?.length) params.set("services", filters.services.join(","));
  if (filters.minRating) params.set("min_rating", String(filters.minRating));
  if (filters.minVehicles) params.set("min_vehicles", String(filters.minVehicles));
  if (filters.radius != null && filters.radius > 0)
    params.set("radius", String(filters.radius));
  if (filters.location) params.set("location", filters.location);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  if (filters.sort) params.set("sort", filters.sort);

  const qs = params.toString();
  return `/concesionarias${qs ? `?${qs}` : ""}`;
};
