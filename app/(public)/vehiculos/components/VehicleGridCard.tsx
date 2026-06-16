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

type VehicleGridCardProps = {
  vehicle: VehicleListItem;
};

export function VehicleGridCard({ vehicle }: VehicleGridCardProps) {
  const imageUrl = getImageUrl(vehicle.images[0]?.url ?? "");
  const displayName = getVehicleDisplayName(vehicle);

  return (
    <Card className="pt-0 gap-2">
      <CardHeader className="relative aspect-square pt-0">
        <div className="absolute top-2 right-2 z-10">
          <VehicleFavoriteButton
            vehicleId={vehicle.id}
            className="bg-white rounded-full"
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
        <Link href={getVehicleUrl(vehicle.id)} className="text-base font-bold text-slate-900">{displayName}</Link>
        <p className="text-sm text-muted-foreground">{vehicle.mileage} km</p>
        <p className="font-bold text-base">{formatPrice(vehicle.price)}</p>
        <p className="text-sm text-muted-foreground">
          {vehicle.publisher_type}
        </p>
      </CardContent>
    </Card>
  );
}
