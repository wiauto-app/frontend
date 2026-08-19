import { Car, MessageSquareText, CalendarDays } from "lucide-react";
import { BRAND_BLUE } from "@/app/(public)/concesionarias/constants";
import type { DealerQuickStats } from "../interfaces";
import { Card, CardContent } from "@/components/ui/card";

type DealerQuickStatsBarProps = {
  stats: DealerQuickStats;
};

const formatTimeOnPlatform = (
  value: { years: number; months: number } | undefined,
): string => {
  if (!value) return "";

  const parts: string[] = [];

  if (value.years > 0) {
    parts.push(`${value.years} ${value.years === 1 ? "año" : "años"}`);
  }

  if (value.months > 0) {
    parts.push(`${value.months} ${value.months === 1 ? "mes" : "meses"}`);
  }

  return parts.length > 0 ? parts.join(" y ") : "Menos de 1 mes";
};

export function DealerQuickStatsBar({ stats }: DealerQuickStatsBarProps) {
  const items = [
    {
      key: "publishedVehicles",
      label: "Vehículos publicados",
      icon: Car,
      value: String(stats.publishedVehicles),
      isAvailable: true,
    },
    {
      key: "reviewCount",
      label: "Reseñas recibidas",
      icon: MessageSquareText,
      value: String(stats.reviewCount),
      isAvailable: true,
    },
    {
      key: "yearsOnPlatform",
      label: "En WiAuto",
      icon: CalendarDays,
      value: formatTimeOnPlatform(stats.yearsOnPlatform),
      isAvailable: stats.yearsOnPlatform !== undefined,
    },
  ];

  const visibleItems = items.filter((item) => item.isAvailable);

  const gridColumns =
    visibleItems.length === 1
      ? "sm:grid-cols-1"
      : visibleItems.length === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-3";

  return (
    <Card size="sm">
      <CardContent
        className={`grid grid-cols-1  ${gridColumns}`}
      >
        {visibleItems.map(({ key, label, icon: Icon, value }) => (
          <div
            key={key}
            className="flex items-center gap-3"
          >
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${BRAND_BLUE}18`,
                color: BRAND_BLUE,
              }}
            >
              <Icon className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="text-base font-extrabold text-slate-900 sm:text-lg">
                {value}
              </p>

              <p className="text-[11px] leading-tight text-slate-500">
                {label}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
