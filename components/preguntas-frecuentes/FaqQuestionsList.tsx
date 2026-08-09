"use client";

import { resolveStrapiIconName } from "@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IconContainer } from "@/components/ui/iconContainer";
import type { StrapiFaq } from "@/interfaces/strapi-components.interface";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

interface FaqQuestionsListProps {
  items: StrapiFaq[];
}

export const FaqQuestionsList = ({ items }: FaqQuestionsListProps) => (
  <div className="mx-auto w-full max-w-xl">
    <Accordion>
      {items.map((item) => {
        const Icon = resolveStrapiIconName(item.iconName);
        const pregunta = item.pregunta?.trim() ?? "";
        const respuesta = item.respuesta;

        return (
          <AccordionItem key={item.id} value={String(item.id)}>
            <AccordionTrigger className="text-base font-medium text-gray-900">
              <span className="flex items-start gap-2 text-left">
                {Icon ? (
                  <IconContainer
                    Icon={Icon}
                    size="xs"
                    className="mt-0.5 shrink-0"
                  />
                ) : null}
                <span className="flex flex-col gap-0.5">
                  {item.categoria ? (
                    <span className="text-[10px] font-semibold tracking-wide text-primary uppercase">
                      {item.categoria}
                    </span>
                  ) : null}
                  <span>{pregunta}</span>
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="leading-relaxed text-gray-600">
              {respuesta && respuesta.length > 0 ? (
                <BlocksRenderer
                  content={respuesta as BlocksContent}
                  blocks={{
                    paragraph: ({ children }) => (
                      <p className="mb-2 leading-relaxed">{children}</p>
                    ),
                  }}
                />
              ) : (
                <p className="text-sm text-gray-500">
                  Sin respuesta disponible.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  </div>
);
