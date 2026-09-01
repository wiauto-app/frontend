import { findAllVehicles } from "@/app/(public)/vehiculos/[[...slug]]/services/findAllVehicles.server";
import { findSimilarVehicles } from "@/app/(public)/vehiculo/[id]/services/findSimilarVehicles.server";
import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";
import { buildVehicleListingHref } from "@/lib/vehicles/listing-url";

import { VehiclesListingSection } from "./VehiclesListingSection";

type VehiclesListingSectionFromFiltersProps = {
  title: {
    lead: string;
    highlight?: string;
  };
  variant: "grid" | "carousel";
  fetchParams?: FindAllVehiclesParams;
  vehicleId?: string;
  seeMoreHref?: string;
  seeMoreLabel?: string;
  className?: string;
  pageSize?: number;
};

export const VehiclesListingSectionFromFilters = async ({
  title,
  variant,
  fetchParams,
  vehicleId,
  seeMoreHref,
  seeMoreLabel,
  className,
  pageSize = 4,
}: VehiclesListingSectionFromFiltersProps) => {
  if (variant === "grid") {
    if (!fetchParams) {
      return null;
    }

    const listing = await findAllVehicles(fetchParams);

    if (listing.total === 0) {
      return null;
    }

    return (
      <VehiclesListingSection
        title={title}
        variant="grid"
        vehicles={listing.data}
        seeMoreHref={seeMoreHref}
        seeMoreLabel={seeMoreLabel}
        className={className}
      />
    );
  }

  if (!vehicleId) {
    return null;
  }

  const listing = await findSimilarVehicles(vehicleId, {
    page: 1,
    limit: pageSize,
  });

  if (listing.total === 0) {
    return null;
  }

  const resolvedSeeMoreHref =
    seeMoreHref ??
    (listing.listingParams
      ? buildVehicleListingHref(listing.listingParams)
      : undefined);

  return (
    <VehiclesListingSection
      title={title}
      variant="carousel"
      vehicles={listing.vehicles}
      vehicleId={vehicleId}
      total={listing.total}
      pageSize={pageSize}
      seeMoreHref={resolvedSeeMoreHref}
      seeMoreLabel={seeMoreLabel}
      className={className}
    />
  );
};
