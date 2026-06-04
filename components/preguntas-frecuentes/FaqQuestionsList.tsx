"use client";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "./types/faq.types";

type FaqQuestionsListProps = {
  items: FaqItem[];
};

export const FaqQuestionsList = ({ items }: FaqQuestionsListProps) => (
  <div className="w-full max-w-xl mx-auto">
    <Accordion>
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className="text-base font-medium text-gray-900">
            {item.pregunta}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 leading-relaxed">
            {item.respuesta.length > 0 ? (
              <BlocksRenderer
                content={item.respuesta as unknown as BlocksContent}
                blocks={{
                  paragraph: ({ children }) => (
                    <p className="mb-2 leading-relaxed">{children}</p>
                  ),
                }}
              />
            ) : (
              <p className="text-sm text-gray-500">Sin respuesta disponible.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);
