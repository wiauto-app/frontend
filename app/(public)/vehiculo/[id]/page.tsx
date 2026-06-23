import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
import { VehicleDetailContactForm } from "./components/VehicleDetailContactForm";
import { VehicleDetailGallery } from "./components/VehicleDetailGallery";
import { VehicleDetailFeatures } from "./components/VehicleDetailFeatures";
import { VehicleDetailLocationSection } from "./components/VehicleDetailLocationSection";
import { VehicleDetailMobileActions } from "./components/VehicleDetailMobileActions";
import { VehicleDetailPriceAnalysisSection } from "./components/VehicleDetailPriceAnalysisSection";
import { VehicleDetailReviewsSection } from "./components/VehicleDetailReviewsSection";
import { VehicleDetailSaveSearchSection } from "./components/VehicleDetailSaveSearchSection";
import { VehicleDetailDescription } from "./components/VehicleDetailDescription";
import { VehicleDetailServicesSection } from "./components/VehicleDetailServicesSection";
import { VehicleDetailTitleSection } from "./components/VehicleDetailTitleSection";
import { VehicleDetailTopBar } from "./components/VehicleDetailTopBar";
import { VehicleDetailVerifiedSellerCard } from "./components/VehicleDetailVerifiedSellerCard";
import { notFound } from "next/navigation";
import { VehicleDetailReviewForm } from "./components/VehicleDetailReviewForm";
import { VehicleDetailAdvertiserSection } from "./components/VehicleDetailAdvertiserSection";
import { VehicleSimilarVehiclesSection } from "./components/VehicleSimilarVehiclesSection";
import { Card, CardContent } from "@/components/ui/card";
import { VehicleFavoriteButton } from "../../vehiculos/components/VehicleFavoriteButton";
import { VehicleShareButton } from "../../vehiculos/components/VehicleShareButton";
import { ReportButton } from "@/components/reports/ReportButton";
import { Metadata } from "next";
import { getVehicleData } from "./services/getVehicleData";
import { buildVehicleDetailSeo } from "@/lib/seo/build-vehicle-detail-seo";
import { JsonLdScript } from "@/lib/seo/json-ld-script";

type VehicleDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: VehicleDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  const { data } = await getVehicleData(id);

  if (!data.ok || !data.data) {
    notFound();
  }

  return buildVehicleDetailSeo(data.data).metadata;
}

export default async function VehicleDetailPage({
  params,
}: VehicleDetailPageProps) {
  const { id } = await params;
  const { old, data, reviews } = await getVehicleData(id);

  if (!data.ok || !data.data) {
    notFound();
  }

  const vehicle = data.data;
  const displayName = getVehicleDisplayName(vehicle);
  const { breadcrumbItems, jsonLdGraph } = buildVehicleDetailSeo(vehicle);

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLdScript data={jsonLdGraph} />
      <VehicleDetailTopBar
        vehicle_id={vehicle.id}
        vehicle_title={displayName}
        breadcrumbItems={breadcrumbItems}
      />
      <div className="mx-auto container-custom py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 relative">
          <div className="space-y-6 lg:col-span-3">
            <VehicleDetailGallery
              images={vehicle.images}
              title={displayName}
              condition_label={vehicle.condition}
            />
            <VehicleDetailTitleSection vehicle={vehicle} />

            <VehicleDetailServicesSection services={vehicle.services} />
            <VehicleDetailSaveSearchSection vehicle_id={vehicle.id} />
            <VehicleDetailDescription
              description={vehicle.description}
            />
            <VehicleDetailPriceAnalysisSection
              price_analysis={old.price_analysis}
            />
            <VehicleDetailFeatures features={vehicle.features} />
            <VehicleDetailAdvertiserSection vehicle={vehicle} />
            <VehicleDetailReviewForm vehicle_id={vehicle.id} />
            <VehicleDetailReviewsSection reviews={reviews} />
            <VehicleDetailLocationSection vehicle={vehicle} />
          </div>

          <Card className="space-y-6 sticky top-20 right-0 h-fit" size="sm">
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
                  vehicleTitle={displayName}
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
