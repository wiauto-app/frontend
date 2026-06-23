import type { ReactNode } from "react";
import {
  Car,
  Eye,
  MessageCircle,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { OwnerDashboardResponse } from "@/interfaces/owner-dashboard.interface";
import { ListingPerformanceSparkline } from "@/app/(user)/mis-anuncios/components/ListingPerformanceSparkline";
import {
  formatEuros,
  formatNumber,
  formatPercentChange,
  isMetricPositive,
} from "./dashboard.utils";
import { TimeSeriesSparkline } from "./TimeSeriesSparkline";

type DashboardKpiGridProps = {
  summary: OwnerDashboardResponse["summary"];
  viewsTimeSeries: OwnerDashboardResponse["views_time_series"];
};

type KpiCardConfig = {
  label: string;
  value: string;
  changePercent: number | null;
  positive: boolean;
  icon: typeof Eye;
  sparkline: ReactNode;
};

export const DashboardKpiGrid = ({
  summary,
  viewsTimeSeries,
}: DashboardKpiGridProps) => {
  const viewsSeriesValues = viewsTimeSeries.map((point) => point.count);

  const cards: KpiCardConfig[] = [
    {
      label: "Stock activo",
      value: formatNumber(summary.active_stock.current),
      changePercent: summary.active_stock.change_percent,
      positive: isMetricPositive(summary.active_stock),
      icon: Car,
      sparkline: (
        <ListingPerformanceSparkline
          positive={isMetricPositive(summary.active_stock)}
          ariaLabel="Tendencia de stock activo"
        />
      ),
    },
    {
      label: "Vistas",
      value: formatNumber(summary.views.current),
      changePercent: summary.views.change_percent,
      positive: isMetricPositive(summary.views),
      icon: Eye,
      sparkline: (
        <TimeSeriesSparkline
          values={viewsSeriesValues}
          positive={isMetricPositive(summary.views)}
          ariaLabel="Tendencia de vistas"
        />
      ),
    },
    {
      label: "Leads",
      value: formatNumber(summary.leads.current),
      changePercent: summary.leads.change_percent,
      positive: isMetricPositive(summary.leads),
      icon: MessageCircle,
      sparkline: (
        <ListingPerformanceSparkline
          positive={isMetricPositive(summary.leads)}
          ariaLabel="Tendencia de leads"
        />
      ),
    },
    {
      label: "Ventas",
      value: formatEuros(summary.sales_value.current),
      changePercent: summary.sales_value.change_percent,
      positive: isMetricPositive(summary.sales_value),
      icon: Wallet,
      sparkline: (
        <ListingPerformanceSparkline
          positive={isMetricPositive(summary.sales_value)}
          ariaLabel="Tendencia de ventas"
        />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const TrendIcon = card.positive ? TrendingUp : TrendingDown;
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="size-4 text-gray-400" aria-hidden />
              <h2 className="text-sm font-medium text-gray-500">{card.label}</h2>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <p
                  className={`text-xs font-medium flex items-center gap-1 mt-1 ${
                    card.positive ? "text-green-600" : "text-red-500"
                  }`}
                >
                  <TrendIcon className="size-3" aria-hidden />
                  {formatPercentChange(card.changePercent)}
                </p>
              </div>
              {card.sparkline}
            </div>
          </div>
        );
      })}
    </div>
  );
};
