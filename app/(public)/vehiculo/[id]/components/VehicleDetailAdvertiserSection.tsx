


import { Vehicle } from "@/interfaces/vehicle.interface";
import { PublisherCard } from "./publisherCard";
import { DealershipCard } from "./dealershipCard";

type VehicleDetailVerifiedSellerCardProps = {
  vehicle: Vehicle;
};

export const VehicleDetailAdvertiserSection = ({
  vehicle,
}: VehicleDetailVerifiedSellerCardProps) => {
  if (vehicle.publisher_type === "particular") {
    return <PublisherCard publisher={vehicle.publisher} />
  }
  return <DealershipCard dealership={vehicle.dealership!} />
}
