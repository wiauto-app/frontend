"use client";

import { resolveStrapiIconName } from "@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { StrapiFaq } from "@/interfaces/strapi-components.interface";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import { HiOutlineCollection } from "react-icons/hi";

import type { FaqCategoryGroup } from "../utils/groupFaqsByCategory";

interface FaqCategorySectionProps {
  group: FaqCategoryGroup;
}

export const FaqCategorySection = ({ group }: FaqCategorySectionProps) => {
  const Icon = resolveStrapiIconName(group.iconName) ?? HiOutlineCollection;

  return (
    <section className="flex flex-col gap-3" aria-labelledby={`faq-${group.categoria}`}>
      <h2
        id={`faq-${group.categoria}`}
        className="flex items-center gap-2 text-base font-bold text-slate-900"
      >
        <Icon className="size-5 text-primary" aria-hidden />
        {group.categoria}
      </h2>

      <Accordion className="gap-2">
        {group.items.map((item, index) => (
          <FaqQuestionCard key={item.id} item={item} index={index + 1} />
        ))}
      </Accordion>
    </section>
  );
};

interface FaqQuestionCardProps {
  item: StrapiFaq;
  index: number;
}

const FaqQuestionCard = ({ item, index }: FaqQuestionCardProps) => {
  const pregunta = item.pregunta?.trim() ?? "";
  const respuesta = item.respuesta;

  return (
    <AccordionItem
      value={String(item.id)}
      className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs not-last:border-b-0"
    >
      <AccordionTrigger className="gap-3 px-4 py-3.5 hover:no-underline data-panel-open:bg-slate-50/60">
        <span className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary tabular-nums">
            {index}
          </span>
          <span className="text-sm font-semibold text-slate-900">{pregunta}</span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-slate-600">
        <div className="pl-10">
          {respuesta && respuesta.length > 0 ? (
            <BlocksRenderer
              content={respuesta as BlocksContent}
              blocks={{
                paragraph: ({ children }) => (
                  <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                ),
              }}
            />
          ) : (
            <p className="text-slate-500">Sin respuesta disponible.</p>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
