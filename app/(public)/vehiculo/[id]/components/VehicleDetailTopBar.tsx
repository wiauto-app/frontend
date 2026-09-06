import { VehicleEngagementMenu } from "@/app/(public)/vehiculos/components/VehicleEngagementMenu";
import { PageBreadcrumbs } from "@/components/navigation/page-breadcrumbs";
import { ReportButton } from "@/components/reports/ReportButton";
import { Vehicle } from "@/interfaces/vehicle.interface";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb.types";

interface VehicleDetailTopBarProps {
  vehicle: Vehicle;
  breadcrumbItems: BreadcrumbItem[];
}

export const VehicleDetailTopBar = ({
  vehicle,
  breadcrumbItems,
}: VehicleDetailTopBarProps) => {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto listing-container flex items-center justify-between gap-4 py-3">
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
        </div>
      </div>
    </div>
  );
};
