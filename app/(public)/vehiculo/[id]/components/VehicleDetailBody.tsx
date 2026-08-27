import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
import { VehicleDetailContactChannels } from "./VehicleDetailContactChannels";
import { VehicleDetailContactTabs } from "./VehicleDetailContactTabs";
import { VehicleDetailGallery } from "./VehicleDetailGallery";
import { VehicleDetailFeatures } from "./VehicleDetailFeatures";
import { VehicleDetailLocationSection } from "./VehicleDetailLocationSection";
import { VehicleDetailMobileContactBar } from "./VehicleDetailMobileContactBar";
import { VehicleDetailSaveSearchSection } from "./VehicleDetailSaveSearchSection";
import { VehicleDetailDescription } from "./VehicleDetailDescription";
import { VehicleDetailServicesSection } from "./VehicleDetailServicesSection";
import { VehicleDetailTitleSection } from "./VehicleDetailTitleSection";
import { VehicleDetailTopBar } from "./VehicleDetailTopBar";
import { VehicleDetailAdvertiserSection } from "./VehicleDetailAdvertiserSection";
import { VehicleSimilarVehiclesSection } from "./VehicleSimilarVehiclesSection";
import { VehicleDetailViewTracker } from "./VehicleDetailViewTracker";
import { Card, CardContent } from "@/components/ui/card";
import { Vehicle } from "@/interfaces/vehicle.interface";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb.types";
import { NeedCarHelpBanner } from "@/components/collabs/needCarHelpBanner";
import { Suspense } from "react";

interface VehicleDetailBodyProps {
  vehicle: Vehicle;
  breadcrumbItems: BreadcrumbItem[];
}

export const VehicleDetailBody = ({
  vehicle,
  breadcrumbItems,
}: VehicleDetailBodyProps) => {
  const displayName = getVehicleDisplayName(vehicle);
  const ownerProfileId = vehicle.profile_id ?? vehicle.publisher?.id ?? null;
  const publisherProfileId = vehicle.profile_id ?? vehicle.publisher.id;
  const showPhone = vehicle.show_phone !== false;
  const hasWhatsApp = vehicle.has_whatsapp === true;

  return (
    <>
      <VehicleDetailViewTracker
        vehicleId={vehicle.id}
        ownerProfileId={ownerProfileId}
      />
      <VehicleDetailTopBar
        vehicle={vehicle}
        breadcrumbItems={breadcrumbItems}
      />
      <div className="mx-auto container-custom space-y-6 py-6">
        <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            <VehicleDetailGallery images={vehicle.images} title={displayName} />
            <VehicleDetailTitleSection vehicle={vehicle} />
            <VehicleDetailMobileContactBar
              vehicleId={vehicle.id}
              showPhone={showPhone}
              hasWhatsApp={hasWhatsApp}
              vehicleTitle={displayName}
              publisherProfileId={publisherProfileId}
            />
            <VehicleDetailServicesSection services={vehicle.services} />
            <Suspense fallback={<div>Loading...</div>}>
              <NeedCarHelpBanner />
            </Suspense>
            <VehicleDetailDescription description={vehicle.description} />
            <VehicleDetailSaveSearchSection vehicle_id={vehicle.id} />
            {/* <VehicleDetailPriceAnalysisSection
            /> */}
            <VehicleDetailFeatures features={vehicle.features} />
            <VehicleDetailAdvertiserSection vehicle={vehicle} />
            <VehicleDetailLocationSection vehicle={vehicle} />
          </div>

          <Card
            id="vehicle-contact-section"
            className="sticky top-26 right-0 hidden h-fit scroll-mt-24 space-y-6 lg:block"
            size="sm"
          >
            <CardContent className="space-y-6">
              <VehicleDetailContactChannels
                vehicleId={vehicle.id}
                showPhone={showPhone}
                hasWhatsApp={hasWhatsApp}
                vehicleTitle={displayName}
              />
              <VehicleDetailContactTabs
                vehicleId={vehicle.id}
                publisherProfileId={publisherProfileId}
              />
            </CardContent>
          </Card>
        </div>
        <VehicleSimilarVehiclesSection vehicleId={vehicle.id} />
      </div>
    </>
  );
};
