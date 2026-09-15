import { VehicleFeaturedCard } from "@/app/(public)/vehiculos/components/VehicleFeaturedCard";
import { VehicleGridCard } from "@/app/(public)/vehiculos/components/VehicleGridCard";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";

interface VehiclesGridLayoutProps {
  vehicles: VehicleListItem[];
  cardVariant?: "default" | "featured";
}

export const VehiclesGridLayout = ({
  vehicles,
  cardVariant = "default",
}: VehiclesGridLayoutProps) => {
  return (
    <div className="grid gap-4 pb-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
      {vehicles.map((vehicle) =>
        cardVariant === "featured" ? (
          <VehicleFeaturedCard key={vehicle.id} vehicle={vehicle} />
        ) : (
          <VehicleGridCard key={vehicle.id} vehicle={vehicle} />
        ),
      )}
    </div>
  );
};
