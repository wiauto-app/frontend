import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  Car,
  CirclePlus,
  CreditCard,
  HelpCircle,
  Newspaper,
  Percent,
  Rss,
  Scale,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";

export const BRAND_BLUE = "#0061F2";

export interface NavLinkGroup {
  label: string;
  Icon?: LucideIcon;
  items: NavLink[];
}

export interface NavLink {
  href?: string;
  label: string;
  Icon?: LucideIcon;
  description?: string;
  items?: NavLink[];
  itemsGroups?: NavLinkGroup[];
}

export const getNavLinkChildItems = (
  link: Pick<NavLink, "items" | "itemsGroups">,
): NavLink[] => {
  if (link.itemsGroups?.length) {
    return link.itemsGroups.flatMap((group) => group.items);
  }

  return link.items ?? [];
};

export const NAV_LINKS: NavLink[] = [
  {
    label: "Comprar",
    itemsGroups: [
      {
        label: "Vehículos",
        Icon: Car,
        items: [
          {
            href: "/vehiculos",
            label: "Vehículos de segunda mano",
          },
          {
            href: "/vehiculos?km_hasta=5000",
            label: "Vehículos 0 km",
          },
          {
            href: "/vehiculos?combustible=electrico",
            label: "Eléctricos",
          },
          {
            href: "/vehiculos?combustible=hibrido",
            label: "Híbridos",
          },
        ],
      },
      {
        label: "Tipo de vendedor",
        Icon: Users,
        items: [
          {
            href: "/vehiculos?publisher_types=professional",
            label: "Profesional",
          },
          {
            href: "/vehiculos?publisher_types=particular",
            label: "Particular",
          },
        ],
      },
      {
        label: "Tendencias",
        Icon: TrendingUp,
        items: [
          {
            label: "Recién publicados",
            href: "/vehiculos",
          },
          {
            label: "Más vistos",
            href: "/vehiculos?orden=views-desc",
          },
          {
            label: "Más baratos",
            href: "/vehiculos?orden=price-asc",
          },
        ],
      },
    ],
  },
  {
    label: "Vender",
    items: [
      {
        href: "/publicar",
        label: "Publicar vehículo",
        Icon: CirclePlus,
        description: "Crea tu anuncio y llega a compradores en minutos",
      },
      {
        href: "/tasador",
        label: "Tasador",
        Icon: Calculator,
        description: "Obtén una valoración orientativa de tu vehículo",
      },
      {
        href: "/simulador",
        label: "Simulador de financiación",
        Icon: Percent,
        description: "Calcula cuotas y compara opciones de pago",
      },
    ],
  },
  {
    label: "Servicios",
    items: [
      {
        href: "/informe-historial-vehiculo",
        label: "Informe del historial del vehículo",
        Icon: Car,
        description: "Conoce el historial del vehículo",
      },
      {
        href: "/revision-vehiculo",
        label: "Revisa tu vehículo por un profesional",
        Icon: Scale,
        description: "Revisa tu vehículo por un profesional",
      },
      {
        href: "/garantia-mecanica",
        label: "Solicita una garantía mecánica",
        Icon: CreditCard,
        description: "Solicita una garantía mecánica",
      },
      {
        href: "/transferir-vehiculo",
        label: "Transferir coche",
        Icon: CreditCard,
        description: "Transferir coche",
      },
     
    ],
  },
  {
    label: "Herramientas",
    items: [
      {
        href: "/tasador",
        label: "Valorar mi coche",
        Icon: Car,
        description: "Conoce el precio del mercado",
      },
      {
        href: "/vehiculos",
        label: "Comparador de coches",
        Icon: Scale,
        description: "Compara y elige mejor",
      },
      {
        href: "/simulador-financiamiento",
        label: "Simulador de financiación",
        Icon: CreditCard,
        description: "Calcula tu cuota mensual",
      },
      {
        href: "/seguros",
        label: "Calculadora de seguro",
        Icon: Shield,
        description: "Calcula tu seguro",
      },
    ],
  },
  {
    label: "Noticias",
    items: [
      {
        href: "/prensa",
        label: "Prensa",
        Icon: Newspaper,
        description: "Cobertura y menciones de WiAuto en medios",
      },
      {
        href: "/noticias",
        label: "Noticias",
        Icon: Rss,
        description: "Novedades del marketplace y del sector",
      },
      {
        href: "/preguntas-frecuentes",
        label: "Preguntas frecuentes",
        Icon: HelpCircle,
        description: "Respuestas rápidas a las dudas más comunes",
      },
    ],
  },
  { href: "/concesionarias", label: "Concesionarios" },
];

export const isNavLinkActive = (pathname: string, href?: string): boolean => {
  if (!href) {
    return false;
  }

  const path = href.split("?")[0] ?? href;

  if (path === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(path);
};

export const isNavLinkGroupActive = (
  pathname: string,
  items?: NavLink[],
): boolean => {
  if (!items?.length) {
    return false;
  }

  return items.some((item) => isNavLinkActive(pathname, item.href));
};

export const isNavEntryActive = (
  pathname: string,
  link: Pick<NavLink, "href" | "items" | "itemsGroups">,
): boolean => {
  const children = getNavLinkChildItems(link);

  if (children.length > 0) {
    return isNavLinkGroupActive(pathname, children);
  }

  return isNavLinkActive(pathname, link.href);
};

export const isServicesNavActive = (pathname: string): boolean =>
  pathname.startsWith("/servicios");
