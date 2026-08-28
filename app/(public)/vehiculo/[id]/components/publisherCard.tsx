import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, Eye, MapPin, ShieldCheck, UserRound } from "lucide-react";

import { Profile } from "@/components/ui/profile";
import type { Publisher } from "@/interfaces/vehicle.interface";
import { VehicleDetailCard } from "./VehicleDetailCard";
import { VehicleRefBadge } from "./vehicleRefBadge";

interface PublisherCardProps {
  publisher: Publisher;
  vehicleRef?: number | null;
  createdAt?: string;
  views?: number;
  location?: string | null;
}

interface ListingDetailRow {
  id: string;
  label: string;
  value: string;
  icon: typeof CalendarDays;
}

const SAFETY_TIPS = [
  "Queda siempre en un lugar público y a plena luz del día.",
  "Revisa la documentación y el historial del vehículo antes de pagar.",
  "Desconfía de quien pida señales o transferencias por adelantado.",
];

const formatPublishedAgo = (createdAt: string): string | null => {
  const publishedAt = new Date(createdAt);
  if (Number.isNaN(publishedAt.getTime())) {
    return null;
  }

  return formatDistanceToNow(publishedAt, { addSuffix: true, locale: es });
};

export const PublisherCard = ({
  publisher,
  vehicleRef,
  createdAt,
  views,
  location,
}: PublisherCardProps) => {
  const publishedAgo = createdAt ? formatPublishedAgo(createdAt) : null;

  const detailRows: ListingDetailRow[] = [];

  if (publishedAgo) {
    detailRows.push({
      id: "published",
      label: "Publicado",
      value: publishedAgo,
      icon: CalendarDays,
    });
  }

  if (typeof views === "number") {
    detailRows.push({
      id: "views",
      label: "Visitas",
      value: new Intl.NumberFormat("es-ES").format(views),
      icon: Eye,
    });
  }

  if (location) {
    detailRows.push({
      id: "location",
      label: "Ubicación",
      value: location,
      icon: MapPin,
    });
  }

  return (
    <VehicleDetailCard
      title={
        <span className="flex w-full flex-wrap items-center justify-between gap-3">
          <span>Información del vendedor</span>
          {vehicleRef != null ? (
            <VehicleRefBadge vehicleRef={vehicleRef} />
          ) : null}
        </span>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <Profile
              name={publisher.name}
              description="Vendedor particular"
              avatar_url={publisher.avatar_url ?? undefined}
            />
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              <UserRound className="size-3.5" aria-hidden />
              Particular
            </span>
          </div>

          {detailRows.length > 0 ? (
            <dl className="rounded-xl border border-slate-200/80 bg-linear-to-br from-slate-50 via-white to-primary/4 p-4">
              {detailRows.map((row) => (
                <div
                  key={row.id}
                  className="flex items-start justify-between gap-3 py-1.5 text-sm"
                >
                  <dt className="flex shrink-0 items-center gap-2 text-slate-500">
                    <row.icon className="size-4 text-primary" aria-hidden />
                    {row.label}
                  </dt>
                  <dd className="min-w-0 text-right font-medium text-slate-800">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-linear-to-br from-slate-50 via-white to-primary/4 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                Compra segura entre particulares
              </p>
              <p className="text-xs text-slate-500">
                Este anuncio lo gestiona una persona, no un concesionario.
              </p>
            </div>
          </div>

          <ul className="space-y-2">
            {SAFETY_TIPS.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60"
                  aria-hidden
                />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </VehicleDetailCard>
  );
};
