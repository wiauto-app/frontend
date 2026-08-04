import React from "react";
import type { StrapiEstadistica } from "@/interfaces/strapi-components.interface";

interface FinanciacionStatsSectionProps {
  items: StrapiEstadistica[];
}

const FALLBACK_STATS = [
  { estadistica: "+10 años", descripcion: "de experiencia" },
  { estadistica: "+25.000", descripcion: "clientes satisfechos" },
  { estadistica: "100%", descripcion: "proceso digital" },
  { estadistica: "24h", descripcion: "respuesta promedio" },
  { estadistica: "98%", descripcion: "de aprobaciones" },
];

export const FinanciacionStatsSection = ({
  items,
}: FinanciacionStatsSectionProps) => {
  const displayItems = items && items.length > 0 ? items : FALLBACK_STATS;

  return (
    <section className="bg-primary text-white rounded-2xl p-6 sm:p-8 shadow-md">
      <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-white/20">
        {displayItems.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center gap-1 py-4 md:py-0 md:px-4"
          >
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {item.estadistica}
            </span>
            {item.descripcion && (
              <span className="text-[11px] text-blue-100 font-normal">
                {item.descripcion}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
