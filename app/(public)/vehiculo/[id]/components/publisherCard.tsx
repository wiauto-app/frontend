import { Publisher } from "@/interfaces/vehicle.interface";
import { VehicleDetailCard } from "./VehicleDetailCard";
import { Profile } from "@/components/ui/profile";

export const PublisherCard = ({ publisher }: { publisher: Publisher }) => {
  return (
    <VehicleDetailCard title="Información del Vendedor">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col justify-between gap-4">
          <Profile
            name={publisher.name}
            avatar_url={publisher.avatar_url ?? undefined}
          />
        </div>
      </div>
    </VehicleDetailCard>
  );
};
