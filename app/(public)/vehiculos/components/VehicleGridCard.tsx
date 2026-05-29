"use client";

import Link from "next/link";
import { Camera } from "lucide-react";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { BRAND_BLUE, BRAND_BLUE_LIGHT } from "../constants";
import {
  formatPrice,
  getImageUrl,
  getVehicleBadge,
  getVehicleModelName,
  getVehicleTags,
} from "../utils";

type VehicleGridCardProps = {
  vehicle: VehicleListItem;
};

export function VehicleGridCard({ vehicle }: VehicleGridCardProps) {
  const imageUrl = getImageUrl(vehicle.images);
  const photoCount = vehicle.images?.length ?? 0;

  return (
    <Link
      href={`/vehiculo/${vehicle.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_8px_28px_rgba(15,23,42,0.12)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={vehicle.title}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {photoCount > 0 && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-black/45 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Camera className="size-3.5" aria-hidden />
            {photoCount}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <p
          className="text-[11px] font-bold uppercase tracking-wide sm:text-xs"
          style={{ color: BRAND_BLUE }}
        >
          {getVehicleBadge(vehicle)}
        </p>

        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl">{getVehicleModelName(vehicle)}</h3>
          <p className="shrink-0 text-lg font-bold text-slate-900 sm:text-xl">
            {formatPrice(vehicle.price)}
          </p>
        </div>

        <ul className="mt-auto flex flex-wrap gap-2">
          {getVehicleTags(vehicle).map((tag) => (
            <li key={tag}>
              <span
                className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold sm:text-xs"
                style={{ backgroundColor: BRAND_BLUE_LIGHT, color: BRAND_BLUE }}
              >
                {tag}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
