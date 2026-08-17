"use client";

import type { BillingCatalogPlan } from "@/interfaces/billing.interface";

import { StrapiHero } from "@/interfaces/strapi-components.interface";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { resolveStrapiIconName } from "../../simulador-financiamiento/utils/resolveStrapiIconName";
import { StrapiButton } from "@/components/ui/strapiButton";
interface PlansPricingSectionProps {
  actionCallSection: StrapiHero;
  plans: BillingCatalogPlan[];
  catalogError?: boolean;
}

export const PlansPricingSection = ({
  actionCallSection,
}: PlansPricingSectionProps) => {
  const card = actionCallSection?.card;
  const features = actionCallSection?.caracteristicas;
  const Icon = resolveStrapiIconName(features?.[0]?.iconName ?? "");
  return (
    <section className="overflow-hidden  rounded-3xl py-8 md:py-20 relative ">
      <Image
        src={actionCallSection?.imagen?.url ?? ""}
        alt={actionCallSection?.imagen?.alternativeText ?? ""}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
      />

      <div className="relative container mx-auto max-w-7xl px-4 space-y-8 md:space-y-12">
        <div className="mx-auto max-w-2xl text-center space-y-4 md:space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-6xl lg:leading-tight text-white">
            {actionCallSection?.titulo}
          </h2>
          <p className="text-sm text-slate-300 md:text-base">
            {actionCallSection?.descripcion}
          </p>
        </div>

        <Card className="border-2 border-primary max-w-4xl  w-fit mx-auto" size="sm">
          <CardContent className="flex flex-col md:flex-row items-center ">
            <Image
              src={card?.imagen?.url ?? ""}
              alt={card?.imagen?.alternativeText ?? ""}
              width={250}
              height={250}
              className="rounded-full hidden md:block"
            />
            <div className="border-l-2 border-primary h-full w-10 bg-black"></div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-5">
                {features?.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center gap-2 p-2 bg-muted-foreground/10 rounded-full w-full md:w-fit t"
                  >
                    {Icon ? <Icon className="size-7 text-primary" /> : null}
                    <p>{feature.label}</p>
                  </div>
                ))}
              </div>
              {card?.boton ? (
                <StrapiButton
                  button={card?.boton}
                  className="w-full h-14 md:h-20 md:text-xl font-semibold"
                />
              ) : null}
              <p className="text-xs text-muted-foreground text-center">
                {card?.descripcion}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* {catalogError ? (
          <div
            className="mb-8 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center text-sm text-slate-200 backdrop-blur-sm"
            role="status"
          >
            No pudimos cargar los planes en este momento. Inténtalo de nuevo más
            tarde o accede a monetización desde tu cuenta.
          </div>
        ) : null}

        {!sortedPlans.length ? (
          <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-10 text-center text-slate-200 backdrop-blur-sm">
            No hay planes de suscripción disponibles en este momento.
          </div>
        ) : (
          <ul
            className={cn(
              "mx-auto grid list-none gap-5 p-0",
              sortedPlans.length === 1 && "max-w-md",
              sortedPlans.length === 2 && "max-w-3xl sm:grid-cols-2",
              sortedPlans.length >= 3 &&
                "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
            )}
          >
            {sortedPlans.map((plan, index) => (
              <PlanPricingCard
                key={plan.id}
                plan={plan}
                index={index}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </ul>
        )} */}
      </div>
    </section>
  );
};
