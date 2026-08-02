import type { StrapiEstadistica } from "@/interfaces/strapi-components.interface";

interface FinanciacionStatsSectionProps {
  items: StrapiEstadistica[];
}

export const FinanciacionStatsSection = ({
  items,
}: FinanciacionStatsSectionProps) => (
  <section className="border-y border-slate-200 bg-white py-8">
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center gap-1 text-center"
        >
          {item.estadistica ? (
            <p className="text-2xl font-bold text-blue-600 md:text-3xl">
              {item.estadistica}
            </p>
          ) : null}
          {item.descripcion ? (
            <p className="text-sm text-slate-600">{item.descripcion}</p>
          ) : null}
        </div>
      ))}
    </div>
  </section>
);
