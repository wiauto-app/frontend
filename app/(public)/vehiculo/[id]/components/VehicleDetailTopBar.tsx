"use client";

import { VehicleFavoriteButton } from "@/app/(public)/vehiculos/components/VehicleFavoriteButton";
import { VehicleShareButton } from "@/app/(public)/vehiculos/components/VehicleShareButton";
import { PageBreadcrumbs } from "@/components/navigation/page-breadcrumbs";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb.types";

type VehicleDetailTopBarProps = {
  vehicle_id: string;
  vehicle_title: string;
  breadcrumbItems: BreadcrumbItem[];
};

export const VehicleDetailTopBar = ({
  vehicle_id,
  vehicle_title,
  breadcrumbItems,
}: VehicleDetailTopBarProps) => {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto container-custom flex items-center justify-between gap-4 py-3">
        <PageBreadcrumbs items={breadcrumbItems} />

        <div className="flex shrink-0 items-center gap-2">
          <VehicleFavoriteButton vehicleId={vehicle_id} />
          <VehicleShareButton
            vehicleId={vehicle_id}
            vehicleTitle={vehicle_title}
          />
        </div>
      </div>
    </div>
  );
};
