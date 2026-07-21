"use client";

import Image from "next/image";
import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProcessBlocksContent } from "./ProcessBlocksContent";
import { ProcessIllustration } from "./ProcessIllustration";
import { SectionContainer } from "./SectionContainer";
import { BRAND_BLUE, BRAND_BLUE_PROCESS } from "./data/home-data";
import type { HomeProcessSectionData } from "./types/home-page.types";

type ProcessSectionProps = {
  data: HomeProcessSectionData;
};

export function ProcessSection({ data }: ProcessSectionProps) {
  const [activeTabId, setActiveTabId] = useState(data.tabs[0]?.id ?? "");

  if (!data.tabs.length) {
    return null;
  }

  const activeTab =
    data.tabs.find((tab) => tab.id === activeTabId) ?? data.tabs[0];

  return (
    <SectionContainer className="bg-white py-12 lg:py-16">
      <div className="mb-8 sm:mb-10">
        <ProcessBlocksContent content={data.title} variant="title" />
      </div>

      <div className="flex justify-center">
        <div
          className="inline-flex rounded-xl bg-white p-1.5 shadow-[0_4px_24px_rgba(15,23,42,0.08)]"
          role="tablist"
          aria-label="Proceso automotriz"
        >
          {data.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab.id === tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={cn(
                "rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors sm:px-6 sm:py-3",
                activeTab.id === tab.id
                  ? "text-white"
                  : "text-slate-900 hover:text-slate-700",
              )}
              style={
                activeTab.id === tab.id ? { backgroundColor: BRAND_BLUE } : undefined
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="mt-8 overflow-hidden rounded-3xl p-8 sm:p-10 lg:mt-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-14 xl:p-16"
        style={{ backgroundColor: BRAND_BLUE_PROCESS }}
        role="tabpanel"
      >
        <div className="max-w-lg">
          <p
            className="inline-flex items-center gap-2 text-lg font-bold sm:text-xl"
            style={{ color: BRAND_BLUE }}
          >
            <Check className="size-5 shrink-0 stroke-[3]" aria-hidden />
            {activeTab.heading}
          </p>
          <div className="mt-5">
            <ProcessBlocksContent
              content={activeTab.description}
              variant="description"
            />
          </div>
        </div>

        <div className="mt-8 flex min-h-[220px] items-center justify-center lg:mt-0 lg:min-h-[260px]">
          {activeTab.image_url ? (
            <Image
              src={activeTab.image_url}
              alt={activeTab.image_alt ?? activeTab.heading}
              width={420}
              height={280}
              className="max-w-md object-contain"
              style={{ width: "100%", height: "auto" }}
              sizes="(max-width: 1024px) 100vw, 420px"
            />
          ) : (
            <ProcessIllustration />
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
