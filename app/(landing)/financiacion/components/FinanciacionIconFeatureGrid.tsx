import Image from "next/image";

import type { StrapiIconFeature } from "@/interfaces/strapi-components.interface";
import { getStrapiMediaUrl } from "@/lib/strapi-media";

interface FinanciacionIconFeatureGridProps {
  items: StrapiIconFeature[];
  numbered?: boolean;
}

export const FinanciacionIconFeatureGrid = ({
  items,
  numbered = false,
}: FinanciacionIconFeatureGridProps) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {items.map((item, index) => {
      const icon_url =
        getStrapiMediaUrl(item.icon?.formats?.medium?.url) ??
        getStrapiMediaUrl(item.icon?.url);

      return (
        <article
          key={item.id}
          className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6"
        >
          {numbered ? (
            <span className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {index + 1}
            </span>
          ) : null}
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
);
