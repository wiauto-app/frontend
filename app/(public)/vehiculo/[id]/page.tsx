import { vehicleService } from "@/services/vehicleService";
import { VehicleDetailContactForm } from "./components/VehicleDetailContactForm";
import { VehicleDetailGallery } from "./components/VehicleDetailGallery";
import { VehicleDetailGeneralSpecsSection } from "./components/VehicleDetailGeneralSpecsSection";
import { VehicleDetailLocationSection } from "./components/VehicleDetailLocationSection";
import { VehicleDetailMobileActions } from "./components/VehicleDetailMobileActions";
import { VehicleDetailPriceAnalysisSection } from "./components/VehicleDetailPriceAnalysisSection";
import { VehicleDetailReviewsSection } from "./components/VehicleDetailReviewsSection";
import { VehicleDetailSaveSearchSection } from "./components/VehicleDetailSaveSearchSection";
import { VehicleDetailSellerCommentsSection } from "./components/VehicleDetailSellerCommentsSection";
import { VehicleDetailServicesSection } from "./components/VehicleDetailServicesSection";
import { VehicleDetailTitleSection } from "./components/VehicleDetailTitleSection";
import { VehicleDetailTopBar } from "./components/VehicleDetailTopBar";
import { VehicleDetailVerifiedSellerCard } from "./components/VehicleDetailVerifiedSellerCard";
import { findVehicleReviews } from "./services/findVehicleReviews.server";
import { getVehicleDetail } from "./services/getVehicleDetail.server";
import { notFound } from "next/navigation";
import { VehicleDetailReviewForm } from "./components/VehicleDetailReviewForm";
import { VehicleDetailAdvertiserSection } from "./components/VehicleDetailAdvertiserSection";
import { VehicleSimilarVehiclesSection } from "./components/VehicleSimilarVehiclesSection";
import { Card, CardContent } from "@/components/ui/card";
import { VehicleFavoriteButton } from "../../vehiculos/components/VehicleFavoriteButton";
import { VehicleShareButton } from "../../vehiculos/components/VehicleShareButton";
import { ReportButton } from "@/components/reports/ReportButton";

type VehicleDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VehicleDetailPage({
  params,
}: VehicleDetailPageProps) {
  const { id } = await params;
  const [old, data, reviews] = await Promise.all([
    getVehicleDetail(id),
    vehicleService.vehicles.findById(id),
    findVehicleReviews(id),
  ]);

  if (!data.ok || !data.data) {
    notFound();
  }

  const vehicle = data.data;
  return (
    <div className="min-h-screen bg-gray-50">
      <VehicleDetailTopBar
        vehicle_id={vehicle.id}
        vehicle_title={vehicle.title}
      />
      <div className="mx-auto container py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 relative">
          <div className="space-y-6 lg:col-span-3">
            <VehicleDetailGallery
              images={vehicle.images}
              title={vehicle.title}
              condition_label={old.condition_label}
            />
            <VehicleDetailTitleSection vehicle={vehicle} />

            <VehicleDetailServicesSection services={vehicle.services} />
            <VehicleDetailSaveSearchSection />
            <VehicleDetailSellerCommentsSection
              description={vehicle.description}
            />
            <VehicleDetailPriceAnalysisSection
              price_analysis={old.price_analysis}
            />
            <VehicleDetailGeneralSpecsSection features={vehicle.features} />
            <VehicleDetailAdvertiserSection vehicle={vehicle} />
            <VehicleDetailReviewForm vehicle_id={vehicle.id} />
            <VehicleDetailReviewsSection reviews={reviews} />
            <VehicleDetailLocationSection location={old.location} />
          </div>

          <Card className="space-y-6 sticky top-20 right-0 h-fit">
            <CardContent className="space-y-6">
              <div className="flex items-center justify-end gap-2">
                <ReportButton
                  publisherType={vehicle.publisher_type}
                  profileId={vehicle.profile_id}
                  publisher={vehicle.publisher}
                  dealership={vehicle.dealership}
                  variant="outline"
                />
                <VehicleFavoriteButton
                  vehicleId={vehicle.id}
                  variant="outline"
                />
                <VehicleShareButton
                  vehicleId={vehicle.id}
                  vehicleTitle={vehicle.title}
                  variant="outline"
                />
              </div>
              <VehicleDetailVerifiedSellerCard
                verified_seller={old.verified_seller}
                dealership={vehicle.dealership}
              />
              <VehicleDetailContactForm
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

      <VehicleDetailMobileActions contact_phone={old.contact_phone} />
    </div>
  );
}
