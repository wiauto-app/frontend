import type { SimuladorPasoView } from "../interfaces/simulador-page.interface";
import { SimulatorFeatureIcon } from "./SimulatorFeatureIcon";

interface SimulatorStepsSectionProps {
  titulo: string;
  pasos: SimuladorPasoView[];
}

export const SimulatorStepsSection = ({
  titulo,
  pasos,
}: SimulatorStepsSectionProps) => {
  if (!pasos.length) {
    return null;
  }

  return (
    <section className="py-16 lg:py-20" aria-labelledby="pasos-titulo">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h2
          id="pasos-titulo"
          className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        >
          {titulo}
        </h2>
      </div>

      <ol className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <div
          className="pointer-events-none absolute top-10 right-[12%] left-[12%] hidden border-t-2 border-dashed border-slate-200 lg:block"
          aria-hidden
        />
        {pasos.map((paso) => (
          <li key={paso.id} className="relative flex flex-col items-center text-center">
            <div className="relative z-10 mb-4 flex size-16 items-center justify-center rounded-full border-2 border-blue-100 bg-white shadow-sm">
              <SimulatorFeatureIcon
                iconName={paso.iconName}
                mediaUrl={paso.icon.url}
                mediaAlt={paso.icon.alt || paso.titulo}
                iconClassName="size-7 text-blue-600"
                wrapperClassName="flex items-center justify-center text-blue-600"
                mediaSizeClassName="relative size-8"
                imageSizes="32px"
              />
            </div>
            <span className="mb-1 text-xs font-bold uppercase tracking-wide text-blue-600">
              Paso {paso.orden}
            </span>
            <h3 className="text-lg font-semibold text-slate-900">{paso.titulo}</h3>
            {paso.descripcion ? (
              <p className="mt-2 text-sm text-slate-600">{paso.descripcion}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
};
