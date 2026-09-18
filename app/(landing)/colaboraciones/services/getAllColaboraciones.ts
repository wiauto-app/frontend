import { getAllColaboraciones as getFromService } from "@/services/colaboracionesService";
import type { StrapiColaboracionLanding } from "@/interfaces/landings-colaboracion.interface";

/**
 * Server wrapper para fetch todas las colaboraciones (para navbar).
 * Cache: 30 minutos (configurado en colaboracionesService).
 */
export const getAllColaboraciones = async (): Promise<StrapiColaboracionLanding[]> => {
  return getFromService();
};
