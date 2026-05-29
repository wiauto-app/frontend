"use client";

import Link from "next/link";
import { Camera, Heart, MoreVertical, Share2 } from "lucide-react";
import { useState } from "react";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { BRAND_BLUE, BRAND_BLUE_LIGHT } from "../constants";
import {
  formatPrice,
  getFinancedPrice,
  getImageUrl,
  getVehicleBadge,
  getVehicleModelName,
  getVehicleTags,
} from "../utils";

type VehicleListCardProps = {
  vehicle: VehicleListItem;
};

export function VehicleListCard({ vehicle }: VehicleListCardProps) {
  const [saved, setSaved] = useState(false);
  const [compare, setCompare] = useState(false);
  const imageUrl = getImageUrl(vehicle.images);
  const photoCount = vehicle.images?.length ?? 0;
  const financedPrice = getFinancedPrice(vehicle);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col md:flex-row">
        <Link
          href={`/vehiculo/${vehicle.id}`}
          className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-100 md:aspect-auto md:w-72 lg:w-80"
        >
          <img src={imageUrl} alt={vehicle.title} className="size-full object-cover" />
          {photoCount > 0 && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-black/45 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Camera className="size-3.5" aria-hidden />
              {photoCount}
            </span>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: BRAND_BLUE }}>
                  {getVehicleBadge(vehicle)}
                </p>
                <Link
                  href={`/vehiculo/${vehicle.id}`}
                  className="mt-1 block text-xl font-bold text-slate-900 hover:text-[#0061F2]"
                >
                  {getVehicleModelName(vehicle)}
                </Link>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSaved(!saved)}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                  aria-label="Guardar"
                >
                  <Heart className={`size-4 ${saved ? "fill-red-500 text-red-500" : ""}`} />
                </button>
                <button
                  type="button"
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                  aria-label="Compartir"
                >
                  <Share2 className="size-4" />
                </button>
                <button
                  type="button"
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                  aria-label="Más opciones"
                >
                  <MoreVertical className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
              <div>
                <p className="text-xs font-medium text-red-500">Precio justo</p>
                <p className="text-2xl font-bold text-slate-900">{formatPrice(vehicle.price)}</p>
              </div>
              {financedPrice && (
                <div>
                  <p className="text-xs font-medium text-slate-500">Precio financiado</p>
                  <p className="text-lg font-bold text-slate-900">{financedPrice}</p>
                </div>
              )}
            </div>

            {vehicle.warranty_type && (
              <p className="text-sm text-slate-500">
                Garantía {vehicle.warranty_type.name} - IGIC incluido
              </p>
            )}

            <ul className="flex flex-wrap gap-2">
              {getVehicleTags(vehicle).map((tag) => (
                <li key={tag}>
                  <span
                    className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ backgroundColor: BRAND_BLUE_LIGHT, color: BRAND_BLUE }}
                  >
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5"
            style={{ backgroundColor: BRAND_BLUE_LIGHT }}
          >
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={compare}
                onChange={(e) => setCompare(e.target.checked)}
                className="size-4 rounded border-slate-300 text-[#0061F2] focus:ring-[#0061F2]"
              />
              Comparar
            </label>
            <p className="text-xs text-slate-500 sm:text-sm">
              * Sin entrada - 84 meses - Ver ejemplo TAE 9,61%
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
