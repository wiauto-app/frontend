import { FaqQuestionsList } from "@/components/preguntas-frecuentes/FaqQuestionsList";
import { getFaqData } from "@/components/preguntas-frecuentes/services/faqService";
import type { FaqItem } from "@/components/preguntas-frecuentes/types/faq.types";
import { Card, CardContent } from "@/components/ui/card";

export default async function PreguntasFrecuentes() {
  let items: FaqItem[] = [];
  let error_message: string | null = null;

  try {
    items = await getFaqData();
  } catch (error) {
    error_message =
      error instanceof Error
        ? error.message
        : "No se pudieron cargar las preguntas frecuentes.";
  }

  return (
    <>
      <div className="w-full bg-[#DBE6F8] from-blue-700 to-blue-600 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-start mb-4 flex items-center gap-3">
            <span className="text-black">Preguntas</span>
            <span className="text-blue-700">frecuentes</span>
          </h1>
          <div className="w-20 h-1 bg-blue-700 mt-4" />
        </div>
      </div>
      <div className="flex min-h-[60vh] items-center justify-center p-4 w-full">
        <Card className="container-custom mx-auto">
          <CardContent className="grid grid-cols-1 lg:grid-cols-2">
            <div className="w-full  flex items-start justify-center p-8 bg-white overflow-y-auto">
              {error_message ? (
                <div className="w-full max-w-xl rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error_message}
                </div>
              ) : null}

              {!error_message && items.length === 0 ? (
                <div className="w-full max-w-xl rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                  No hay preguntas publicadas todavía.
                </div>
              ) : null}

              {!error_message && items.length > 0 ? (
                <FaqQuestionsList items={items} />
              ) : null}
            </div>
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <span className="text-white text-7xl font-bold tracking-tighter">
                  W
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
