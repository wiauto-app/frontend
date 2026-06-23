import { Car, ThumbsUp, CalendarDays } from "lucide-react";
import { BRAND_BLUE } from "@/app/(public)/concesionarias/constants";
import type { DealerQuickStats } from "../interfaces";

type DealerQuickStatsBarProps = {
  stats: DealerQuickStats;
};

const STAT_ITEMS = [
  {
    key: "publishedVehicles" as const,
    label: "Vehículos publicados",
    icon: Car,
    format: (v: number) => String(v),
    isAvailable: () => true,
  },
  {
    key: "positiveReviewsPercent" as const,
    label: "Reseñas positivas",
    icon: ThumbsUp,
    format: (v: number) => `${v}%`,
    isAvailable: (stats: DealerQuickStats) =>
      stats.positiveReviewsPercent !== undefined,
  },
  {
    key: "yearsOnPlatform" as const,
    label: "En WiAuto",
    icon: CalendarDays,
    format: (v: number) => `${v} años`,
    isAvailable: (stats: DealerQuickStats) =>
      stats.yearsOnPlatform !== undefined,
  },
] as const;

export function DealerQuickStatsBar({ stats }: DealerQuickStatsBarProps) {
  const visible_items = STAT_ITEMS.filter((item) => item.isAvailable(stats));

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div
        className={`grid grid-cols-1 divide-x divide-y divide-slate-100 sm:divide-y-0 ${
          visible_items.length === 1
            ? "sm:grid-cols-1"
            : visible_items.length === 2
              ? "sm:grid-cols-2"
              : "sm:grid-cols-3"
        }`}
      >
        {visible_items.map(({ key, label, icon: Icon, format }) => (
          <div
            key={key}
            className="flex items-center gap-3 px-4 py-4 sm:px-5 sm:py-5"
          >
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${BRAND_BLUE}18`, color: BRAND_BLUE }}
            >
              <Icon className="size-5" />
            </div>
            <div>
              <p className="text-base font-extrabold text-slate-900 sm:text-lg">
                {format(stats[key] as number)}
              </p>
              <p className="text-[11px] leading-tight text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
