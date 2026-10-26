import { Heart, Share2, TrendingUp } from "lucide-react";
import type { OwnerStatisticsActions } from "@/interfaces/owner-statistics.interface";
import {
  formatMinutes,
  formatNumber,
  formatPercent,
} from "../utils/estadisticas.utils";
import { EstadisticasSummaryCard } from "./EstadisticasSummaryCard";

interface EstadisticasActionsSectionProps {
  actions: OwnerStatisticsActions;
}

export const EstadisticasActionsSection = ({
  actions,
}: EstadisticasActionsSectionProps) => {
  const medianTimeLabel =
    actions.median_response_time_minutes === null
      ? null
      : `Tiempo mediano: ${formatMinutes(actions.median_response_time_minutes)}`;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">
        Acciones de usuario
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <EstadisticasSummaryCard
          label="Favoritos"
          value={formatNumber(actions.favorites)}
          icon={Heart}
        />
        <EstadisticasSummaryCard
          label="Compartidos"
          value={formatNumber(actions.shares)}
          icon={Share2}
        />
        <EstadisticasSummaryCard
          label="% de respuesta"
          value={formatPercent(actions.response_rate_percent)}
          subtext={medianTimeLabel}
          icon={TrendingUp}
        />
      </div>
    </section>
  );
};
