import { getFaqData } from "@/components/preguntas-frecuentes/services/faqService";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { BlocksRenderer, type BlocksContent } from "@strapi/blocks-react-renderer";
import type { FaqItem } from "@/components/preguntas-frecuentes/types/faq.types";

const QuestionsList = ({ items }: { items: FaqItem[] }) => (
  <div className="w-full max-w-xl mx-auto">
    <Accordion>
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className="text-base font-medium text-gray-900">
            {item.pregunta}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 leading-relaxed">
            <BlocksRenderer content={item.respuesta as unknown as BlocksContent} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

export default async function PreguntasFrecuentes() {
  const { items } = await getFaqData();

  return (
    <>
      <div className="w-full bg-[#DBE6F8] from-blue-700 to-blue-600 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-start mb-4">
            <span className="text-black">Preguntas</span>
            <span className="text-blue-700">frecuentes</span>
          </h1>
          <div className="w-20 h-1 bg-blue-700 mt-4" />
        </div>
      </div>
      <div className="flex min-h-[60vh] items-center justify-center p-4 w-full">
        <div className="flex w-full max-w-8xl overflow-hidden rounded-2xl shadow-xl">
          <div className="w-full lg:w-[50%] flex items-start justify-center p-8 bg-white overflow-y-auto">
            <QuestionsList items={items} />
          </div>
          <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <span className="text-white text-7xl font-bold tracking-tighter">W</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
