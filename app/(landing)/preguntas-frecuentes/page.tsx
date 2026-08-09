import { LandingHeader } from "@/components/ui/landingHeader";

import { FaqPageContent } from "./components/FaqPageContent";
import { getFaqPageData } from "./services/getFaqPageData";

export default async function PreguntasFrecuentes() {
  let error_message: string | null = null;
  let content = null;

  try {
    content = await getFaqPageData();
  } catch (error) {
    error_message =
      error instanceof Error
        ? error.message
        : "No se pudieron cargar las preguntas frecuentes.";
  }

  const faqs =
    content?.faqs?.filter((item) => item.pregunta?.trim()) ?? [];
  const heroTitle = content?.hero?.titulo?.trim() || "Preguntas frecuentes";
  const heroDescription = content?.hero?.descripcion?.trim() || undefined;

  return (
    <>
      <LandingHeader title={heroTitle} description={heroDescription} />

      <div className="min-h-[60vh] w-full bg-[#F5F7FB] px-4 py-10 md:py-14">
        {error_message ? (
          <div className="mx-auto max-w-6xl rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error_message}
          </div>
        ) : null}

        {!error_message && faqs.length === 0 ? (
          <div className="mx-auto max-w-6xl rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No hay preguntas publicadas todavía.
          </div>
        ) : null}

        {!error_message && faqs.length > 0 ? (
          <FaqPageContent faqs={faqs} soporte={content?.soporte ?? null} />
        ) : null}
      </div>
    </>
  );
}
