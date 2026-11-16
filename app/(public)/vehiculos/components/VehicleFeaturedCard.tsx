"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ViewTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { useVehicleImpressionTracker } from "@/components/vehicles/hooks/useVehicleImpressionTracker";
import { getVehicleImageTransitionName } from "@/components/view-transitions/vehicle-image-transition-name";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
import { isNoVehicleImageFileKey } from "@/lib/vehicles/no-vehicle-image";
import { cn } from "@/lib/utils";

import { formatPrice, getImageUrl, getVehicleUrl } from "../utils";
import { VehicleFavoriteButton } from "./VehicleFavoriteButton";
import { VehicleFinancingFrom } from "./VehicleFinancingFrom";
import { VehicleGridCardBadges } from "./vehicleGridCardBadges";

interface VehicleFeaturedCardProps {
  vehicle: VehicleListItem;
  className?: string;
  /** En el catálogo el título de la tarjeta cuelga del H1 de la página. */
  titleAs?: "h2" | "h3";
  priority?: boolean;
}

const FEATURED_IMAGE_SIZES =
  "(max-width: 639px) 88vw, (max-width: 1023px) 50vw, 33vw";

export const VehicleFeaturedCard = ({
  vehicle,
  className,
  titleAs = "h3",
  priority = false,
}: VehicleFeaturedCardProps) => {
  const TitleTag = titleAs;
  const primaryImageKey = vehicle.images?.[0]?.url ?? "";
  const imageUrl = getImageUrl(primaryImageKey);
  const isPlaceholderImage = isNoVehicleImageFileKey(primaryImageKey);
  const displayName = getVehicleDisplayName(vehicle);
  const vehicleUrl = getVehicleUrl(vehicle.id);
  const impressionRef = useVehicleImpressionTracker<HTMLDivElement>(vehicle.id);

  return (
    <ViewTransition update="auto" default="none">
      <Card
        ref={impressionRef}
        className={cn(
          "group relative h-full  overflow-hidden rounded-2xl border-none p-0 pt-0 pb-0 shadow-none ring-0 gap-0",
          className,
        )}
      >
        <Link
          href={vehicleUrl}
          prefetch
          transitionTypes={["nav-forward"]}
          className="absolute inset-0 z-0 rounded-2xl"
          aria-label={`Ver anuncio de ${displayName}`}
          tabIndex={-1}
        />
        <VehicleGridCardBadges vehicle={vehicle} />

        <CardHeader className="pointer-events-none relative aspect-video overflow-hidden rounded-none bg-slate-100 p-0">
          <div className="pointer-events-auto absolute top-2 right-2 z-10">
            <VehicleFavoriteButton
              vehicleId={vehicle.id}
              className="rounded-full bg-white shadow-sm"
            />
          </div>

          <ViewTransition
            name={getVehicleImageTransitionName(vehicle.id)}
            share="morph"
            default="none"
          >
            <picture className="absolute inset-0 block">
              <Image
                src={imageUrl}
                alt={`Imagen del vehículo ${displayName}`}
                fill
                priority={priority}
                fetchPriority={priority ? "high" : "auto"}
                className={cn(
                  isPlaceholderImage
                    ? "object-contain"
                    : "object-cover transition-transform duration-300 group-hover:scale-[1.03]",
                )}
                quality={70}
                sizes={FEATURED_IMAGE_SIZES}
              />
            </picture>
          </ViewTransition>
        </CardHeader>

        <div className="relative z-10 mt-auto flex flex-col gap-2.5 bg-primary px-2.5 py-3 text-white">
          <TitleTag
            title={displayName}
            className="truncate text-base leading-snug font-bold text-white"
          >
            {displayName}
          </TitleTag>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xl leading-tight font-bold tracking-tight text-white">
                {formatPrice(vehicle.price)}
              </p>
              <VehicleFinancingFrom offer={vehicle.financing_offer} tone="dark" />
            </div>

            <Button
              nativeButton={false}
              variant="outline"
              size="sm"
              render={
                <Link
                  href={vehicleUrl}
                  prefetch
                  transitionTypes={["nav-forward"]}
                />
              }
              className="shrink-0 rounded-full border-white bg-white text-primary hover:bg-white/90 hover:text-primary"
            >
              Ver anuncio
              <ChevronRight />
            </Button>
          </div>
        </div>
      </Card>
    </ViewTransition>
  );
};
