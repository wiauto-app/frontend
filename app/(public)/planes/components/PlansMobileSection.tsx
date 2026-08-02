import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getStrapiMediaUrl } from "@/lib/strapi-media";
import { cn } from "@/lib/utils";

import type { PlanesMobileBlock } from "../interfaces/planes.interface";
import { StoreButtons } from "@/components/home/StoreButtons";

type PlansMobileSectionProps = {
  data: PlanesMobileBlock;
};

export const PlansMobileSection = ({ data }: PlansMobileSectionProps) => {
  const caracteristicas = data.caracteristicas ?? [];
  const image_url =
    getStrapiMediaUrl(data.imagen?.formats?.medium?.url) ??
    getStrapiMediaUrl(data.imagen?.url);

  return (
    <section className="">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div className="flex justify-center">
            <Image
              src={image_url ?? ""}
              alt={data.imagen?.alternativeText ?? data.header?.titulo ?? "WiAuto"}
              width={260}
              height={520}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {data.header?.titulo}
              </h2>
              {data.header?.descripcion ? (
                <p className="text-base text-slate-600 md:text-lg">
                  {data.header.descripcion}
                </p>
              ) : null}
            </div>

            {caracteristicas.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {caracteristicas.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 text-slate-700"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <StoreButtons />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
