import type { PlanesCaracteristicasBlock } from "../interfaces/planes.interface";
import { plansIconPack } from "../utils/plansIconPack";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";
import { IconContainer } from "@/components/ui/iconContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { SectionHeading } from "@/components/home/SectionHeading";
import { SectionContainer } from "@/components/home";

interface PlansFeaturesSectionProps {
  data: PlanesCaracteristicasBlock;
}

export const PlansFeaturesSection = ({ data }: PlansFeaturesSectionProps) => {
  const caracteristicas = data.caracteristicas ?? [];

  return (
    <SectionContainer className="">
      <SectionHeading lead={data.header?.titulo || ""}></SectionHeading>
      {data.header?.descripcion ? (
        <p className="mt-4 text-base text-slate-600">
          {data.header.descripcion}
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 2xl:grid-cols-6">
        {caracteristicas.map((item) => {
          const Icon = resolveStrapiIconName(item.iconName, plansIconPack);

          return (
            <Card size="sm" key={item.id}>
              <CardContent className="flex flex-col items-center gap-4">
                {Icon ? <IconContainer Icon={Icon} rounded size="xl" /> : null}
                <div className="flex flex-col gap-2">
                  <h3 className="text-base  font-semibold text-center">
                    {item.label}
                  </h3>
                  {item.descripcion ? (
                    <CardDescription className="text-xs text-center">
                      {item.descripcion}
                    </CardDescription>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </SectionContainer>
  );
};
