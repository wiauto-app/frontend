import { PreguntasSection as PreguntasSectionInterface } from "../interfaces/vender-vehiculo.interface";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { StrapiRenderer } from "@/components/ui/strapiRenderer";
import { Button } from "@/components/ui/button";
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
          {data.pregunta.map((item) => (
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
                    <StrapiRenderer content={item.descripcion as BlocksContent} />
                  ) : null}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 text-xs md:text-sm gap-3 justify-start">
          <Button variant="outline" className="rounded-full bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 hover:text-blue-700 font-medium">
            Vender mi coche rápido
          </Button>
          <Button variant="outline" className="rounded-full bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 hover:text-blue-700 font-medium">
            Vender coche sin intermediarios
          </Button>
          <Button variant="outline" className="rounded-full bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 hover:text-blue-700 font-medium">
            Vender coche usado
          </Button>
          <Button variant="outline" className="rounded-full bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 hover:text-blue-700 font-medium">
            Vender coche online
          </Button>
          <Button variant="outline" className="rounded-full bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 hover:text-blue-700 font-medium">
            Vender coche en mi ciudad
          </Button>
          <Button variant="outline" className="rounded-full bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 hover:text-blue-700 font-medium">
            Vender coche con garantía
          </Button>
        </div>
      </div>
    </section>
  );
}
