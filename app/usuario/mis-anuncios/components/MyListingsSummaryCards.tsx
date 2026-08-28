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
import { cn } from "@/lib/utils";

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
  /** Etiqueta sin sufijo de periodo, para el panel compacto de móvil. */
  shortLabel: string;
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

const formatCount = (value: number): string =>
  new Intl.NumberFormat("es-ES").format(value);

/**
 * Móvil: celda de una sola línea (icono + cifra) con la etiqueta debajo, para
 * que todas las métricas quepan en una fila de ~46px.
 * Desde `md`: card independiente con etiqueta completa y tendencia.
 */
const SummaryCard = ({
  label,
  shortLabel,
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
    <div className="flex min-w-0 flex-col items-center gap-0 bg-card px-1.5 py-2 text-center md:items-stretch md:gap-2 md:rounded-xl md:px-4 md:py-4 md:text-left md:shadow-sm md:ring-1 md:ring-foreground/10">
      <div className="flex min-w-0 items-center justify-center gap-1 md:hidden">
        <Icon className="size-3 shrink-0 text-gray-400" aria-hidden />
        <span className="truncate text-sm font-bold leading-none text-gray-900">
          {value}
        </span>
      </div>
      <span className="w-full truncate text-[10px] leading-tight text-gray-500 md:hidden">
        {shortLabel}
      </span>

      <div className="hidden min-w-0 items-center gap-2 md:flex">
        <Icon className="size-4 shrink-0 text-gray-400" aria-hidden />
        <h3 className="truncate text-sm font-medium text-gray-500">{label}</h3>
      </div>
      <p className="hidden text-3xl font-bold text-gray-900 md:block">
        {value}
      </p>

      {subtitle ? (
        <p
          className={cn(
            "mt-1 hidden items-center gap-1 text-xs font-medium md:flex",
            showTrend
              ? isPositive
                ? "text-green-600"
                : "text-red-500"
              : "text-muted-foreground",
          )}
        >
          {showTrend ? <TrendIcon className="size-3" aria-hidden /> : null}
          {subtitle}
        </p>
      ) : null}
    </div>
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
      shortLabel: "Visitas",
      value: formatCount(stats.views.current),
      changePercent: stats.views.change_percent,
      icon: Eye,
    },
    {
      label: "Contactos (30 días)",
      shortLabel: "Contactos",
      value: formatCount(stats.leads.current),
      changePercent: stats.leads.change_percent,
      icon: MessageCircle,
    },
    {
      label: "Favoritos (30 días)",
      shortLabel: "Favoritos",
      value: formatCount(stats.favorites.current),
      changePercent: stats.favorites.change_percent,
      icon: Heart,
    },
    {
      label: "Anuncios activos",
      shortLabel: "Anuncios",
      value: activeLabel,
      changePercent: null,
      hint: "Ocupados / incluidos en tu plan",
      icon: Car,
    },
  ];

  if (showFeaturedCard) {
    cards.push({
      label: "Destacados",
      shortLabel: "Destacados",
      value: featuredValue,
      changePercent: null,
      hint: featuredHint,
      icon: Star,
    });
  }

  return (
    <div
      className={cn(
        // Móvil: panel único dividido por líneas de 1px.
        // md: se disuelve el panel y cada métrica es una card.
        "grid gap-px overflow-hidden rounded-xl bg-border ring-1 ring-foreground/10 md:gap-4 md:overflow-visible md:bg-transparent md:ring-0",
        showFeaturedCard ? "grid-cols-5" : "grid-cols-4",
      )}
    >
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </div>
  );
};
