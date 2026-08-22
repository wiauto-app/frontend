import {
  Car,
  Eye,
  Heart,
  MessageCircle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { AggregatedListingStats } from "../utils/aggregateListingStats";
import { ListingPerformanceSparkline } from "./ListingPerformanceSparkline";
import { Card, CardContent } from "@/components/ui/card";

type MyListingsSummaryCardsProps = {
  stats: AggregatedListingStats;
  listingsUsed?: number | null;
  listingsMax?: number | null;
};

type SummaryCardConfig = {
  label: string;
  value: string;
  changePercent: number | null;
  icon: typeof Eye;
};

const formatChangeLabel = (changePercent: number | null): string => {
  if (changePercent === null) {
    return "Sin datos previos";
  }

  const prefix = changePercent > 0 ? "+" : "";
  return `${prefix}${changePercent}% vs 30 días anteriores`;
};

const SummaryCard = ({
  label,
  value,
  changePercent,
  icon: Icon,
}: SummaryCardConfig) => {
  const isPositive = (changePercent ?? 0) >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card size="sm">
      <CardContent>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="size-4 text-gray-400" aria-hidden />
          <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p
              className={`text-xs font-medium flex items-center gap-1 mt-1 ${
                isPositive ? "text-green-600" : "text-red-500"
              }`}
            >
              <TrendIcon className="size-3" aria-hidden />
              {formatChangeLabel(changePercent)}
            </p>
          </div>
          {/* <ListingPerformanceSparkline positive={isPositive} /> */}
        </div>
      </CardContent>
    </Card>
  );
};

export const MyListingsSummaryCards = ({
  stats,
  listingsUsed,
  listingsMax,
}: MyListingsSummaryCardsProps) => {
  const activeLabel =
    listingsUsed != null
      ? listingsMax != null
        ? `${listingsUsed} / ${listingsMax}`
        : String(listingsUsed)
      : String(stats.activeCount);

  const cards: SummaryCardConfig[] = [
    {
      label: "Visitas (30 días)",
      value: new Intl.NumberFormat("es-ES").format(stats.views.current),
      changePercent: stats.views.change_percent,
      icon: Eye,
    },
    {
      label: "Contactos (30 días)",
      value: new Intl.NumberFormat("es-ES").format(stats.leads.current),
      changePercent: stats.leads.change_percent,
      icon: MessageCircle,
    },
    {
      label: "Favoritos (30 días)",
      value: new Intl.NumberFormat("es-ES").format(stats.favorites.current),
      changePercent: stats.favorites.change_percent,
      icon: Heart,
    },
    {
      label: "Anuncios activos",
      value: activeLabel,
      changePercent: null,
      icon: Car,
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </div>
  );
};
