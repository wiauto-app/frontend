import React from "react";
import type { StrapiFinanciacionAdvantages } from "@/interfaces/strapi-components.interface";
import { resolveStrapiIconName } from "@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName";
import { IconContainer } from "@/components/ui/iconContainer";
import {
  ShieldCheck,
  Percent,
  CalendarDays,
  FileText,
  Users,
} from "lucide-react";

interface FinanciacionVentajasSectionProps {
  data: StrapiFinanciacionAdvantages;
}

export const FinanciacionVentajasSection = ({
  data,
}: FinanciacionVentajasSectionProps) => {
  const title =
    data?.header?.titulo || "Ventajas exclusivas para la comunidad de WiAuto";

  return (
    <section className="py-6">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
        {data?.header?.descripcion && (
          <p className="mt-2 text-slate-600 text-xs sm:text-sm">
            {data.header.descripcion}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {data?.caracteristicas?.map((item, idx: number) => {
          const StrapiIcon = resolveStrapiIconName(item.iconName);
          const label = item.label;
          const desc = item.descripcion;

          return (
            <div
              key={idx}
              className="bg-white border border-slate-100/90 rounded-2xl p-5 flex flex-col items-center text-center gap-3 shadow-xs hover:shadow-md transition-shadow"
            >
              <IconContainer Icon={StrapiIcon} />
              <h3 className="text-sm font-bold text-slate-900">{label}</h3>
              {desc && (
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {desc}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
