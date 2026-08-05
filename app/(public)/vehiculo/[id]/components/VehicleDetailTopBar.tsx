import { VehicleEngagementMenu } from "@/app/(public)/vehiculos/components/VehicleEngagementMenu";
import { VehicleFavoriteButton } from "@/app/(public)/vehiculos/components/VehicleFavoriteButton";
import { VehicleShareButton } from "@/app/(public)/vehiculos/components/VehicleShareButton";
import { PageBreadcrumbs } from "@/components/navigation/page-breadcrumbs";
import { ReportButton } from "@/components/reports/ReportButton";
import { Vehicle } from "@/interfaces/vehicle.interface";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb.types";
import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";

interface VehicleDetailTopBarProps {
  vehicle: Vehicle;
  breadcrumbItems: BreadcrumbItem[];
}

export const VehicleDetailTopBar = ({
  vehicle,
  breadcrumbItems,
}: VehicleDetailTopBarProps) => {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto container-custom flex items-center justify-between gap-4 py-3">
        <PageBreadcrumbs items={breadcrumbItems} />

        <div className="flex items-center justify-end gap-2">
          <ReportButton
            publisherType={vehicle.publisher_type}
            profileId={vehicle.profile_id}
            publisher={vehicle.publisher}
            dealership={vehicle.dealership}
            variant="outline"
          />
          <VehicleEngagementMenu vehicleId={vehicle.id} variant="outline" />
          <VehicleFavoriteButton vehicleId={vehicle.id} variant="outline" />
          <VehicleShareButton
            vehicleId={vehicle.id}
            vehicleTitle={getVehicleDisplayName(vehicle)}
            variant="outline"
          />
        </div>
      </div>
    </div>
  );
};
