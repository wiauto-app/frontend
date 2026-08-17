import { cn } from "@/lib/utils";

import {
  EXTRA_SERVICES_DATA,
  EXTRA_SERVICES_DATA_2,
} from "./constants/extraServices.constants";
import { ServiceHomeItem } from "./serviceHomeItem";

interface VehicleExtraServicesProps {
  variant?: "primary" | "secondary";
  className?: string;
}

export const VehicleExtraServices = ({
  variant = "primary",
  className,
}: VehicleExtraServicesProps) => {
  const data =
    variant === "secondary" ? EXTRA_SERVICES_DATA_2 : EXTRA_SERVICES_DATA;

  return (
    <div
      className={cn(
        "grid w-full gap-3 md:gap-8 grid-cols-2 lg:grid-cols-5",
        className,
      )}
    >
      {data.map((item) => {
        const isLast = item === data[data.length - 1];
        const isUnPaired = data.length % 2 !== 0;
        return (
          <div key={item.href} className={cn(
            isLast && isUnPaired ? "col-span-2" : "col-span-1",
          )}>
            <ServiceHomeItem item={item} />
          </div>
        );
      })}
    </div>
  );
};
