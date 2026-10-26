import type { OwnerVehicleStatTrend } from "@/interfaces/owner-vehicle.interface";
import { TrendingDown, TrendingUp } from "lucide-react";

type MyListingStatsRowProps = {
  label: string;
  trend: OwnerVehicleStatTrend;
};

const formatTrendLabel = (trend: OwnerVehicleStatTrend): string => {
  if (trend.change_percent === null) {
    return "Sin datos previos";
  }

  const prefix = trend.change_percent > 0 ? "+" : "";
  return `${prefix}${trend.change_percent}% vs 30 días anteriores`;
};

export const MyListingStatsRow = ({ label, trend }: MyListingStatsRowProps) => {
  const isPositive = (trend.change_percent ?? 0) >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="min-w-[72px]">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-semibold text-gray-900">{trend.current}</p>
      <p className="text-[10px] text-yellow-600 flex items-center gap-1 mt-0.5">
        <TrendIcon className="w-3 h-3" aria-hidden />
        {formatTrendLabel(trend)}
      </p>
    </div>
  );
};
