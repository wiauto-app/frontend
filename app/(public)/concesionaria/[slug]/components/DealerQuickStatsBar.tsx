import { Car, ThumbsUp, ArrowLeftRight, CalendarDays } from "lucide-react";
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
  },
  {
    key: "positiveReviewsPercent" as const,
    label: "Reseñas positivas",
    icon: ThumbsUp,
    format: (v: number) => `${v}%`,
  },
  {
    key: "transactions" as const,
    label: "Transacciones",
    icon: ArrowLeftRight,
    format: (v: number) => `+${v}`,
  },
  {
    key: "yearsOnPlatform" as const,
    label: "En WiAuto",
    icon: CalendarDays,
    format: (v: number) => `${v} años`,
  },
] as const;

export function DealerQuickStatsBar({ stats }: DealerQuickStatsBarProps) {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0">
        {STAT_ITEMS.map(({ key, label, icon: Icon, format }, i) => (
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
                {format(stats[key])}
              </p>
              <p className="text-[11px] leading-tight text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
