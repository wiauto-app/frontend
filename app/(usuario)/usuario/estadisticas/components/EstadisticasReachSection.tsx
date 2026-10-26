import { Car, Eye, MessageCircle, MousePointerClick } from "lucide-react";
import type { OwnerStatisticsReach } from "@/interfaces/owner-statistics.interface";
import { formatNumber } from "../utils/estadisticas.utils";
import { EstadisticasSummaryCard } from "./EstadisticasSummaryCard";

interface EstadisticasReachSectionProps {
  reach: OwnerStatisticsReach;
}

export const EstadisticasReachSection = ({
  reach,
}: EstadisticasReachSectionProps) => {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">Alcance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <EstadisticasSummaryCard
          label="Publicaciones"
          value={formatNumber(reach.listings_published)}
          icon={Car}
        />
        <EstadisticasSummaryCard
          label="Impresiones"
          value={formatNumber(reach.impressions)}
          icon={Eye}
        />
        <EstadisticasSummaryCard
          label="Visitas"
          value={formatNumber(reach.visits)}
          icon={MousePointerClick}
        />
        <EstadisticasSummaryCard
          label="Contactos"
          value={formatNumber(reach.contacts)}
          icon={MessageCircle}
        />
      </div>
    </section>
  );
};
