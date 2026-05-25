"use client";

import { Send } from "lucide-react";
import type { HomeNewsletterData } from "./types/home-page.types";
import { SectionContainer } from "./SectionContainer";
import { BRAND_BLUE, BRAND_BLUE_LIGHT } from "./data/home-data";

type NewsletterSectionProps = {
  data: HomeNewsletterData;
};

export function NewsletterSection({ data }: NewsletterSectionProps) {
  return (
    <SectionContainer className="py-14 lg:py-20" style={{ backgroundColor: BRAND_BLUE_LIGHT }}>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold sm:text-base" style={{ color: BRAND_BLUE }}>
          {data.subtitle}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl lg:text-[2rem]">
          {data.title}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base">
          {data.description}
        </p>

        <form
          className="mx-auto mt-8 flex max-w-md overflow-hidden rounded-lg bg-white shadow-sm"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            name="email"
            placeholder="Tu correo electrónico"
            required
            className="h-12 flex-1 border-0 bg-white px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="flex size-12 shrink-0 items-center justify-center text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BRAND_BLUE }}
            aria-label="Suscribirse"
          >
            <Send className="size-5" aria-hidden />
          </button>
        </form>
      </div>
    </SectionContainer>
  );
}
