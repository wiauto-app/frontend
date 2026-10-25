"use client";
import { cn } from "@/lib/utils";

import { EXTRA_SERVICES_DATA } from "./constants/extraServices.constants";
import { ServiceHomeItem } from "./serviceHomeItem";

interface VehicleExtraServicesProps {
  className?: string;
}

export const VehicleExtraServices = ({
  className,
}: VehicleExtraServicesProps) => {
  const data = EXTRA_SERVICES_DATA;

  return (
    <section
      className={cn(
        "grid w-full gap-3 md:gap-8 grid-cols-2 lg:grid-cols-5",
        className,
      )}
    >
      {data.map((item) => {
        const isLast = item === data[data.length - 1];
        const isUnPaired = data.length % 2 !== 0;

        return (
          <div
            key={item.href}
            className={cn(
              isLast && isUnPaired ? "col-span-2 md:col-span-1" : "col-span-1",
            )}
          >
            <ServiceHomeItem item={item} />
          </div>
        );
      })}
    </section>
  );
};
