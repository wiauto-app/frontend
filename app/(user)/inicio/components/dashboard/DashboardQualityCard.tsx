import type { OwnerDashboardQualityDistributionItem } from "@/interfaces/owner-dashboard.interface";
import { formatNumber } from "./dashboard.utils";

type DashboardQualityCardProps = {
  distribution: OwnerDashboardQualityDistributionItem[];
};

const TIER_COLORS: Record<
  OwnerDashboardQualityDistributionItem["tier"],
  string
> = {
  high: "bg-green-500",
  medium: "bg-amber-500",
  low: "bg-red-400",
};

export const DashboardQualityCard = ({
  distribution,
}: DashboardQualityCardProps) => {
  const total = distribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Calidad del anuncio
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Nivel de completitud y presentación de tus publicaciones activas.
      </p>

      {total === 0 ? (
        <p className="text-sm text-gray-500">
          Sin anuncios activos para evaluar la calidad.
        </p>
      ) : (
        <ul className="space-y-4">
          {distribution.map((item) => {
            const percentage = Math.round((item.count / total) * 100);

            return (
              <li key={item.tier}>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatNumber(item.count)} ({percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${TIER_COLORS[item.tier]}`}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${item.label}: ${percentage}%`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
