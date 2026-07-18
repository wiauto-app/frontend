import Image from "next/image";

import { getStrapiMediaUrl } from "@/lib/strapi-media";

import type { PlanesTechBlock } from "../interfaces/planes.interface";

type PlansTechSectionProps = {
  data: PlanesTechBlock;
};

export const PlansTechSection = ({ data }: PlansTechSectionProps) => {
  const image_url =
    getStrapiMediaUrl(data.imagen?.formats?.large?.url) ??
    getStrapiMediaUrl(data.imagen?.formats?.medium?.url) ??
    getStrapiMediaUrl(data.imagen?.url);

  return (
    <section className=" ">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-8 bg-slate-50 rounded-xl p-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {data.header.titulo}
              </h2>
              {data.header.descripcion ? (
                <p className="text-base text-slate-600 md:text-lg">{data.header.descripcion}</p>
              ) : null}
            </div>

            <ul className="flex flex-col gap-4">
              {data.caracteristicas.map((item) => {
                const icon_url =
                  getStrapiMediaUrl(item.icon?.formats?.small?.url) ??
                  getStrapiMediaUrl(item.icon?.url);

                return (
                  <li key={item.id} className="flex items-center gap-4">
                    {icon_url ? (
                      <div className="relative mt-0.5 h-8 w-8 shrink-0">
                        <Image
                          src={icon_url}
                          alt={item.icon?.alternativeText ?? item.label}
                          fill
                          className="object-contain"
                          sizes="32px"
                        />
                      </div>
                    ) : (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                    )}
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      {item.descripcion ? (
                        <p className="text-sm text-slate-600">{item.descripcion}</p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-200 shadow-lg">
            {image_url ? (
              <Image
                src={image_url}
                alt={data.imagen?.alternativeText ?? data.header.titulo}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center text-slate-500">
                Panel de control WiAuto
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
