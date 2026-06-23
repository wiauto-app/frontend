import type { PlanesEstadistica } from "../interfaces/planes.interface";

type PlansStatsSectionProps = {
  items: PlanesEstadistica[];
};

export const PlansStatsSection = ({ items }: PlansStatsSectionProps) => {
  return (
    <section className="border-y border-slate-200 bg-white py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center gap-1">
              <p className="text-2xl font-bold text-blue-600 md:text-3xl">{item.estadistica}</p>
              <p className="text-sm text-slate-600">{item.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
