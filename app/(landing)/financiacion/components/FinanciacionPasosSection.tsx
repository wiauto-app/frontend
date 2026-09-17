import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";
import React from "react";
import type { StrapiFinanciacionSteps } from "@/interfaces/strapi-components.interface";
import { FinanciacionSimuladorCard } from "./FinanciacionSimuladorCard";
import { IconContainer } from "@/components/ui/iconContainer";
import { Car, Calculator, FileText, CheckCircle2, Disc } from "lucide-react";
import { SectionContainer } from "@/components/home";
import { SectionHeading } from "@/components/home/SectionHeading";

interface FinanciacionPasosSectionProps {
  data: StrapiFinanciacionSteps;
}

const ICONOS_POR_POSICION = [Car, Calculator, FileText, CheckCircle2, Disc];

export const FinanciacionPasosSection = ({
  data,
}: FinanciacionPasosSectionProps) => {
  const headerTitle = data?.header?.titulo || "Así de fácil es financiar";
  const headerDesc = data?.header?.descripcion;

  const steps = data?.steps?.filter((item) => item.label?.trim()) ?? [];

  return (
    <>
      {/* Izquierda: Pasos de Financiación */}
      <SectionContainer className=" flex flex-col justify-between h-full">
        <SectionHeading
          lead={headerTitle}
          description={headerDesc ?? undefined}
        />

        {steps.length > 0 && (
          <div
            className="relative grid gap-1.5 mt-4"
            style={{
              gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
            }}
          >
            {steps.map((step, index) => {
              const StrapiIcon = step.iconName
                ? resolveStrapiIconName(step.iconName, defaultStrapiIconPack)
                : null;

              const FallbackIcon =
                ICONOS_POR_POSICION[index % ICONOS_POR_POSICION.length];

              return (
                <div
                  key={step.id || index}
                  className="relative z-10 flex flex-col items-center text-center group gap-2"
                >
                  {StrapiIcon ? (
                    <IconContainer size="xl" Icon={StrapiIcon} justIcon />
                  ) : (
                    <FallbackIcon className="size-5 text-blue-600" />
                  )}
                  <div>
                    <h4 className="text-lg  font-bold text-slate-800 leading-tight">
                      {step.label}
                    </h4>

                    {step.descripcion && (
                      <p className="text-sm text-slate-400 leading-tight mt-1 hidden sm:block">
                        {step.descripcion}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionContainer>
      <FinanciacionSimuladorCard />
    </>
  );
};
