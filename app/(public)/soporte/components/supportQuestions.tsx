import { FaqQuestionsList } from "@/components/preguntas-frecuentes/FaqQuestionsList";
import type {
  FaqItem,
  StrapiBlock,
} from "@/components/preguntas-frecuentes/types/faq.types";
import { Card, CardContent } from "@/components/ui/card";
import { PageSectionTitle } from "@/components/ui/pageSectionTitle";

import type {
  SoportePreguntaItem,
  SoportePreguntas,
} from "../interfaces/soporte.interface";

interface SupportQuestionsProps {
  data: SoportePreguntas | null;
}

const mapSoportePreguntasToFaqItems = (
  items: SoportePreguntaItem[] | null | undefined,
): FaqItem[] => {
  if (!items?.length) {
    return [];
  }

  return items
    .filter((item) => item.pregunta?.trim())
    .map((item) => ({
      id: String(item.id),
      pregunta: item.pregunta?.trim() ?? "",
      respuesta: Array.isArray(item.respuesta)
        ? (item.respuesta as unknown as StrapiBlock[])
        : [],
    }));
};

export const SupportQuestions = ({ data }: SupportQuestionsProps) => {
  if (!data) {
    return null;
  }

  const items = mapSoportePreguntasToFaqItems(data.preguntas);

  return (
    <section className="flex flex-col gap-6">
      <PageSectionTitle
        title={data.header?.titulo ?? "Preguntas frecuentes"}
        description={data.header?.descripcion ?? ""}
      />

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardContent className="grid grid-cols-1 p-0 lg:grid-cols-2">
          <div className="flex w-full items-start justify-center overflow-y-auto bg-white p-6 sm:p-8">
            {items.length === 0 ? (
              <div className="w-full max-w-xl rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                No hay preguntas publicadas todavía.
              </div>
            ) : (
              <FaqQuestionsList items={items} />
            )}
          </div>

          <div className="relative hidden overflow-hidden lg:flex lg:min-h-80">
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-600 to-blue-800">
              <span className="text-7xl font-bold tracking-tighter text-white">
                W
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
