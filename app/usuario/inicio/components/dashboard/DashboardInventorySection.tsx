import type { OwnerDashboardResponse } from "@/interfaces/owner-dashboard.interface";
import { DashboardPriceDeviationCard } from "./DashboardPriceDeviationCard";
import { DashboardQualityCard } from "./DashboardQualityCard";
import { DashboardStockAgeCard } from "./DashboardStockAgeCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatNumber } from "./dashboard.utils";

type DashboardInventorySectionProps = {
  inventory: OwnerDashboardResponse["inventory"];
};

export const DashboardInventorySection = ({
  inventory,
}: DashboardInventorySectionProps) => {
  const hasActiveStock = inventory.active_count > 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Inventario</h2>
          <p className="text-sm text-gray-500 mt-1">
            {hasActiveStock
              ? `${formatNumber(inventory.active_count)} vehículos en stock`
              : "Sin anuncios activos"}
          </p>
        </div>
        <Link
          href="/usuario/mis-anuncios"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Ver mis anuncios
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </div>

      {!hasActiveStock ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-600">Aún no tienes anuncios activos en stock.</p>
          <Link
            href="/crear-vehiculo"
            className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            Publicar vehículo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DashboardStockAgeCard buckets={inventory.stock_age_buckets} />
          <DashboardQualityCard distribution={inventory.quality_distribution} />
          <div className="md:col-span-2">
            <DashboardPriceDeviationCard
              aboveMarket={inventory.price_deviation.above_market}
              belowMarket={inventory.price_deviation.below_market}
            />
          </div>
        </div>
      )}
    </section>
  );
};
