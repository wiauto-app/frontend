"use client";

import { useState } from "react";
import {
  MapPin,
  ShieldCheck,
  Car,
  Building2,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { DealerListItem } from "../interfaces";
import { BRAND_BLUE } from "../constants";

type DealerTypeLabel = {
  oficial: string;
  multimarca: string;
  especialista: string;
};

const TYPE_LABELS: DealerTypeLabel = {
  oficial: "Concesionario oficial",
  multimarca: "Multimarca",
  especialista: "Especialista",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="size-3.5"
          viewBox="0 0 20 20"
          fill={i < Math.round(rating) ? "#FFB800" : "#E2E8F0"}
        >
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78L10 1z" />
        </svg>
      ))}
    </div>
  );
}

type DealerImageProps = {
  dealer: DealerListItem;
};

function DealerImage({ dealer }: DealerImageProps) {
  const [errored, setErrored] = useState(false);

  const initials = dealer.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (errored || !dealer.image) {
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
      src={dealer.image}
      alt={dealer.name}
      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setErrored(true)}
    />
  );
}

type ConcesionariaCardProps = {
  dealer: DealerListItem;
};

export function ConcesionariaCard({ dealer }: ConcesionariaCardProps) {
  const dealerHref = `/concesionaria/${dealer.slug}`;
  const country = dealer.location.country ?? "España";

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
          {dealer.isVerified && (
            <div
              className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold text-white shadow-sm"
              style={{ backgroundColor: BRAND_BLUE }}
            >
              <ShieldCheck className="size-3" />
              Verificado
            </div>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:flex-row sm:p-5">
          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="flex items-start gap-2">
              <Link
                href={dealerHref}
                className="flex min-w-0 items-center gap-1.5"
                id={`dealer-link-${dealer.id}`}
              >
                <h3 className="truncate text-lg font-extrabold uppercase tracking-wide text-slate-900 transition-colors group-hover:text-[#0061F2] sm:text-xl">
                  {dealer.name}
                </h3>
                {dealer.isVerified && (
                  <ShieldCheck
                    className="size-4 shrink-0"
                    style={{ color: BRAND_BLUE }}
                  />
                )}
              </Link>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Building2 className="size-3.5 shrink-0 text-slate-400" />
              <span>{TYPE_LABELS[dealer.type]}</span>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="size-3.5 shrink-0" style={{ color: BRAND_BLUE }} />
              <span>
                {dealer.location.city}, {country}
                {dealer.distance != null && (
                  <>
                    <span className="mx-1.5 text-slate-300">•</span>
                    A {dealer.distance} km
                  </>
                )}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StarRating rating={dealer.rating} />
              <span className="text-sm font-bold text-slate-800">
                {dealer.rating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">
                ({dealer.reviewCount} reseñas)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span
                className="inline-flex items-center gap-1 font-semibold"
                style={{ color: BRAND_BLUE }}
              >
                <Car className="size-3.5" />+{dealer.vehicleCount} vehículos
              </span>
              {dealer.services.map((svc) => (
                <span key={svc} className="inline-flex items-center gap-2">
                  <span className="text-slate-300">•</span>
                  {svc}
                </span>
              ))}
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
              <Button
                variant="outline"
                size="sm"
                className="min-w-[130px] rounded-lg border-[#0061F2]/40 text-xs font-semibold text-[#0061F2] hover:bg-[#0061F2] hover:text-white"
                id={`dealer-inventory-btn-${dealer.id}`}
              >
                <Link href={`/vehiculos?dealer=${dealer.slug}`}>
                  Ver inventario
                </Link>
              </Button>
              <Button
                size="sm"
                className="min-w-[130px] rounded-lg text-xs font-semibold text-white"
                style={{ backgroundColor: BRAND_BLUE }}
                id={`dealer-profile-btn-${dealer.id}`}
              >
                <Link href={dealerHref}>Ver perfil</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
