const EDIT_VEHICLE_ROUTE_PREFIX = "/editar-vehiculo/";

/**
 * Rutas de formulario donde los elementos flotantes (banner de la app, widget
 * de WiAuto AI) tapan campos en móvil y distraen del objetivo principal.
 */
export const isFocusedFlowPath = (pathname: string | null | undefined): boolean => {
  if (!pathname) {
    return false;
  }

  return (
    pathname === "/publicar" || pathname.startsWith(EDIT_VEHICLE_ROUTE_PREFIX)
  );
};
