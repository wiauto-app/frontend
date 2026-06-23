import Link from "next/link";
import type { OwnerDashboardPriceDeviationItem } from "@/interfaces/owner-dashboard.interface";
import { formatEuros, formatNumber } from "./dashboard.utils";

type DashboardPriceDeviationCardProps = {
  aboveMarket: OwnerDashboardPriceDeviationItem[];
  belowMarket: OwnerDashboardPriceDeviationItem[];
};

const DeviationList = ({
  title,
  items,
  tone,
}: {
  title: string;
  items: OwnerDashboardPriceDeviationItem[];
  tone: "above" | "below";
}) => {
  const toneClass = tone === "above" ? "text-red-600" : "text-green-600";

  if (items.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500">Sin desviaciones de precio.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.vehicle_id}
            className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 p-3"
          >
            <div className="min-w-0">
              <Link
                href={`/vehiculo/${item.vehicle_id}`}
                className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
              >
                {item.display_name}
              </Link>
              <p className="text-xs text-gray-500 mt-1">
                Precio: {formatEuros(item.price)} · Mercado:{" "}
                {formatEuros(item.benchmark_price)}
              </p>
            </div>
            <span className={`text-sm font-semibold shrink-0 ${toneClass}`}>
              {item.deviation_percent > 0 ? "+" : ""}
              {formatNumber(item.deviation_percent)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const DashboardPriceDeviationCard = ({
  aboveMarket,
  belowMarket,
}: DashboardPriceDeviationCardProps) => {
  const isEmpty = aboveMarket.length === 0 && belowMarket.length === 0;

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Desviación de precio
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Comparación con el precio medio de vehículos similares en la plataforma.
      </p>

      {isEmpty ? (
        <p className="text-sm text-gray-500">
          Sin desviaciones de precio detectadas en tu inventario activo.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DeviationList
            title="Por encima del mercado"
            items={aboveMarket}
            tone="above"
          />
          <DeviationList
            title="Por debajo del mercado"
            items={belowMarket}
            tone="below"
          />
        </div>
      )}
    </section>
  );
};
