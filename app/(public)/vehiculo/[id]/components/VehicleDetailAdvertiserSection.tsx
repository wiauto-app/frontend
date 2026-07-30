import { Vehicle } from "@/interfaces/vehicle.interface";
import { PublisherCard } from "./publisherCard";
import { DealershipCard } from "./dealershipCard";

interface VehicleDetailAdvertiserSectionProps {
  vehicle: Vehicle;
}

export const VehicleDetailAdvertiserSection = ({
  vehicle,
}: VehicleDetailAdvertiserSectionProps) => {
  if (vehicle.publisher_type === "particular") {
    return <PublisherCard publisher={vehicle.publisher} />;
  }

  if (!vehicle.dealership) {
    return null;
  }

  return (
    <DealershipCard
      dealership={vehicle.dealership}
      vehicleRef={vehicle.ref}
    />
  );
};
