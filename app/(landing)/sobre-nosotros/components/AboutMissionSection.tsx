import Image from "next/image";

import { IconContainer } from "@/components/ui/iconContainer";
import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";

import type { StrapiHero } from "@/interfaces/strapi-components.interface";

interface AboutMissionSectionProps {
  mission: StrapiHero | null;
}

export const AboutMissionSection = ({ mission }: AboutMissionSectionProps) => {
  if (!mission) {
    return null;
  }

  const imageUrl = mission.imagen?.url;

  return (
    <section className="grid grid-cols-1 items-center gap-8 py-10 lg:grid-cols-2 lg:gap-16">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={mission.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 560px"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {mission.titulo}
          </h2>
          {mission.descripcion ? (
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              {mission.descripcion}
            </p>
          ) : null}
        </div>

        {mission.caracteristicas.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {mission.caracteristicas.map((feature) => (
              <div
                key={feature.id}
                className="flex flex-col gap-3 rounded-xl bg-slate-50 p-5"
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
        ) : null}
      </div>
    </section>
  );
};
