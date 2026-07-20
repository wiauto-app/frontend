import { VehicleGridCard } from "@/app/(public)/vehiculos/components/VehicleGridCard";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";

type VehiclesGridLayoutProps = {
  vehicles: VehicleListItem[];
};

export const VehiclesGridLayout = ({ vehicles }: VehiclesGridLayoutProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 pb-2">
      {vehicles.map((vehicle) => (
        <VehicleGridCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
};
