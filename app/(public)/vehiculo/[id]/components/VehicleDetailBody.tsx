import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
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
import { Vehicle } from "@/interfaces/vehicle.interface";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb.types";
import { CollaborationHeroCard } from "@/components/collabs/CollaborationHeroCard";
import { vehicleDetailCmsService } from "../services/vehicleDetailCmsService";
import dynamic from "next/dynamic";

const ContactSectionsContainer = dynamic(() =>
  import("./contactSectionsContainer").then(
    (mod) => mod.ContactSectionsContainer,
  ),
);
interface VehicleDetailBodyProps {
  vehicle: Vehicle;
  breadcrumbItems: BreadcrumbItem[];
}

export const VehicleDetailBody = async ({
  vehicle,
  breadcrumbItems,
}: VehicleDetailBodyProps) => {
  const displayName = getVehicleDisplayName(vehicle);
  const ownerProfileId = vehicle.profile_id ?? vehicle.publisher?.id ?? null;
  const publisherProfileId = vehicle.profile_id ?? vehicle.publisher.id;
  const showPhone = vehicle.show_phone !== false;
  const hasWhatsApp = vehicle.has_whatsapp === true;

  const collaborations = await vehicleDetailCmsService.getHeroCollaborations();

  return (
    <>
      <VehicleDetailViewTracker
        vehicleId={vehicle.id}
        ownerProfileId={ownerProfileId}
        vehicleName={displayName}
        vehiclePrice={vehicle.price ?? null}
        vehicleCategory={vehicle.version.make.name ?? null}
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

            {collaborations.length > 0 ? (
              <section
                aria-label="Colaboraciones y servicios"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {collaborations.map((collaboration) => (
                  <CollaborationHeroCard
                    key={collaboration.id}
                    content={collaboration}
                  />
                ))}
              </section>
            ) : null}

            <VehicleDetailDescription description={vehicle.description} />
            <VehicleDetailSaveSearchSection vehicle_id={vehicle.id} />
            <VehicleDetailFeatures features={vehicle.features} />
            <VehicleDetailAdvertiserSection vehicle={vehicle} />
            <VehicleDetailLocationSection vehicle={vehicle} />
          </div>
          <ContactSectionsContainer
            vehicleId={vehicle.id}
            showPhone={showPhone}
            hasWhatsApp={hasWhatsApp}
            vehicleTitle={displayName}
            publisherProfileId={publisherProfileId}
          />
        </div>
        <VehicleSimilarVehiclesSection vehicleId={vehicle.id} />
      </div>
    </>
  );
};
