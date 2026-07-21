import Image from "next/image";

import { getStrapiMediaUrl } from "@/lib/strapi-media";

import type { SegurosFeaturesSection } from "../interfaces/seguros.interface";

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
              const logo_url =
                getStrapiMediaUrl(partner.icon?.formats?.small?.url) ??
                getStrapiMediaUrl(partner.icon?.url);

              return (
                <div key={partner.id}>
                  {logo_url ? (
                    <Image
                      src={logo_url}
                      alt={partner.icon?.alternativeText ?? partner.label}
                      className="object-contain"
                      sizes="250px"
                      width={250}
                      height={100}
                    />
                  ) : (
                    <span className="text-lg font-bold text-slate-600">
                      {partner.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};
