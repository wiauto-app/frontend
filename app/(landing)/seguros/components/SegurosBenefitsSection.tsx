import Image from "next/image";
import { Shield } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { getStrapiMediaUrl } from "@/lib/strapi-media";
import { resolveStrapiIconName } from "@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName";

import { BRAND_BLUE, BRAND_BLUE_LIGHT } from "../constants";
import type { SegurosFeaturesSection } from "../interfaces/seguros.interface";

interface SegurosBenefitsSectionProps {
  data: SegurosFeaturesSection | null;
}

export const SegurosBenefitsSection = ({
  data,
}: SegurosBenefitsSectionProps) => {
  if (!data) {
    return null;
  }

  const features = data.feature?.filter((item) => item.label?.trim()) ?? [];

  return (
    <section >
      <div className="container-custom mx-auto bg-gray-50 rounded-2xl pt-8 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          {data.title ? (
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-4xl">
              {data.title}
            </h2>
          ) : null}
          {data.description ? (
            <p className="mt-3 text-slate-500">{data.description}</p>
          ) : null}
        </div>

        {features.length > 0 ? (
          <div className="mx-auto mt-2 grid grid-cols-2 gap-4 md:grid-cols-5">
            {features.map((benefit) => {
              const icon_url =
                getStrapiMediaUrl(benefit.icon?.formats?.small?.url) ??
                getStrapiMediaUrl(benefit.icon?.url);
              const BenefitIcon = resolveStrapiIconName(benefit.iconName);

              return (
                <Card
                  key={benefit.id}
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
                      {icon_url ? (
                        <div className="relative size-7">
                          <Image
                            src={icon_url}
                            alt={benefit.icon?.alternativeText ?? benefit.label}
                            fill
                            className="object-contain"
                            sizes="28px"
                          />
                        </div>
                      ) : BenefitIcon ? (
                        BenefitIcon({ className: "size-7" })
                      ) : (
                        <Shield className="size-7" />
                      )}
                    </div>
                    <h3 className="mt-4 text-md font-bold text-slate-900">
                      {benefit.label}
                    </h3>
                    {benefit.descripcion ? (
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        {benefit.descripcion}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};
