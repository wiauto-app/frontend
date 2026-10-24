"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { useVehicleImpressionTracker } from "@/components/vehicles/hooks/useVehicleImpressionTracker";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
import { cn } from "@/lib/utils";

import { formatPrice, getImageUrl, getVehicleUrl } from "../utils";
import { VehicleFavoriteButton } from "./VehicleFavoriteButton";
import { Button } from "@/components/ui/button";
import { getVehicleImageTransitionName } from "@/components/view-transitions/vehicle-image-transition-name";
import { ViewTransition } from "react";

interface VehicleFeaturedCardProps {
  vehicle: VehicleListItem;
  className?: string;
  /** En el catálogo el título de la tarjeta cuelga del H1 de la página. */
  titleAs?: "h2" | "h3";
}

const FEATURED_IMAGE_SIZES = `
  (max-width: 640px) 100vw,
  (max-width: 1024px) 50vw,
  (max-width: 1536px) 33vw,
  25vw
`;

export const VehicleFeaturedCard = ({
  vehicle,
  className,
  titleAs = "h3",
}: VehicleFeaturedCardProps) => {
  const TitleTag = titleAs;
  const displayName = getVehicleDisplayName(vehicle);
  const vehicleUrl = getVehicleUrl(vehicle.id);
  const imageUrl = getImageUrl(vehicle.images?.[0]?.url ?? "");
  const isProfessional =
    vehicle.publisher_type === "dealership" || Boolean(vehicle.dealership);
  const impressionRef = useVehicleImpressionTracker<HTMLDivElement>(vehicle.id);

  return (
    <Card
      ref={impressionRef}
      className={cn(
        "col-span-2 group relative h-full  gap-0 overflow-hidden rounded-[20px] border-none bg-[#061936] p-0 shadow-none ring-0",
        className,
      )}
    >
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-200">
        <ViewTransition
          name={getVehicleImageTransitionName(vehicle.id)}
          share="morph"
          default="none"
        >
          <span className="absolute inset-0 block">
            <Image
              src={imageUrl}
              alt={`Imagen del vehículo ${displayName}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              quality={80}
              sizes={FEATURED_IMAGE_SIZES}
            />
          </span>
        </ViewTransition>
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-[#061936] via-[#061936]/80 to-transparent"
        />
      </div>

      <div className="relative z-10 flex h-full flex-col gap-2.5 px-4 pt-2 pb-4">
        <div className="flex items-center justify-between gap-2">
          <TitleTag
            title={displayName}
            className="max-w-[min(100%,15.5rem)] truncate text-lg font-extrabold text-white"
          >
            {displayName}
          </TitleTag>
          <div className="pointer-events-auto relative z-20 shrink-0">
            <VehicleFavoriteButton
              vehicleId={vehicle.id}
              className="size-9 rounded-full bg-white shadow-sm"
            />
          </div>
        </div>

        <p className="text-[28px] leading-8 font-black text-white">
          {formatPrice(vehicle.price)}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <div className="flex min-w-0 items-center gap-1">
            {isProfessional ? (
              <span className="text-xs font-bold text-white">
                ◈ Profesional
              </span>
            ) : (
              <span className="text-xs font-bold text-white">Particular</span>
            )}
          </div>
          <Link href={vehicleUrl} prefetch transitionTypes={["nav-forward"]}>
            <Button variant="outline" size="sm" className="text-primary rounded-full">
              Ver anuncio <ChevronRight />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
