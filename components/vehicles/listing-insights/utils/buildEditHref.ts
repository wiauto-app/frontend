import type { ListingEditTarget } from "@/interfaces/vehicle-insights.interface";

/**
 * Enlace al editor del anuncio. Todos los tipos de publicador comparten
 * `/editar-vehiculo/:id` (el editor profesional redirige ahí).
 *
 * `target` se acepta ya para cuando el editor soporte abrir una sección
 * concreta (`?seccion=`); hoy no se envía para no romper la ruta.
 */
export const buildEditHref = (
  vehicleId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- reservado para `?seccion=`
  _target?: ListingEditTarget,
): string => `/editar-vehiculo/${vehicleId}`;
