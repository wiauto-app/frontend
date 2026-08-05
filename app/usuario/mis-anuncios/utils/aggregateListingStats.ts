import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import type { OwnerVehicleStatTrend } from "@/interfaces/owner-vehicle.interface";

export type AggregatedStatTrend = OwnerVehicleStatTrend;

export type AggregatedListingStats = {
  views: AggregatedStatTrend;
  leads: AggregatedStatTrend;
  favorites: AggregatedStatTrend;
  activeCount: number;
  totalCount: number;
};

const aggregateTrend = (
  listings: OwnerVehicleListItem[],
  key: "views" | "leads" | "favorites",
): AggregatedStatTrend => {
  const current = listings.reduce((sum, listing) => sum + listing.stats[key].current, 0);
  const previous = listings.reduce((sum, listing) => sum + listing.stats[key].previous, 0);

  if (previous === 0 && current === 0) {
    return { current, previous, change_percent: null };
  }

  if (previous === 0) {
    return { current, previous, change_percent: 100 };
  }

  const change_percent =
    Math.round(((current - previous) / previous) * 100 * 10) / 10;

  return { current, previous, change_percent };
};

export const aggregateListingStats = (
  listings: OwnerVehicleListItem[],
): AggregatedListingStats => {
  const activeCount = listings.filter((listing) => listing.status === "active").length;

  return {
    views: aggregateTrend(listings, "views"),
    leads: aggregateTrend(listings, "leads"),
    favorites: aggregateTrend(listings, "favorites"),
    activeCount,
    totalCount: listings.length,
  };
};
