"use client";

import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import {
  formatPrice,
  getImageUrl,
  getVehicleDisplayName,
  getVehicleUrl,
} from "../utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { VehicleFavoriteButton } from "./VehicleFavoriteButton";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface VehicleGridCardProps {
  vehicle: VehicleListItem;
  interactive?: boolean;
}

export const VehicleGridCard = ({
  vehicle,
  interactive = false,
}: VehicleGridCardProps) => {
  const imageUrl = getImageUrl(vehicle.images[0]?.url ?? "");
  const displayName = getVehicleDisplayName(vehicle);
  const vehicleUrl = getVehicleUrl(vehicle.id);

  if (interactive) {
    return (
      <Card className="relative gap-2 pt-0 transition-shadow hover:shadow-md">
        <Link
          href={vehicleUrl}
          prefetch={false}
          className="absolute inset-0 z-0 rounded-xl"
          aria-label={`Ver detalle de ${displayName}`}
        />
        <CardHeader className="relative aspect-square pt-0">
          <div className="pointer-events-auto absolute top-2 right-2 z-10">
            <VehicleFavoriteButton
              vehicleId={vehicle.id}
              className="rounded-full bg-white"
            />
          </div>
          <Image
            unoptimized
            src={imageUrl}
            alt={displayName}
            fill
            className="object-cover"
          />
        </CardHeader>
        <CardContent className="pointer-events-none relative z-[1] p-2">
          <p className="text-base font-bold text-slate-900">{displayName}</p>
          <p className="text-sm text-muted-foreground">{vehicle.mileage} km</p>
          <p className="text-base font-bold">{formatPrice(vehicle.price)}</p>
          <p className="text-sm text-muted-foreground">
            {vehicle.publisher_type}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-2 pt-0">
      <CardHeader className="relative aspect-square pt-0">
        <div className="absolute top-2 right-2 z-10">
          <VehicleFavoriteButton
            vehicleId={vehicle.id}
            className="rounded-full bg-white"
          />
        </div>
        <Image
          unoptimized
          src={imageUrl}
          alt={displayName}
          fill
          className="object-cover"
        />
      </CardHeader>
      <CardContent className="p-2">
        <Link
          href={vehicleUrl}
          className={cn("text-base font-bold text-slate-900")}
        >
          {displayName}
        </Link>
        <p className="text-sm text-muted-foreground">{vehicle.mileage} km</p>
        <p className="text-base font-bold">{formatPrice(vehicle.price)}</p>
        <p className="text-sm text-muted-foreground">
          {vehicle.publisher_type}
        </p>
      </CardContent>
    </Card>
  );
};
