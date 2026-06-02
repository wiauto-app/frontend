import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

export const buildVehiclesQueryString = (
  params?: FindAllVehiclesParams,
): string => {
  if (!params) {
    return "";
  }

  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null,
  );
  if (entries.length === 0) {
    return "";
  }

  const query_parts = entries
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value
          .map(
            (item) =>
              `${encodeURIComponent(key)}[]=${encodeURIComponent(String(item))}`,
          )
          .join("&");
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .join("&");

  return `?${query_parts}`;
};
