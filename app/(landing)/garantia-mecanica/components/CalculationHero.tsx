"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_TRUST_BADGES } from "../constants";
import { GuaranteePreviewCard } from "./GuaranteePreviewCard";
import { SectionHeading } from "@/components/home/SectionHeading";

export const CalculationHero = () => {
  return (
    <div className="grid items-center gap-5 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <SectionHeading

            className="text-start"
            description="Protección frente a averías mecánicas, eléctricas y electrónicas
                seleccionadas. Sin letra pequeña. Sin sorpresas."
            lead="Conduce tranquilo. Nosotros cubrimos los imprevistos."
          />
        </div>

        {/* Trust Badges */}
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
          {HERO_TRUST_BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <li key={badge.label} className="flex items-center gap-2">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/30 text-primary">
                  <Icon className="size-3" aria-hidden />
                </div>
                <span className="text-xs font-medium text-slate-600">
                  {badge.label}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Action CTA with hand-drawn arrow */}
        <div className="flex items-center gap-4 pt-2">
          <Button
            size="lg"
            className="h-12 rounded-xl bg-primary px-7 text-sm font-bold text-white shadow-md hover:bg-primary/95 transition-all"
          >
            Calcular mi garantía
            <ChevronRight className="ml-1 size-4" />
          </Button>

  
        </div>
      </div>

      <div className="relative flex justify-center lg:justify-end">
     

        <div className="relative z-10 w-full flex justify-center lg:justify-end">
          <GuaranteePreviewCard />
        </div>
      </div>
    </div>
  );
};
