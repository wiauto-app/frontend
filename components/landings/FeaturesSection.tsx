'use client';

import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";
import { Card, CardContent } from "@/components/ui/card";
import { IconContainer } from "@/components/ui/iconContainer";

import type { Caracteristicas } from "@/interfaces/landings-colaboracion.interface";

const BRAND_BLUE = "#0061F2";
const BRAND_BLUE_LIGHT = "#E8F0FE";

interface FeaturesSectionProps {
  data?: Caracteristicas;
  className?: string;
}

export const FeaturesSection = ({ data, className }: FeaturesSectionProps) => {
  if (!data) {
    return null;
  }

  const features = data.caracteristicas?.filter((item) => item.label?.trim()) ?? [];

  if (features.length === 0) {
    return null;
  }

  return (
    <section className={className}>
      <div className="container-custom mx-auto bg-gray-50 rounded-2xl pt-8 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          {data.header?.titulo ? (
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-4xl">
              {data.header.titulo}
            </h2>
          ) : null}
          {data.header?.descripcion ? (
            <p className="mt-3 text-slate-500">{data.header.descripcion}</p>
          ) : null}
        </div>

        <div className="mx-auto mt-2 grid grid-cols-2 gap-4 md:grid-cols-5">
          {features.map((feature) => {
            return (
              <Card
                key={feature.id}
                className="rounded-2xl border-0 bg-transparent shadow-none ring-0"
              >
                <CardContent className="flex flex-col items-center md:p-6 text-center">
                  <div
                    className="flex size-12 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: BRAND_BLUE_LIGHT,
                      color: BRAND_BLUE,
                    }}
                  >
                    {feature.iconName ? (
                      <IconContainer
                        justIcon
                        Icon={resolveStrapiIconName(
                          feature.iconName,
                          defaultStrapiIconPack,
                        )}
                      />
                    ) : feature.iconUrl ? (
                      <img
                        src={feature.iconUrl}
                        alt={feature.label}
                        className="h-6 w-6"
                      />
                    ) : null}
                  </div>
                  <h3 className="mt-4 text-md font-bold text-slate-900">
                    {feature.label}
                  </h3>
                  {feature.descripcion ? (
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {feature.descripcion}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
