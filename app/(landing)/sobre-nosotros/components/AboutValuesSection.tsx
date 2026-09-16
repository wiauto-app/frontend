import { IconContainer } from "@/components/ui/iconContainer";
import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";

import type { StrapiPlanesCaracteristicas } from "@/interfaces/strapi-components.interface";

interface AboutValuesSectionProps {
  data: StrapiPlanesCaracteristicas | null;
}

export const AboutValuesSection = ({ data }: AboutValuesSectionProps) => {
  if (!data || data.caracteristicas?.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          {data.header?.titulo ? (
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              {data.header.titulo}
            </h2>
          ) : null}
          {data.header?.descripcion ? (
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              {data.header.descripcion}
            </p>
          ) : null}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {data.caracteristicas?.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-xs"
            >
              <IconContainer
                Icon={resolveStrapiIconName(
                  feature.iconName,
                  defaultStrapiIconPack,
                )}
              />
              <h3 className="text-sm font-bold text-slate-900">
                {feature.label}
              </h3>
              {feature.descripcion ? (
                <p className="text-xs leading-relaxed text-slate-500">
                  {feature.descripcion}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
