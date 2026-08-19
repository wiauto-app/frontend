"use client";

import { useState } from "react";
import { MapPin, ShieldCheck, Car, Heart, MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/utils";
import type { DealershipListItem } from "@/services/dealerships/types/dealership.types";
import { BRAND_BLUE } from "../constants";

function StarRating({ rating }: { rating: number | null }) {
  const value = rating ?? 0;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="size-3.5"
          viewBox="0 0 20 20"
          fill={i < Math.round(value) ? "#FFB800" : "#E2E8F0"}
        >
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78L10 1z" />
        </svg>
      ))}
    </div>
  );
}

type DealerImageProps = {
  dealer: DealershipListItem;
};

function DealerImage({ dealer }: DealerImageProps) {
  const [errored, setErrored] = useState(false);
  const imageUrl = dealer.banner_url ?? dealer.avatar_url ?? null;

  const initials = dealer.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (errored || !imageUrl) {
    return (
      <div
        className="flex size-full items-center justify-center text-2xl font-bold text-white"
        style={{
          background: `linear-gradient(135deg, ${BRAND_BLUE} 0%, #0050c8 100%)`,
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={getImageUrl(imageUrl)}
      alt={dealer.name}
      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setErrored(true)}
    />
  );
}

type ConcesionariaCardProps = {
  dealer: DealershipListItem;
  onReview: (dealer: DealershipListItem) => void;
};

export function ConcesionariaCard({ dealer, onReview }: ConcesionariaCardProps) {
  const dealerHref = `/concesionaria/${dealer.slug}`;

  return (
    <article
      className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
      id={`dealer-card-${dealer.id}`}
    >
      <div className="flex flex-col md:flex-row">
        <Link
          href={dealerHref}
          className="relative block shrink-0 overflow-hidden bg-slate-100 md:w-52 lg:w-60"
          style={{ minHeight: "176px" }}
          tabIndex={-1}
        >
          <DealerImage dealer={dealer} />
          {dealer.is_featured && (
            <div
              className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold text-white shadow-sm"
              style={{ backgroundColor: BRAND_BLUE }}
            >
              <ShieldCheck className="size-3" />
              Destacado
            </div>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:flex-row sm:p-5">
          <div className="min-w-0 flex-1 space-y-2.5">
            <Link
              href={dealerHref}
              className="flex min-w-0 items-center gap-1.5"
              id={`dealer-link-${dealer.id}`}
            >
              <h3 className="truncate text-lg font-extrabold uppercase tracking-wide text-slate-900 transition-colors group-hover:text-[#0061F2] sm:text-xl">
                {dealer.name}
              </h3>
            </Link>

            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="size-3.5 shrink-0" style={{ color: BRAND_BLUE }} />
              <span>
                {dealer.address}
                {dealer.distance != null && dealer.distance > 0 && (
                  <>
                    <span className="mx-1.5 text-slate-300">•</span>A{" "}
                    {(dealer.distance / 1000).toFixed(1)} km
                  </>
                )}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StarRating rating={dealer.rating} />
              {dealer.rating != null && (
                <span className="text-sm font-bold text-slate-800">
                  {dealer.rating.toFixed(1)}
                </span>
              )}
              <span className="text-xs text-slate-400">
                ({dealer.reviews_count} reseñas)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span
                className="inline-flex items-center gap-1 font-semibold"
                style={{ color: BRAND_BLUE }}
              >
                <Car className="size-3.5" />
                {dealer.vehicles_count != null && dealer.vehicles_count > 0
                  ? `+${dealer.vehicles_count} vehículos`
                  : "Sin vehículos publicados"}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-start">
            <button
              type="button"
              aria-label={`Guardar ${dealer.name}`}
              className="order-2 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 sm:order-1"
              id={`dealer-favorite-${dealer.id}`}
            >
              <Heart className="size-5" strokeWidth={1.5} />
            </button>

            <div className="order-1 flex gap-2 sm:order-2 sm:flex-col sm:gap-2">
              <button
                type="button"
                onClick={() => onReview(dealer)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "min-w-[130px] rounded-lg border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#0061F2]/40 hover:bg-[#EBF2FF] hover:text-[#0061F2]",
                )}
                id={`dealer-review-btn-${dealer.id}`}
              >
                <MessageSquarePlus className="size-3.5" />
                Dejar reseña
              </button>
              <Link
                href={`/vehiculos?dealer=${dealer.slug}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "min-w-[130px] rounded-lg border-[#0061F2]/40 text-xs font-semibold text-[#0061F2] hover:bg-[#0061F2] hover:text-white",
                )}
                id={`dealer-inventory-btn-${dealer.id}`}
              >
                Ver inventario
              </Link>
              <Link
                href={dealerHref}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "min-w-[130px] rounded-lg text-xs font-semibold text-white",
                )}
                style={{ backgroundColor: BRAND_BLUE }}
                id={`dealer-profile-btn-${dealer.id}`}
              >
                Ver perfil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
