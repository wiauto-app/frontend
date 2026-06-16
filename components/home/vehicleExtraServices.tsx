import { ServiceHomeItem } from "./serviceHomeItem";
import { VehicleExtraServiceItem } from "./types/home-page.types";
import { cn } from "@/lib/utils";

export const VehicleExtraServices = ({
  data,
  className,
}: {
  data: VehicleExtraServiceItem[];
  className?: string;
}) => {
  return (
    <div className={cn("w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4", className)}>
      {data.map((item) => (
        <ServiceHomeItem key={item.href} item={item} />
      ))}
    </div>
  );
};
