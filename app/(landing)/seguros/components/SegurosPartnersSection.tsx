import Image from "next/image";

import { getStrapiMediaUrl } from "@/lib/strapi-media";

import type { SegurosFeaturesSection } from "../interfaces/seguros.interface";
import { IconContainer } from "@/components/ui/iconContainer";
import { resolveStrapiIconName } from "@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName";

interface SegurosPartnersSectionProps {
  data: SegurosFeaturesSection | null;
}

export const SegurosPartnersSection = ({
  data,
}: SegurosPartnersSectionProps) => {
  if (!data) {
    return null;
  }

  const partners = data.feature?.filter((item) => item.label?.trim()) ?? [];

  return (
    <section className="">
      <div className="container-custom mx-auto space-y-4">
        <div className="text-center">
          {data.title ? (
            <h2 className="text-xl font-extrabold text-slate-900">
              {data.title}
            </h2>
          ) : null}
          {data.description ? (
            <p className="mt-3 text-slate-500">{data.description}</p>
          ) : null}
        </div>

        {partners.length > 0 ? (
          <div className="mx-auto flex items-center justify-center gap-4">
            {partners.map((partner) => {
              return (
                <div key={partner.id}>
                  {partner.iconName ? (
                    <IconContainer Icon={resolveStrapiIconName(partner.iconName)} justIcon />
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};
