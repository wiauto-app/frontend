"use client";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const VehicleExtraServices = dynamic(
  () =>
    import("@/components/home/vehicleExtraServices").then(
      (mod) => mod.VehicleExtraServices,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid w-full gap-3 md:gap-8 grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-91 lg:h-56" />
        ))}
      </div>
    ),
  },
);

export const LazyExtraServices = () => {
  return <VehicleExtraServices />;
};
