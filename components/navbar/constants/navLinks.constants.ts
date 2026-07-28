export const BRAND_BLUE = "#0061F2";

export const NAV_LINKS = [
  { href: "/concesionarias", label: "Concesionarios" },
  { href: "/noticias", label: "Noticias" },
  { href: "/prensa", label: "Prensa" },
  { href: "/tasador", label: "Tasador" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
] as const;

export const isNavLinkActive = (pathname: string, href: string): boolean => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
};

export const isServicesNavActive = (pathname: string): boolean =>
  pathname.startsWith("/servicios");
