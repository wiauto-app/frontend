import type { SimuladorBeneficioView } from "../interfaces/simulador-page.interface";
import { SimulatorFeatureIcon } from "./SimulatorFeatureIcon";

interface SimulatorBenefitsSectionProps {
  titulo: string;
  beneficios: SimuladorBeneficioView[];
}

export const SimulatorBenefitsSection = ({
  titulo,
  beneficios,
}: SimulatorBenefitsSectionProps) => {
  if (!beneficios.length) {
    return null;
  }

  return (
    <section className="py-16 lg:py-20" aria-labelledby="beneficios-titulo">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h2
          id="beneficios-titulo"
          className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        >
          {titulo}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {beneficios.map((item) => (
          <article
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
          >
            <SimulatorFeatureIcon
              iconName={item.iconName}
              mediaUrl={item.icon.url}
              mediaAlt={item.icon.alt || item.titulo}
            />
            <h3 className="text-lg font-semibold text-slate-900">{item.titulo}</h3>
            {item.descripcion ? (
              <p className="text-sm leading-relaxed text-slate-600">{item.descripcion}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};
