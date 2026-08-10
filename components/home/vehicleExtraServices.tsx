
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
        "grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5",
        className,
      )}
    >
      {data.map((item) => (
        <ServiceHomeItem key={item.href} item={item} />
      ))}
    </div>
  );
};
