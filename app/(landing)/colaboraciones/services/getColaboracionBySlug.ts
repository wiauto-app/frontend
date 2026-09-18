import { getColaboracionBySlug as getFromService } from "@/services/colaboracionesService";
import type { ColaboracionLanding } from "@/interfaces/landings-colaboracion.interface";

/**
 * Server wrapper para fetch colaboración por slug.
 * Propaga errores de forma que se puedan capturar en page.tsx.
 */
export const getColaboracionBySlug = async (
  slug: string,
): Promise<ColaboracionLanding | null> => {
  return getFromService(slug);
};
