import type { StrapiFinanciacionAdvantages } from "@/interfaces/strapi-components.interface";

import { FinanciacionIconFeatureGrid } from "./FinanciacionIconFeatureGrid";

interface FinanciacionVentajasSectionProps {
  data: StrapiFinanciacionAdvantages;
}

export const FinanciacionVentajasSection = ({
  data,
}: FinanciacionVentajasSectionProps) => {
  const features =
    data.caracteristicas?.filter((item) => item.label?.trim()) ?? [];

  return (
    <section className="flex flex-col gap-10">
      <div className="mx-auto max-w-3xl text-center">
        {data.header?.titulo ? (
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {data.header.titulo}
          </h2>
        ) : null}
        {data.header?.descripcion ? (
          <p className="mt-4 text-base text-slate-600 md:text-lg">
            {data.header.descripcion}
          </p>
        ) : null}
      </div>
      {features.length > 0 ? (
        <FinanciacionIconFeatureGrid items={features} />
      ) : null}
    </section>
  );
};
