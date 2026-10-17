import Link from "next/link";
import { ArrowRight, Car } from "lucide-react";

import { cn } from "@/lib/utils";

interface MobileBrowseAllVehiclesCtaProps {
  className?: string;
}

/** Acceso directo al listado completo; visible solo en viewport móvil. */
export function MobileBrowseAllVehiclesCta({
  className,
}: MobileBrowseAllVehiclesCtaProps) {
  return (
    <Link
      href="/vehiculos"
      aria-label="Ver todos los vehículos"
      className={cn(
        "flex md:hidden flex-row gap-3 rounded-2xl bg-primary px-4 py-4 text-white transition-opacity hover:opacity-95 active:opacity-90",
        className,
      )}
    >
      <Car className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="inline-flex items-center gap-1.5 text-base font-semibold leading-snug">
          Ver todos los vehículos
          <ArrowRight className="size-4 shrink-0" aria-hidden />
        </span>
        <span className="text-sm font-normal leading-snug text-white/90">
          Explora todos los anuncios disponibles
        </span>
      </div>
    </Link>
  );
}
