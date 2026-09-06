import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
import { VehicleDetailGallery } from "./VehicleDetailGallery";
import { VehicleDetailMobileContactBar } from "./VehicleDetailMobileContactBar";
import { VehicleDetailSaveSearchSection } from "./VehicleDetailSaveSearchSection";
import { VehicleDetailTopBar } from "./VehicleDetailTopBar";
import { VehicleSimilarVehiclesSection } from "./VehicleSimilarVehiclesSection";
import { VehicleDetailViewTracker } from "./VehicleDetailViewTracker";
import { Vehicle } from "@/interfaces/vehicle.interface";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb.types";
import { CollaborationHeroCard } from "@/components/collabs/CollaborationHeroCard";
import { VehicleDetailSummaryCard } from "./VehicleDetailSummaryCard";
import { VehicleDetailContactCard } from "./VehicleDetailContactCard";
import { VehicleDetailTabbedContent } from "./VehicleDetailTabbedContent";
import { vehicleDetailCmsService } from "../services/vehicleDetailCmsService";

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

  const collaborations =
    await vehicleDetailCmsService.getHeroCollaborations();

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
      <div className="mx-auto listing-container space-y-8 py-5 sm:py-6">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_23rem] xl:grid-cols-[minmax(0,1fr)_25rem]">
          <main className="min-w-0 space-y-6">
            <VehicleDetailGallery images={vehicle.images} title={displayName} />

            <div className="lg:hidden">
              <VehicleDetailSummaryCard vehicle={vehicle} />
            </div>

            <VehicleDetailMobileContactBar
              vehicleId={vehicle.id}
              showPhone={showPhone}
              hasWhatsApp={hasWhatsApp}
              vehicleTitle={displayName}
              publisherProfileId={publisherProfileId}
            />

            <VehicleDetailTabbedContent vehicle={vehicle} />

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

            <VehicleDetailSaveSearchSection vehicle_id={vehicle.id} />
          </main>

          <aside className="hidden space-y-5 lg:block">
            <VehicleDetailSummaryCard vehicle={vehicle} />
            <VehicleDetailContactCard
              vehicle={vehicle}
              publisherProfileId={publisherProfileId}
            />
          </aside>
        </div>

        <VehicleSimilarVehiclesSection vehicleId={vehicle.id} />
      </div>
    </>
  );
};
