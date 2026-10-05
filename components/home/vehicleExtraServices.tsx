"use client";

import { cn } from "@/lib/utils";

import {
  EXTRA_SERVICES_DATA,
  EXTRA_SERVICES_DATA_2,
} from "./constants/extraServices.constants";
import { MotionSection, MotionHoverCard } from "./motion";
import {
  staggerContainerExpressive,
  staggerItemPop,
} from "./motion/motion-variants";
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
    <MotionSection
      className={cn(
        "grid w-full gap-3 md:gap-8 grid-cols-2 lg:grid-cols-5",
        className,
      )}
      variants={staggerContainerExpressive}
      amount={0.15}
    >
      {data.map((item) => {
        const isLast = item === data[data.length - 1];
        const isUnPaired = data.length % 2 !== 0;

        return (
          <MotionHoverCard
            key={item.href}
            variants={staggerItemPop}
            className={cn(
              isLast && isUnPaired ? "col-span-2 md:col-span-1" : "col-span-1",
            )}
          >
            <ServiceHomeItem item={item} />
          </MotionHoverCard>
        );
      })}
    </MotionSection>
  );
};
