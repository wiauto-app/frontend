import { Profile } from "@/components/ui/profile";
import { VehicleDetailDealership } from "@/interfaces/vehicle.interface";
import { VehicleDetailCard } from "./VehicleDetailCard";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/app/(public)/vehiculos/utils";
import Image from "next/image";

export const DealershipCard = ({
  dealership,
}: {
  dealership: VehicleDetailDealership;
}) => {
  return (
    <VehicleDetailCard title="Información del Concesionario">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col justify-between gap-4">
          <Profile
            name={dealership.name}
            description={dealership.description}
            avatar_url={dealership.avatar_url}
          />
          <div className="flex flex-col gap-2">
            <Button>Más vehículos del concesionario</Button>
            <Button variant="outline">Mostrar teléfono</Button>
          </div>
        </div>
        <div className="relative h-72 rounded-lg overflow-hidden w-full">
          <Image
            src={getImageUrl(dealership.banner_url ?? "")}
            unoptimized
            alt={dealership.name}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </VehicleDetailCard>
  );
};
