"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock3, ExternalLink, Phone } from "lucide-react";

import { Profile } from "@/components/ui/profile";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/app/(public)/vehiculos/utils";
import type { VehicleDetailDealership } from "@/interfaces/vehicle.interface";
import type { DealershipScheduleDay } from "@/services/dealerships/types/dealership.types";
import { DEALERSHIP_WEEK_DAYS } from "@/services/dealerships/constants/dealership-week-days";
import { VehicleDetailCard } from "./VehicleDetailCard";
import { VehicleRefBadge } from "./vehicleRefBadge";

interface DealershipCardProps {
  dealership: VehicleDetailDealership;
  vehicleRef?: string | number | null;
}

interface ScheduleRow {
  dayId: number;
  name: string;
  shortName: string;
  slotsLabel: string;
  isOpen: boolean;
  isToday: boolean;
}

const getTodayWeekDayId = (): number => {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 7 : jsDay;
};

const normalizeTimeToHhMm = (value: string): string => {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) {
    return value;
  }
  return `${match[1].padStart(2, "0")}:${match[2]}`;
};

const buildScheduleRows = (
  schedules: DealershipScheduleDay[] | undefined,
): ScheduleRow[] => {
  const byDay = new Map(
    (schedules ?? []).map((schedule) => [schedule.day, schedule]),
  );
  const todayId = getTodayWeekDayId();

  return DEALERSHIP_WEEK_DAYS.map((weekDay) => {
    const openTimes = byDay.get(weekDay.id)?.open_times ?? [];
    const isOpen = openTimes.length > 0;

    return {
      dayId: weekDay.id,
      name: weekDay.name,
      shortName: weekDay.shortName,
      isOpen,
      isToday: weekDay.id === todayId,
      slotsLabel: isOpen
        ? openTimes
            .map(
              (slot) =>
                `${normalizeTimeToHhMm(slot.open_time)}–${normalizeTimeToHhMm(slot.close_time)}`,
            )
            .join(", ")
        : "Cerrado",
    };
  });
};

const hasConfiguredHours = (rows: ScheduleRow[]): boolean =>
  rows.some((row) => row.isOpen);

export const DealershipCard = ({
  dealership,
  vehicleRef,
}: DealershipCardProps) => {
  const scheduleRows = buildScheduleRows(dealership.schedules);
  const showHours = hasConfiguredHours(scheduleRows);
  const todayRow = scheduleRows.find((row) => row.isToday);
  const dealershipHref = `/concesionaria/${dealership.slug}`;

  return (
    <VehicleDetailCard
      title={
        <span className="flex w-full flex-wrap items-center justify-between gap-3">
          <span>Información del concesionario</span>
          {vehicleRef != null ? (
            <VehicleRefBadge vehicleRef={vehicleRef} />
          ) : null}
        </span>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col justify-between gap-5">
          <Profile
            name={dealership.name}
            description={dealership.description}
            avatar_url={dealership.avatar_url}
          />

          {showHours ? (
            <div className="rounded-xl border border-slate-200/80 bg-linear-to-br from-slate-50 via-white to-primary/4 p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock3 className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Horario de atención
                    </p>
                    <p className="text-xs text-slate-500">
                      {todayRow?.isOpen
                        ? `Hoy abierto · ${todayRow.slotsLabel}`
                        : "Hoy cerrado"}
                    </p>
                  </div>
                </div>
              </div>

              <ul className="space-y-1.5" aria-label="Horario semanal del concesionario">
                {scheduleRows.map((row) => (
                  <li
                    key={row.dayId}
                    className={cn(
                      "grid grid-cols-[1.4rem_1fr_auto] items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                      row.isToday && "bg-primary/8 ring-1 ring-primary/15",
                    )}
                  >
                    <span
                      className={cn(
                        "text-center text-[11px] font-bold uppercase tracking-wide",
                        row.isToday ? "text-primary" : "text-slate-400",
                      )}
                      aria-hidden
                    >
                      {row.shortName}
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        row.isToday ? "text-slate-900" : "text-slate-600",
                      )}
                    >
                      {row.name}
                      {row.isToday ? (
                        <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                          Hoy
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={cn(
                        "text-right tabular-nums",
                        row.isOpen
                          ? "font-medium text-slate-800"
                          : "text-slate-400",
                      )}
                    >
                      {row.slotsLabel}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500">
              El concesionario aún no ha publicado su horario de contacto.
            </p>
          )}

          <div className="flex flex-col gap-2">
            <Link
              href={dealershipHref}
              className={cn(buttonVariants(), "justify-center")}
              aria-label={`Ver más vehículos de ${dealership.name}`}
            >
              Más vehículos del concesionario
              <ExternalLink className="size-4" aria-hidden />
            </Link>
            {dealership.website_url ? (
              <a
                href={dealership.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "justify-center",
                )}
              >
                Sitio web
              </a>
            ) : null}
            {dealership.phone_code ? (
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Phone className="size-3.5" aria-hidden />
                Prefijo {dealership.phone_code}
              </p>
            ) : null}
          </div>
        </div>

        <div className="relative h-72 w-full overflow-hidden rounded-xl ring-1 ring-slate-200/80">
          <Image
            src={getImageUrl(dealership.banner_url ?? "")}
            unoptimized
            alt={`Banner de ${dealership.name}`}
            fill
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/70 via-slate-950/25 to-transparent p-4 pt-16">
            <p className="text-sm font-semibold text-white">{dealership.name}</p>
            {vehicleRef != null ? (
              <div className="pointer-events-auto mt-2">
                <VehicleRefBadge
                  vehicleRef={vehicleRef}
                  className="border-white/20 bg-white/10 text-white backdrop-blur-sm"
                  textClassName="text-white"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </VehicleDetailCard>
  );
};
