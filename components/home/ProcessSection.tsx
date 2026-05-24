"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProcessIllustration } from "./ProcessIllustration";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";
import {
  BRAND_BLUE,
  BRAND_BLUE_PROCESS,
  PROCESS_CONTENT,
  PROCESS_TABS,
  type ProcessTabId,
} from "./data/home-data";

export function ProcessSection() {
  const [activeTab, setActiveTab] = useState<ProcessTabId>("comprar");
  const content = PROCESS_CONTENT[activeTab];

  return (
    <SectionContainer className="bg-white py-12 lg:py-16">
      <SectionHeading
        lead="Te acompañamos de tu"
        highlight="experiencia automotriz"
        className="mb-8 sm:mb-10"
      />

      <div className="flex justify-center">
        <div className="inline-flex rounded-xl bg-white p-1.5 shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
          {PROCESS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors sm:px-6 sm:py-3",
                activeTab === tab.id
                  ? "text-white"
                  : "text-slate-900 hover:text-slate-700",
              )}
              style={activeTab === tab.id ? { backgroundColor: BRAND_BLUE } : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="mt-8 overflow-hidden rounded-3xl p-8 sm:p-10 lg:mt-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-14 xl:p-16"
        style={{ backgroundColor: BRAND_BLUE_PROCESS }}
      >
        <div className="max-w-lg">
          <p
            className="inline-flex items-center gap-2 text-lg font-bold sm:text-xl"
            style={{ color: BRAND_BLUE }}
          >
            <Check className="size-5 shrink-0 stroke-[3]" aria-hidden />
            {content.heading}
          </p>
          <p className="mt-5 text-sm leading-relaxed text-slate-500 sm:text-base">
            {content.description}
          </p>
        </div>

        <div className="mt-8 flex min-h-[220px] items-center justify-center lg:mt-0 lg:min-h-[260px]">
          <ProcessIllustration />
        </div>
      </div>
    </SectionContainer>
  );
}
