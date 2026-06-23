import type { OwnerDashboardStockAgeBucket } from "@/interfaces/owner-dashboard.interface";
import { formatNumber } from "./dashboard.utils";

type DashboardStockAgeCardProps = {
  buckets: OwnerDashboardStockAgeBucket[];
};

export const DashboardStockAgeCard = ({ buckets }: DashboardStockAgeCardProps) => {
  const hasData = buckets.some((bucket) => bucket.count > 0);

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Antigüedad del stock
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Distribución por tiempo publicado de tus anuncios activos.
      </p>

      {!hasData ? (
        <p className="text-sm text-gray-500">Sin datos de antigüedad disponibles.</p>
      ) : (
        <ul className="space-y-4">
          {buckets.map((bucket) => (
            <li key={bucket.label}>
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span className="text-sm text-gray-700">{bucket.label}</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumber(bucket.count)} ({bucket.percentage}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${Math.min(bucket.percentage, 100)}%` }}
                  role="progressbar"
                  aria-valuenow={bucket.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${bucket.label}: ${bucket.percentage}%`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
