import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  Car,
  CirclePlus,
  CreditCard,
  HelpCircle,
  Rss,
  TrendingUp,
  Users,
} from "lucide-react";

export const BRAND_BLUE = "#0061F2";
const BASE_VEHICLES_URL = "/vehiculos";
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
            href: `${BASE_VEHICLES_URL}/estado-usado`,
            label: "Vehículos de segunda mano",
          },
          // {
          //   href: "/vehiculos?km_hasta=5000",
          //   label: "Vehículos 0 km",
          // },
       
          {
            href: `${BASE_VEHICLES_URL}/combustible-hibrido`,
            label: "Híbridos",
          },
          {
            href: `${BASE_VEHICLES_URL}/combustible-electrico`,
            label: "Eléctricos",
          },
          {
            href: `${BASE_VEHICLES_URL}/estado-nuevo`,
            label: "Nuevos",
          },
        ],
      },
      {
        label: "Tipo de vendedor",
        Icon: Users,
        items: [
          {
            href: `${BASE_VEHICLES_URL}/vendedor-profesional`,
            label: "Profesional",
          },
          {
            href: `${BASE_VEHICLES_URL}/vendedor-particular`,
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
            href: `${BASE_VEHICLES_URL}`,
          },
          {
            label: "Más vistos",
            href: `${BASE_VEHICLES_URL}?orden=views-desc`,
          },
          {
            label: "Más baratos",
            href: `${BASE_VEHICLES_URL}?orden=price-asc`,
          },
        ],
      },
    ],
  },


  //     // {
  //     //   href: "/simulador",
  //     //   label: "Simulador de financiación",
  //     //   Icon: Percent,
  //     //   description: "Calcula cuotas y compara opciones de pago",
  //     // },
  //   ],
  // },
  {
    label: "Herramientas",
    items: [
      {
        href: "/vender-vehiculo",
        label: "Vender mi coche",
        Icon: CirclePlus,
        description: "Crea tu anuncio y llega a compradores en minutos",
      },
      {
        href: "/tasador",
        label: "Valorar mi coche",
        Icon: Car,
        description: "Conoce el precio del mercado",
      },
     
      // {
      //   href: "/comparador",
      //   label: "Comparador de coches",
      //   Icon: Scale,
      //   description: "Compara y elige mejor",
      // },
      {
        href: "/simulador-financiacion",
        label: "Simulador de financiación",
        Icon: CreditCard,
        description: "Calcula tu cuota mensual",
      },
    ],
  },
  {
    label: "Noticias",
    items: [
      // {
      //   href: "/prensa",
      //   label: "Prensa",
      //   Icon: Newspaper,
      //   description: "Cobertura y menciones de WiAuto en medios",
      // },
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
  { href: "/concesionarios", label: "Concesionarios" },
  { href: "/contacto", label: "Contacto" },
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
