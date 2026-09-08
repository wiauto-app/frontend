import { ArrowRight } from "lucide-react";

import { SectionContainer } from "@/components/home";
import { SectionHeading } from "@/components/home/SectionHeading";
import { IconContainer } from "@/components/ui/iconContainer";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";
import { cn } from "@/lib/utils";

import type { PlanesCaracteristicasBlock } from "../interfaces/planes.interface";
import { plansIconPack } from "../utils/plansIconPack";

interface PlansStepsSectionProps {
  data: PlanesCaracteristicasBlock;
}

export const PlansStepsSection = ({ data }: PlansStepsSectionProps) => {
  const steps = data.caracteristicas ?? [];

  if (steps.length === 0) {
    return null;
  }

  return (
    <SectionContainer>
      <SectionHeading lead={data.header?.titulo || ""} />
      {data.header?.descripcion ? (
        <p className="mt-4 text-base text-slate-600 md:text-lg">
          {data.header.descripcion}
        </p>
      ) : null}

      <ol className="mt-10 flex flex-col items-stretch gap-6 md:flex-row md:items-start md:justify-between md:gap-0">
        {steps.map((item, index) => {
          const Icon = resolveStrapiIconName(item.iconName, plansIconPack);
          const stepNumber = index + 1;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={item.id}
              className="flex flex-1 flex-col items-center md:flex-row md:items-start"
            >
              <article className="flex w-full max-w-xs flex-col items-center gap-4 text-center md:max-w-none">
                <div className="relative">
                  <IconContainer Icon={Icon} rounded size="xl" />
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -top-1 -right-1 flex size-6 items-center justify-center",
                      "rounded-full bg-primary text-xs font-bold text-primary-foreground",
                      "ring-2 ring-background",
                    )}
                  >
                    {stepNumber}
                  </span>
                  <span className="sr-only">Paso {stepNumber}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.label}
                  </h3>
                  {item.descripcion ? (
                    <p className="text-sm text-slate-600">{item.descripcion}</p>
                  ) : null}
                </div>
              </article>

              {!isLast ? (
                <div
                  className="flex shrink-0 items-center justify-center py-2 md:px-3 md:pt-6"
                  aria-hidden
                >
                  <ArrowRight className="size-5 rotate-90 text-primary md:rotate-0" />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </SectionContainer>
  );
};
