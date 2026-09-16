import Image from "next/image";

import { IconContainer } from "@/components/ui/iconContainer";
import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";

import type { StrapiHero } from "@/interfaces/strapi-components.interface";

interface AboutTeamSectionProps {
  personas: StrapiHero | null;
}

export const AboutTeamSection = ({ personas }: AboutTeamSectionProps) => {
  if (!personas) {
    return null;
  }

  const imageUrl = personas.imagen?.url;

  return (
    <section className="grid grid-cols-1 items-center gap-8 py-10 lg:grid-cols-2 lg:gap-16">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={personas.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 560px"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {personas.titulo}
          </h2>
          {personas.descripcion ? (
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              {personas.descripcion}
            </p>
          ) : null}
        </div>

        {personas.caracteristicas.length > 0 ? (
          <div className="flex flex-col flex-wrap gap-4 sm:flex-row sm:items-center sm:gap-8">
            {personas.caracteristicas.map((feature) => (
              <div key={feature.id} className="flex items-center gap-2">
                <IconContainer
                  Icon={resolveStrapiIconName(
                    feature.iconName,
                    defaultStrapiIconPack,
                  )}
                  size="sm"
                  justIcon
                />
                <span className="text-sm font-semibold text-slate-900">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};
