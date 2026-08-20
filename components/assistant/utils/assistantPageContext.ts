export const ASSISTANT_PAGE_ROUTES = [
  "/",
  "/vehiculos",
  "/concesionarias",
  "/noticias",
] as const;

export type AssistantPageRoute = (typeof ASSISTANT_PAGE_ROUTES)[number];
export type AssistantPageContext = "home" | "vehicles" | "dealerships" | "news";

export const resolveAssistantPageRoute = (pathname: string): AssistantPageRoute => {
  if (pathname.startsWith("/vehiculos") || pathname.startsWith("/vehiculo/")) {
    return "/vehiculos";
  }
  if (pathname.startsWith("/concesionarias") || pathname.startsWith("/concesionaria/")) {
    return "/concesionarias";
  }
  if (pathname.startsWith("/noticias")) {
    return "/noticias";
  }
  return "/";
};

export const resolveAssistantPageContext = (
  pathname: string,
): AssistantPageContext => {
  if (pathname.startsWith("/asistente")) {
    return "vehicles";
  }

  const route = resolveAssistantPageRoute(pathname);
  return {
    "/": "home",
    "/vehiculos": "vehicles",
    "/concesionarias": "dealerships",
    "/noticias": "news",
  }[route] as AssistantPageContext;
};
