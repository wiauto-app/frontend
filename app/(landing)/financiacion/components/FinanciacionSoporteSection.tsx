"use client";

import type { StrapiHero } from "@/interfaces/strapi-components.interface";
import { resolveStrapiIconName } from "@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName";
import { IconContainer } from "@/components/ui/iconContainer";
import Image from "next/image";

interface FinanciacionSoporteSectionProps {
  hero: StrapiHero;
}

export const FinanciacionSoporteSection = ({
  hero,
}: FinanciacionSoporteSectionProps) => {
  const caracteristicasStrapi = hero?.caracteristicas ?? [];
  const imageUrl = hero?.imagen?.url || "";
  return (
    <section id="aliado" className="py-2">
      <div className="bg-[#f4f7fc]/90 border border-slate-100/80 rounded-[20px] pr-4 pl-0 py-0 sm:pr-8 shadow-xs relative overflow-hidden flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
        <div className="relative w-full h-48 sm:h-56 lg:w-60 lg:h-auto xl:w-67.5 shrink-0 bg-slate-200">
          <Image
            src={imageUrl}
            alt={hero?.titulo || "Respaldo que te da tranquilidad"}
            className="w-full h-full object-cover object-top"
            width={500}
            height={500}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center gap-3 px-5 pb-5 ">
          <div>
      
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mt-0.5">
              {hero?.titulo || "Respaldo que te da tranquilidad"}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
              {hero?.descripcion ||
                "Trabajamos con un aliado sólido que comparte nuestro compromiso de brindarte la mejor experiencia."}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5  lg:gap-2 pt-1">
            {caracteristicasStrapi.map((item, idx: number) => {
              const Icon = resolveStrapiIconName(item.iconName);
              const label = item.label;
              const desc = item.descripcion;

              return (
                <div key={idx} className="flex flex-col items-center gap-0.5 ">
                  <IconContainer Icon={Icon} />

                  <span className="text-xs font-extrabold text-blue-600 leading-none text-center">
                    {label}
                  </span>
                  {desc && (
                    <span className="text-[9px] text-slate-500 leading-tight max-w-30 text-center">
                      {desc}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

    
      </div>
    </section>
  );
};
