import Link from "next/link";

import { SectionContainer } from "@/components/home/SectionContainer";
import { BRAND_BLUE } from "@/components/home/data/home-data";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { cn } from "@/lib/utils";

import { VehiclesCarouselLayout } from "./VehiclesCarouselLayout";
import { VehiclesGridLayout } from "./VehiclesGridLayout";
import { SectionHeading } from "@/components/home/SectionHeading";

type VehiclesListingSectionProps = {
  title: {
    lead: string;
    highlight?: string;
  };
  vehicles: VehicleListItem[];
  variant: "grid" | "carousel";
  vehicleId?: string;
  total?: number;
  pageSize?: number;
  seeMoreHref?: string;
  seeMoreLabel?: string;
  className?: string;
};

export const VehiclesListingSection = ({
  title,
  vehicles,
  variant,
  vehicleId,
  total,
  pageSize = 4,
  seeMoreHref,
  seeMoreLabel = "Ver más",
  className,
}: VehiclesListingSectionProps) => {
  if (vehicles.length === 0) {
    return null;
  }

  const resolvedTotal = total ?? vehicles.length;

  return (
    <SectionContainer className={cn("", className)}>
      <SectionHeading
        lead={title.lead}
        highlight={title.highlight ?? ""}
      />
      {variant === "grid" ? (
        <VehiclesGridLayout vehicles={vehicles} />
      ) : (
        <VehiclesCarouselLayout
          initialVehicles={vehicles}
          vehicleId={vehicleId}
          total={resolvedTotal}
          pageSize={pageSize}
        />
      )}

      {seeMoreHref ? (
        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href={seeMoreHref}
            className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-xl px-12 text-base font-bold text-white transition-opacity hover:opacity-90 sm:min-w-[240px] sm:px-16"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            {seeMoreLabel}
          </Link>
        </div>
      ) : null}
    </SectionContainer>
  );
};
