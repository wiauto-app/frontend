import { PreguntasSection as PreguntasSectionInterface } from "../interfaces/vender-vehiculo.interface";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { StrapiRenderer } from "@/components/ui/strapiRenderer";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

interface Props {
  data: PreguntasSectionInterface;
}

export function PreguntasSection({ data }: Props) {
  return (
    <section className="py-5 bg-white">
      <div className="container mx-auto  max-w-6xl px-4 md:px-0">
        <h2 className="text-xl md:text-3xl font-bold tracking-tight text-slate-900 mb-10 text-start">
          {data.titulo}
        </h2>

        <Accordion className="w-full space-y-4">
          {(data.pregunta ?? []).map((item) => (
            <AccordionItem
              key={item.id}
              value={`item-${item.id}`}
              className="border border-slate-200 rounded-lg px-6 data-[state=open]:bg-slate-50 transition-colors"
            >
              <AccordionTrigger className="hover:no-underline text-base font-semibold text-slate-800 py-5">
                {item.titulo}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600">
                <div className="prose prose-slate max-w-none">
                  {item.descripcion ? (
                    <StrapiRenderer
                      content={item.descripcion as BlocksContent}
                    />
                  ) : null}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
