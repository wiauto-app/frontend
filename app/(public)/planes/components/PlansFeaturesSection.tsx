import Image from "next/image";

import { getStrapiMediaUrl } from "@/lib/strapi-media";

import type { PlanesCaracteristicasBlock } from "../interfaces/planes.interface";

type PlansFeaturesSectionProps = {
  data: PlanesCaracteristicasBlock;
};

export const PlansFeaturesSection = ({ data }: PlansFeaturesSectionProps) => {
  return (
    <section className="">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {data.header.titulo}
          </h2>
          {data.header.descripcion ? (
            <p className="mt-4 text-base text-slate-600 md:text-lg">{data.header.descripcion}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.caracteristicas.map((item) => {
            const icon_url =
              getStrapiMediaUrl(item.icon?.formats?.medium?.url) ??
              getStrapiMediaUrl(item.icon?.url);

            return (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6"
              >
                {icon_url ? (
                  <div className="relative h-12 w-12">
                    <Image
                      src={icon_url}
                      alt={item.icon?.alternativeText ?? item.label}
                      fill
                      className="object-contain"
                      sizes="48px"
                    />
                  </div>
                ) : null}
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">{item.label}</h3>
                  {item.descripcion ? (
                    <p className="text-sm text-slate-600">{item.descripcion}</p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
