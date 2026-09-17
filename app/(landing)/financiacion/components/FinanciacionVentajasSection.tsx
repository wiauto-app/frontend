import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";
import type { StrapiFinanciacionAdvantages } from "@/interfaces/strapi-components.interface";
import { IconContainer } from "@/components/ui/iconContainer";
import { SectionHeading } from "@/components/home/SectionHeading";
import { SectionContainer } from "@/components/home";
import { Card, CardContent } from "@/components/ui/card";

interface FinanciacionVentajasSectionProps {
  data: StrapiFinanciacionAdvantages;
}

export const FinanciacionVentajasSection = ({
  data,
}: FinanciacionVentajasSectionProps) => {
  const title =
    data?.header?.titulo || "Ventajas exclusivas para la comunidad de WiAuto";

  return (
    <SectionContainer>
      <SectionHeading
        lead={title}
        description={data?.header?.descripcion ?? undefined}
      />
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {data?.caracteristicas?.map((item, idx: number) => {
          const StrapiIcon = resolveStrapiIconName(
            item.iconName,
            defaultStrapiIconPack,
          );
          const label = item.label;
          const desc = item.descripcion;

          return (
            <Card size="sm" key={idx}>
              <CardContent className="flex flex-col items-center text-center gap-3">
                <IconContainer size="lg" Icon={StrapiIcon} />
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-base font-bold text-slate-900">
                    {label}
                  </h3>
                  {desc && (
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {desc}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </SectionContainer>
  );
};
