
import Image from "next/image";

import { resolveStrapiIconName } from "@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName";
import type { StrapiHero } from "@/interfaces/strapi-components.interface";

import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Hero } from "../ui/hero";
import { HeroDescription } from "../ui/heroDescription";
import { HeroTitle } from "../ui/heroTitle";
import { IconContainer } from "../ui/iconContainer";
import { StrapiButton } from "../ui/strapiButton";
import { HeroFeatures } from "./heroFeatures";

export const PromotionPlans = ({
  data,
}: {
  data: StrapiHero | null | undefined;
}) => {
  if (!data) {
    return null;
  }

  const image_url = data.imagen?.url;
  const acciones = data.acciones ?? [];

  return (
    <Hero
      className="lg:h-auto gap-5 overflow-visible lg:px-0"
      contentClassName="gap-3 lg:gap-5"
      leftContent={
        <>
          <HeroTitle as="h3" className="text-foreground" highlight>
            {data.titulo}
          </HeroTitle>
          <HeroDescription className="text-foreground lg:max-w-xs">
            {data.descripcion}
          </HeroDescription>
          <HeroFeatures
            features={data.caracteristicas}
            className="text-foreground"
          />
          <Card className="z-10 border-none bg-[#F7F8FC] shadow-none">
            <CardContent className="flex flex-row gap-5">
              <IconContainer
                Icon={resolveStrapiIconName(data.card?.iconName)}
                size="xl"
                rounded
              />
              <div className="flex flex-col gap-2">
                <CardTitle className="font-semibold">
                  {data.card?.titulo}
                </CardTitle>
                <CardDescription>{data.card?.descripcion}</CardDescription>
                {acciones.map((accion) => (
                  <StrapiButton key={accion.id} button={accion} />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      }
      rightContent={
        <div className="hidden lg:block overflow-hidden rounded-xl shadow-2xl ring-1 ring-black/10">
          <Image
            className="h-auto w-xs object-cover transition-transform duration-500 ease-out hover:scale-110 lg:w-md xl:w-xl"
            src={image_url ?? ""}
            alt={data.imagen?.alternativeText || data.titulo || ""}
            width={data.imagen?.width || 800}
            height={data.imagen?.height || 600}
            sizes="(max-width: 1024px) 500px, 1000px"
          />
        </div>
      }
    />
  );
};
