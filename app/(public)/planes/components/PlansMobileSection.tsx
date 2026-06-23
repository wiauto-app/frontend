import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getStrapiMediaUrl } from "@/lib/strapi-media";
import { cn } from "@/lib/utils";

import type { PlanesMobileBlock } from "../interfaces/planes.interface";

type PlansMobileSectionProps = {
  data: PlanesMobileBlock;
};

export const PlansMobileSection = ({ data }: PlansMobileSectionProps) => {
  const image_url =
    getStrapiMediaUrl(data.imagen?.formats?.medium?.url) ??
    getStrapiMediaUrl(data.imagen?.url);

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative mx-auto aspect-[9/16] w-full max-w-xs overflow-hidden rounded-3xl bg-slate-100 shadow-xl lg:mx-0">
            {image_url ? (
              <Image
                src={image_url}
                alt={data.imagen?.alternativeText ?? data.header.titulo}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 80vw, 320px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                App móvil WiAuto
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {data.header.titulo}
              </h2>
              {data.header.descripcion ? (
                <p className="text-base text-slate-600 md:text-lg">{data.header.descripcion}</p>
              ) : null}
            </div>

            {data.caracteristicas?.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {data.caracteristicas.map((item) => (
                  <li key={item.id} className="flex items-start gap-3 text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="flex flex-wrap gap-3">
              {data.apple?.url ? (
                <Link
                  href={data.apple.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-slate-900 text-slate-900",
                  )}
                >
                  {data.apple.label || "App Store"}
                </Link>
              ) : null}
              {data.google?.url ? (
                <Link
                  href={data.google.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-slate-900 text-slate-900",
                  )}
                >
                  {data.google.label || "Google Play"}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
