import { VehicleEngagementMenu } from "@/app/(public)/vehiculos/components/VehicleEngagementMenu";
import { VehicleFavoriteButton } from "@/app/(public)/vehiculos/components/VehicleFavoriteButton";
import { VehicleShareButton } from "@/app/(public)/vehiculos/components/VehicleShareButton";
import { PageBreadcrumbs } from "@/components/navigation/page-breadcrumbs";
import { ReportButton } from "@/components/reports/ReportButton";
import { Vehicle } from "@/interfaces/vehicle.interface";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb.types";

interface VehicleDetailTopBarProps {
  vehicleName: string;
  vehicle: Vehicle;
  breadcrumbItems: BreadcrumbItem[];
}

export const VehicleDetailTopBar = ({
  vehicleName,
  vehicle,
  breadcrumbItems,
}: VehicleDetailTopBarProps) => {
  return (
    <div className=" border-b border-gray-200 bg-white">
      <div className="mx-auto container-custom flex items-center justify-between gap-4 py-3">
        <PageBreadcrumbs items={breadcrumbItems} />

        <div className="flex items-center justify-end gap-2">
          <VehicleFavoriteButton vehicleId={vehicle.id} />
          <VehicleShareButton vehicleId={vehicle.id} vehicleTitle={vehicleName} />
          <ReportButton
            publisherType={vehicle.publisher_type}
            profileId={vehicle.profile_id}
            publisher={vehicle.publisher}
            dealership={vehicle.dealership}
            variant="ghost"
          />
          <VehicleEngagementMenu vehicleId={vehicle.id} variant="ghost" />
        </div>
      </div>
    </div>
  );
};
