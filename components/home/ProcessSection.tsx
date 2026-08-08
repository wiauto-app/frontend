"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useState } from "react";

import type { StrapiProcessSection } from "@/interfaces/strapi-components.interface";
import { getStrapiMediaUrl } from "@/lib/strapi-media";
import { cn } from "@/lib/utils";

import { BRAND_BLUE, BRAND_BLUE_PROCESS } from "./data/home-data";
import { ProcessBlocksContent } from "./ProcessBlocksContent";
import { ProcessIllustration } from "./ProcessIllustration";
import { SectionContainer } from "./SectionContainer";

interface ProcessSectionProps {
  data: StrapiProcessSection | null | undefined;
}

export function ProcessSection({ data }: ProcessSectionProps) {
  const tabs = data?.tabs ?? [];
  const [active_tab_id, setActiveTabId] = useState<number | null>(
    tabs[0]?.id ?? null,
  );

  if (!data || tabs.length === 0) {
    return null;
  }

  const active_tab =
    tabs.find((tab) => tab.id === active_tab_id) ?? tabs[0];
  const active_image_url = getStrapiMediaUrl(active_tab.image?.url);
  const active_heading = active_tab.titulo?.trim() || active_tab.tab?.trim() || "";

  return (
    <SectionContainer className="bg-white py-12 lg:py-16">
      <div className="mb-8 sm:mb-10">
        <ProcessBlocksContent content={data.titulo} variant="title" />
      </div>

      <div className="flex justify-center">
        <div
          className="inline-flex rounded-xl bg-white p-1.5 shadow-[0_4px_24px_rgba(15,23,42,0.08)]"
          role="tablist"
          aria-label="Proceso de automoción"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active_tab.id === tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={cn(
                "rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors sm:px-6 sm:py-3",
                active_tab.id === tab.id
                  ? "text-white"
                  : "text-slate-900 hover:text-slate-700",
              )}
              style={
                active_tab.id === tab.id
                  ? { backgroundColor: BRAND_BLUE }
                  : undefined
              }
            >
              {tab.tab}
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
          {active_heading ? (
            <p
              className="inline-flex items-center gap-2 text-lg font-bold sm:text-xl"
              style={{ color: BRAND_BLUE }}
            >
              <Check className="size-5 shrink-0 stroke-[3]" aria-hidden />
              {active_heading}
            </p>
          ) : null}
          <div className="mt-5">
            <ProcessBlocksContent
              content={active_tab.descripcion}
              variant="description"
            />
          </div>
        </div>

        <div className="mt-8 flex min-h-[220px] items-center justify-center lg:mt-0 lg:min-h-[260px]">
          {active_image_url ? (
            <Image
              src={active_image_url}
              alt={
                active_tab.image?.alternativeText?.trim() ||
                active_heading ||
                "Ilustración del proceso"
              }
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
