"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BRAND_BLUE, BRAND_BLUE_LIGHT } from "@/app/(public)/concesionarias/constants";
import { formatPrice } from "@/app/(public)/vehiculos/utils";
import { Vehicle } from "@/interfaces/vehicle.interface";
import { getImageUrl } from "@/lib/utils";

type DealerVehicleCardProps = {
  vehicle: Vehicle;
};

export function DealerVehicleCard({ vehicle }: DealerVehicleCardProps) {
  const [favorite, setFavorite] = useState(false);
  const primaryImageUrl = vehicle.images[0]?.url
    ? getImageUrl(vehicle.images[0].url)
    : null;
  const makeName = vehicle.version.make.name;
  const modelName = vehicle.version.model.name;
  const imageCount = vehicle.images.length;
  const tags = vehicle.features.slice(0, 3).map((feature) => feature.name);

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-100 pt-0 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {primaryImageUrl ? (
          <img
            src={primaryImageUrl}
            alt={`${makeName} ${modelName}`}
            className="size-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div
            className="flex size-full items-center justify-center text-sm font-semibold text-white"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            Sin imagen
          </div>
        )}

        <button
          type="button"
          aria-label="Guardar vehículo"
          onClick={() => setFavorite((prev) => !prev)}
          className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-slate-500 shadow-sm transition-colors hover:text-red-500"
        >
          <Heart
            className="size-4"
            fill={favorite ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        </button>

        {imageCount > 0 ? (
          <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white">
            1/{imageCount}
          </span>
        ) : null}
      </div>

      <CardContent className="space-y-2 p-4">
        <Link href={`/vehiculo/${vehicle.id}`} className="block">
          <p
            className="text-[11px] font-bold uppercase tracking-wide"
            style={{ color: BRAND_BLUE }}
          >
            {vehicle.condition === "new" ? "New " : ""}
            {makeName}
          </p>
          <p className="text-base font-bold text-slate-900">{modelName}</p>
        </Link>
        <p className="text-lg font-extrabold text-slate-900">
          {formatPrice(vehicle.price)}
        </p>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                style={{ backgroundColor: BRAND_BLUE_LIGHT, color: BRAND_BLUE }}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
