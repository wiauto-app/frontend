"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { BRAND_BLUE, BRAND_BLUE_LIGHT } from "../constants";
import {
  formatPrice,
  getFinancedPrice,
  getVehicleBadge,
  getVehicleDisplayName,
  getVehicleModelName,
  getVehicleTags,
} from "../utils";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { VehicleFavoriteButton } from "./VehicleFavoriteButton";
import { VehicleImageCarousel } from "./VehicleImageCarousel";
import { VehicleShareButton } from "./VehicleShareButton";
import { Button } from "@/components/ui/button";

type VehicleListCardProps = {
  vehicle: VehicleListItem;
};

export function VehicleListCard({ vehicle }: VehicleListCardProps) {
  const [compare, setCompare] = useState(false);
  const financedPrice = getFinancedPrice(vehicle);
  const vehicleHref = `/vehiculo/${vehicle.id}`;
  const displayName = getVehicleDisplayName(vehicle);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col md:flex-row">
        <VehicleImageCarousel
          images={vehicle.images ?? []}
          alt={displayName}
          href={vehicleHref}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: BRAND_BLUE }}>
                  {getVehicleBadge(vehicle)}
                </p>
                <Link
                  href={vehicleHref}
                  className="mt-1 block text-xl font-bold text-slate-900 hover:text-[#0061F2]"
                >
                  {getVehicleModelName(vehicle)}
                </Link>
              </div>

              <div className="flex items-center gap-1">
                <VehicleFavoriteButton vehicleId={vehicle.id} />
                <VehicleShareButton
                  vehicleId={vehicle.id}
                  vehicleTitle={displayName}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  aria-label="Más opciones"
                >
                  <MoreVertical className="size-4" />
                </Button>
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
            <div className="flex items-center gap-2 cursor-pointer text-slate-700">
              <Checkbox
                id="compare-checkbox"
                checked={compare}
                onCheckedChange={(checked) => setCompare(checked)}
              />
              <Label htmlFor="compare-checkbox">Comparar</Label>
            </div>
            <p className="text-xs text-slate-500 sm:text-sm">
              * Sin entrada - 84 meses - Ver ejemplo TAE 9,61%
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
