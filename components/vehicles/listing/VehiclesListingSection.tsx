import Link from "next/link";

import { SectionContainer } from "@/components/home/SectionContainer";
import { MotionSection, riseUp } from "@/components/home/motion";
import { SectionHeading } from "@/components/home/SectionHeading";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { VehiclesCarouselLayout } from "./VehiclesCarouselLayout";
import { VehiclesGridLayout } from "./VehiclesGridLayout";

interface VehiclesListingSectionProps {
  title: {
    lead: string;
    highlight?: string;
  };
  vehicles: VehicleListItem[];
  variant: "grid" | "carousel";
  cardVariant?: "default" | "featured";
  vehicleId?: string;
  total?: number;
  pageSize?: number;
  seeMoreHref?: string;
  seeMoreLabel?: string;
  className?: string;
  animated?: boolean;
}

export const VehiclesListingSection = ({
  title,
  vehicles,
  variant,
  cardVariant = "default",
  vehicleId,
  total,
  pageSize = 4,
  seeMoreHref,
  seeMoreLabel = "Ver más",
  className,
  animated = false,
}: VehiclesListingSectionProps) => {
  if (vehicles?.length === 0) {
    return null;
  }

  const resolvedTotal = total ?? vehicles.length;

  const listingLayout =
    variant === "grid" ? (
      <VehiclesGridLayout vehicles={vehicles} cardVariant={cardVariant} />
    ) : (
      <VehiclesCarouselLayout
        initialVehicles={vehicles}
        vehicleId={vehicleId}
        total={resolvedTotal}
        pageSize={pageSize}
      />
    );

  return (
    <SectionContainer className={cn("", className)}>
      <SectionHeading
        lead={title.lead}
        highlight={title.highlight ?? ""}
        animated={animated}
      />
      {animated && variant === "carousel" ? (
        <MotionSection variants={riseUp}>{listingLayout}</MotionSection>
      ) : (
        listingLayout
      )}

      {seeMoreHref ? (
        <div className="mt-10 flex justify-center sm:mt-12">
          <Link href={seeMoreHref}>
            <Button>{seeMoreLabel}</Button>
          </Link>
        </div>
      ) : null}
    </SectionContainer>
  );
};
