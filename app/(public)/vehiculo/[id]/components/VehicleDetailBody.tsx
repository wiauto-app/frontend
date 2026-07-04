import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
import { VehicleDetailContactChannels } from "./VehicleDetailContactChannels";
import { VehicleDetailContactTabs } from "./VehicleDetailContactTabs";
import { VehicleDetailGallery } from "./VehicleDetailGallery";
import { VehicleDetailFeatures } from "./VehicleDetailFeatures";
import { VehicleDetailLocationSection } from "./VehicleDetailLocationSection";
import { VehicleDetailMobileActions } from "./VehicleDetailMobileActions";
import { VehicleDetailPriceAnalysisSection } from "./VehicleDetailPriceAnalysisSection";
import { VehicleDetailReviewsSection } from "./VehicleDetailReviewsSection";
import { VehicleDetailSaveSearchSection } from "./VehicleDetailSaveSearchSection";
import { VehicleDetailDescription } from "./VehicleDetailDescription";
import { VehicleDetailServicesSection } from "./VehicleDetailServicesSection";
import { VehicleDetailTitleSection } from "./VehicleDetailTitleSection";
import { VehicleDetailTopBar } from "./VehicleDetailTopBar";
import { VehicleDetailReviewForm } from "./VehicleDetailReviewForm";
import { VehicleDetailAdvertiserSection } from "./VehicleDetailAdvertiserSection";
import { VehicleSimilarVehiclesSection } from "./VehicleSimilarVehiclesSection";
import { Card, CardContent } from "@/components/ui/card";
import { Vehicle } from "@/interfaces/vehicle.interface";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb.types";
import type {
  VehicleDetailReview,
  VehicleDetailView,
} from "../types/vehicle-detail.types";

interface VehicleDetailBodyProps {
  vehicle: Vehicle;
  old: VehicleDetailView;
  reviews: VehicleDetailReview[];
  breadcrumbItems: BreadcrumbItem[];
}

export const VehicleDetailBody = ({
  vehicle,
  old,
  reviews,
  breadcrumbItems,
}: VehicleDetailBodyProps) => {
  const displayName = getVehicleDisplayName(vehicle);

  return (
    <>
      <VehicleDetailTopBar
        vehicle={vehicle}
        breadcrumbItems={breadcrumbItems}
      />
      <div className="mx-auto container-custom py-6">
        <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            <VehicleDetailGallery
              images={vehicle.images}
              title={displayName}
              condition_label={vehicle.condition}
            />
            <VehicleDetailTitleSection vehicle={vehicle} />

            <VehicleDetailServicesSection services={vehicle.services} />
            <VehicleDetailSaveSearchSection vehicle_id={vehicle.id} />
            <VehicleDetailDescription description={vehicle.description} />
            <VehicleDetailPriceAnalysisSection
              price_analysis={old.price_analysis}
            />
            <VehicleDetailFeatures features={vehicle.features} />
            <VehicleDetailAdvertiserSection vehicle={vehicle} />
            <VehicleDetailReviewForm vehicle_id={vehicle.id} />
            <VehicleDetailReviewsSection reviews={reviews} />
            <VehicleDetailLocationSection vehicle={vehicle} />
          </div>

          <Card
            id="vehicle-contact-section"
            className="sticky top-20 right-0 h-fit scroll-mt-24 space-y-6"
            size="sm"
          >
            <CardContent className="space-y-6">
              <VehicleDetailContactChannels
                vehicleId={vehicle.id}
                showPhone={vehicle.show_phone !== false}
                hasWhatsApp={vehicle.has_whatsapp === true}
                vehicleTitle={displayName}
              />
              <VehicleDetailContactTabs
                vehicleId={vehicle.id}
                publisherProfileId={
                  vehicle.profile_id ?? vehicle.publisher.id
                }
                advertiser={old.advertiser}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <VehicleSimilarVehiclesSection vehicleId={vehicle.id} />

      <VehicleDetailMobileActions
        vehicleId={vehicle.id}
        showPhone={vehicle.show_phone !== false}
        hasWhatsApp={vehicle.has_whatsapp === true}
        vehicleTitle={displayName}
      />
    </>
  );
};
