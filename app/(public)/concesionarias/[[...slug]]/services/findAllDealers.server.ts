import { API_URL } from "@/constants";
import type { DealerFilters, DealersListingResult, DealerListItem } from "../../interfaces";

const BASE_DEALERS: Omit<DealerListItem, "id" | "slug">[] = [
  {
    name: "Motores Premium",
    type: "oficial",
    isVerified: true,
    rating: 4.8,
    reviewCount: 120,
    vehicleCount: 120,
    distance: 2.3,
    location: { city: "Madrid", province: "Madrid", country: "España" },
    services: ["Financiación", "Taller propio"],
    image:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Auto Select",
    type: "multimarca",
    isVerified: true,
    rating: 4.6,
    reviewCount: 85,
    vehicleCount: 85,
    distance: 8.7,
    location: { city: "Barcelona", province: "Barcelona", country: "España" },
    services: ["Financiación", "Garantía extendida"],
    image:
      "https://images.unsplash.com/photo-1562141961-d993a1b2639b?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Drive Cars",
    type: "especialista",
    isVerified: true,
    rating: 4.5,
    reviewCount: 68,
    vehicleCount: 60,
    distance: 12.1,
    location: { city: "Valencia", province: "Valencia", country: "España" },
    services: ["Taller propio", "Entrega a domicilio"],
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Quality Motors",
    type: "multimarca",
    isVerified: true,
    rating: 4.4,
    reviewCount: 55,
    vehicleCount: 75,
    distance: 15.4,
    location: { city: "Sevilla", province: "Sevilla", country: "España" },
    services: ["Financiación", "Garantía extendida"],
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Premium Auto",
    type: "oficial",
    isVerified: true,
    rating: 4.4,
    reviewCount: 42,
    vehicleCount: 45,
    distance: 18.9,
    location: { city: "Zaragoza", province: "Zaragoza", country: "España" },
    services: ["Taller propio", "Financiación"],
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Elite Motor",
    type: "oficial",
    isVerified: false,
    rating: 4.2,
    reviewCount: 30,
    vehicleCount: 35,
    distance: 22.5,
    location: { city: "Málaga", province: "Málaga", country: "España" },
    services: ["Financiación"],
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80",
  },
];

const MOCK_DEALERS: DealerListItem[] = Array.from({ length: 124 }, (_, index) => {
  const base = BASE_DEALERS[index % BASE_DEALERS.length];
  const suffix = index >= BASE_DEALERS.length ? ` ${Math.floor(index / BASE_DEALERS.length) + 1}` : "";

  return {
    ...base,
    id: String(index + 1),
    name: `${base.name}${suffix}`.trim(),
    slug: `${base.name.toLowerCase().replace(/\s+/g, "-")}-${index + 1}`,
    distance: base.distance != null ? Number((base.distance + index * 0.4).toFixed(1)) : undefined,
    reviewCount: base.reviewCount + (index % 12),
    vehicleCount: base.vehicleCount + (index % 20),
  };
});

const sortDealers = (dealers: DealerListItem[], sort?: string) => {
  const sorted = [...dealers];

  switch (sort) {
    case "rating-desc":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "vehicles-desc":
      return sorted.sort((a, b) => b.vehicleCount - a.vehicleCount);
    case "distance-asc":
      return sorted.sort(
        (a, b) => (a.distance ?? Number.MAX_SAFE_INTEGER) - (b.distance ?? Number.MAX_SAFE_INTEGER),
      );
    case "reviews-desc":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    default:
      return sorted;
  }
};

export const findAllDealers = async (
  filters: DealerFilters,
): Promise<DealersListingResult> => {
  const empty: DealersListingResult = {
    dealers: [],
    total: 0,
    page: filters.page ?? 1,
    limit: filters.limit ?? 12,
  };

  try {
    if (API_URL) {
      const params = new URLSearchParams();
      if (filters.query) params.set("query", filters.query);
      if (filters.types?.length) params.set("types", filters.types.join(","));
      if (filters.services?.length) params.set("services", filters.services.join(","));
      if (filters.minRating) params.set("min_rating", String(filters.minRating));
      if (filters.minVehicles) params.set("min_vehicles", String(filters.minVehicles));
      if (filters.radius) params.set("radius", String(filters.radius));
      if (filters.location) params.set("location", filters.location);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));
      if (filters.sort) params.set("sort", filters.sort);

      const query = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(`${API_URL}/v1/dealers${query}`, {
        cache: "no-store",
      });

      if (response.ok) {
        const body = await response.json();
        const payload = body.data;
        if (payload) {
          return {
            dealers: payload.data ?? [],
            total: payload.total ?? 0,
            page: payload.page ?? empty.page,
            limit: payload.limit ?? empty.limit,
          };
        }
      }
    }
  } catch {
    // Fall through to mock data
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  let results = [...MOCK_DEALERS];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.location.city.toLowerCase().includes(q),
    );
  }
  if (filters.types?.length) {
    results = results.filter((d) => filters.types!.includes(d.type));
  }
  if (filters.services?.length) {
    results = results.filter((d) =>
      filters.services!.some((service) =>
        d.services.some((label) =>
          label.toLowerCase().includes(service.replace(/-/g, " ")),
        ),
      ),
    );
  }
  if (filters.minRating) {
    results = results.filter((d) => d.rating >= filters.minRating!);
  }
  if (filters.minVehicles) {
    results = results.filter((d) => d.vehicleCount >= filters.minVehicles!);
  }

  results = sortDealers(results, filters.sort);

  const total = results.length;
  const start = (page - 1) * limit;
  const dealers = results.slice(start, start + limit);

  return { dealers, total, page, limit };
};
