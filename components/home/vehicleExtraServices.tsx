import { ServiceHomeItem } from "./serviceHomeItem";
import { VehicleExtraServiceItem } from "./types/home-page.types";

export const VehicleExtraServices = ({
  data,
}: {
  data: VehicleExtraServiceItem[];
}) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {data.map((item) => (
        <ServiceHomeItem key={item.href} item={item} />
      ))}
    </div>
  );
};
