import {
  Car,
  Eye,
  Heart,
  MessageCircle,
  Star,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { AggregatedListingStats } from "../utils/aggregateListingStats";
import { Card, CardContent } from "@/components/ui/card";

interface MyListingsSummaryCardsProps {
  stats: AggregatedListingStats;
  listingsUsed?: number | null;
  listingsMax?: number | null;
  featuredUsed?: number | null;
  featuredMax?: number | null;
  featuredUnlimited?: boolean;
  showFeaturedCard?: boolean;
}

interface SummaryCardConfig {
  label: string;
  value: string;
  changePercent: number | null;
  hint?: string | null;
  icon: LucideIcon;
}

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
  hint,
  icon: Icon,
}: SummaryCardConfig) => {
  const isPositive = (changePercent ?? 0) >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const showTrend = changePercent !== null;
  const subtitle = hint ?? (showTrend ? formatChangeLabel(changePercent) : null);

  return (
    <Card size="sm">
      <CardContent>
        <div className="mb-2 flex items-center gap-2">
          <Icon className="size-4 text-gray-400" aria-hidden />
          <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle ? (
              <p
                className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                  showTrend
                    ? isPositive
                      ? "text-green-600"
                      : "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {showTrend ? <TrendIcon className="size-3" aria-hidden /> : null}
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const MyListingsSummaryCards = ({
  stats,
  listingsUsed,
  listingsMax,
  featuredUsed = null,
  featuredMax = null,
  featuredUnlimited = false,
  showFeaturedCard = false,
}: MyListingsSummaryCardsProps) => {
  const activeLabel =
    listingsUsed != null
      ? listingsMax != null
        ? `${listingsUsed} / ${listingsMax}`
        : String(listingsUsed)
      : String(stats.activeCount);

  const featuredValue =
    featuredUsed == null
      ? "—"
      : featuredUnlimited || featuredMax == null
        ? `${featuredUsed} / ∞`
        : `${featuredUsed} / ${featuredMax}`;

  const featuredRemaining =
    featuredUnlimited || featuredMax == null || featuredUsed == null
      ? null
      : Math.max(0, featuredMax - featuredUsed);

  const featuredHint =
    featuredUnlimited || featuredMax == null
      ? "Cupo ilimitado de destacados"
      : featuredRemaining == null
        ? null
        : featuredRemaining === 1
          ? "1 hueco disponible"
          : `${featuredRemaining} huecos disponibles`;

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
      hint: "Ocupados / incluidos en tu plan",
      icon: Car,
    },
  ];

  if (showFeaturedCard) {
    cards.push({
      label: "Destacados",
      value: featuredValue,
      changePercent: null,
      hint: featuredHint,
      icon: Star,
    });
  }

  return (
    <div
      className={
        showFeaturedCard
          ? "grid grid-cols-2 gap-4 xl:grid-cols-5"
          : "grid grid-cols-2 gap-4 xl:grid-cols-4"
      }
    >
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </div>
  );
};
