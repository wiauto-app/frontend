"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { resolveStrapiIconName } from "@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName";
import type { StrapiHero } from "@/interfaces/strapi-components.interface";
import { getStrapiMediaUrl } from "@/lib/strapi-media";

import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Hero } from "../ui/hero";
import { HeroDescription } from "../ui/heroDescription";
import { HeroTitle } from "../ui/heroTitle";
import { IconContainer } from "../ui/iconContainer";
import { StrapiButton } from "../ui/strapiButton";
import { HeroFeatures } from "./heroFeatures";
import {
  fadeInFromRight,
  getVariant,
  MotionSection,
} from "./motion";
import { usePrefersReducedMotion } from "./motion/usePrefersReducedMotion";

export const PromotionPlans = ({
  data,
}: {
  data: StrapiHero | null | undefined;
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const image_variants = getVariant(fadeInFromRight, prefersReducedMotion);

  if (!data) {
    return null;
  }

  const image_url = getStrapiMediaUrl(data.imagen?.url);
  const acciones = data.acciones ?? [];

  return (
    <MotionSection>
      <div className="overflow-hidden rounded-xl bg-linear-to-r from-white via-white to-primary-dark shadow-xl">
        <Hero
          className="lg:h-auto"
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
          floatingContent={
            image_url ? (
              <div className="pointer-events-none hidden lg:absolute top-0 right-0 z-0 lg:flex h-full items-center justify-end pr-4 lg:[perspective:1200px] lg:pr-10">
                <motion.div
                  className="origin-right lg:transform-[rotateX(10deg)_rotateY(-18deg)] lg:will-change-transform"
                  style={{ transformStyle: "preserve-3d" }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={image_variants}
                >
                  <Image
                    className="h-auto w-xs rounded-xl object-cover shadow-2xl ring-1 ring-black/10 lg:w-md xl:w-2xl"
                    src={image_url}
                    alt={data.imagen?.alternativeText || data.titulo || ""}
                    width={data.imagen?.width || 800}
                    height={data.imagen?.height || 600}
                    sizes="(max-width: 1024px) 320px, 560px"
                  />
                </motion.div>
              </div>
            ) : null
          }
        />
      </div>
    </MotionSection>
  );
};
