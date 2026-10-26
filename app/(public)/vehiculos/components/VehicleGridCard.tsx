"use client";

import Image from "next/image";
import Link from "next/link";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useVehicleImpressionTracker } from "@/components/vehicles/hooks/useVehicleImpressionTracker";
import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
import { formatPrice, getImageUrl, getVehicleUrl } from "../utils";
import { getVehicleImageTransitionName } from "@/components/view-transitions/vehicle-image-transition-name";
import { VehicleFavoriteButton } from "./VehicleFavoriteButton";
import { VehicleFinancingFrom } from "./VehicleFinancingFrom";
import { ViewTransition } from "react";
interface VehicleGridCardProps {
  vehicle: VehicleListItem;
  interactive?: boolean;
  footer?: React.ReactNode;
  onDismissed?: (vehicleId: string) => void;
  className?: string;
  /** En el catálogo el título de la tarjeta cuelga del H1 de la página. */
  titleAs?: "h2" | "h3";
  priority?: boolean;
}

interface VehicleGridCardBadgesProps {
  vehicle: VehicleListItem;
}

interface VehicleGridCardBodyProps {
  vehicle: VehicleListItem;
  displayName: string;
  interactive: boolean;
  titleAs: "h2" | "h3";
}

const VEHICLE_GRID_IMAGE_SIZES =
  "(max-width: 767px) 50vw, min(100vw, 320px)";

const VehicleGridCardBadges = ({ vehicle }: VehicleGridCardBadgesProps) => {
  if (!vehicle.is_premium) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute top-2 left-2 z-10 flex max-w-[70%] flex-wrap gap-1.5">
      <span className="rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase shadow-sm">
        Profesional
      </span>
    </div>
  );
};

const VehicleGridCardBody = ({
  vehicle,
  displayName,
  interactive,
  titleAs,
}: VehicleGridCardBodyProps) => {
  const TitleTag = titleAs;

  return (
    <CardContent
      className={cn(
        "relative z-1 flex flex-col gap-1 px-2.5 pb-0",
        interactive && "pointer-events-none",
      )}
    >
      <TitleTag
        title={displayName}
        className="truncate text-base leading-snug font-bold text-slate-900"
      >
        {displayName}
      </TitleTag>

      <p className="text-2xl font-bold tracking-tight text-primary">
        {formatPrice(vehicle.price)}
      </p>
      <VehicleFinancingFrom offer={vehicle.financing_offer} />
    </CardContent>
  );
};

export const VehicleGridCard = ({
  vehicle,
  interactive = false,
  footer,
  className,
  titleAs = "h3",
  priority = false,
}: VehicleGridCardProps) => {
  const imageUrl = getImageUrl(vehicle.images[0]?.url ?? "");
  const displayName = getVehicleDisplayName(vehicle);
  const vehicleUrl = getVehicleUrl(vehicle.id);
  const impressionRef = useVehicleImpressionTracker<HTMLDivElement>(vehicle.id);
  return (
    <ViewTransition update="auto" default="none">
      <Card
        ref={impressionRef}
        className={cn(
          "group relative gap-2 overflow-hidden border-none  pt-0 shadow-none ring-0 transition-shadow duration-200  pb-3 rounded-2xl h-full",
          className,
        )}
      >
        <Link
          href={vehicleUrl}
          prefetch
          transitionTypes={["nav-forward"]}
          className="absolute inset-0 z-0 rounded-xl"
          aria-hidden
          tabIndex={-1}
        />

        <CardHeader className="pointer-events-none relative aspect-video overflow-hidden p-0 pt-0">
          <div className="pointer-events-auto absolute top-2 right-2 z-10 flex items-center gap-1">
            <VehicleFavoriteButton
              vehicleId={vehicle.id}
              className="rounded-full bg-white shadow-sm"
            />
          </div>

          <VehicleGridCardBadges vehicle={vehicle} />

          <ViewTransition
            name={getVehicleImageTransitionName(vehicle.id)}
            share="morph"
            default="none"
          >
            <picture className="absolute inset-0 block">
              <Image
                src={imageUrl}
                alt=""
                fill
                priority={priority}
                fetchPriority={priority ? "high" : "auto"}
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                quality={70}
                sizes={VEHICLE_GRID_IMAGE_SIZES}
              />
            </picture>
          </ViewTransition>
        </CardHeader>
        <Link href={vehicleUrl} prefetch transitionTypes={["nav-forward"]}>
          <VehicleGridCardBody
            vehicle={vehicle}
            displayName={displayName}
            interactive={interactive}
            titleAs={titleAs}
          />
          {footer ? (
            <CardFooter className="relative z-10 pointer-events-auto px-2.5 pb-0">
              {footer}
            </CardFooter>
          ) : null}
        </Link>
      </Card>
    </ViewTransition>
  );
};
