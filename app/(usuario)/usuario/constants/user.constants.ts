import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  BarChart3,
  Calculator,
  HandCoins,
  Car,
  Heart,
  Search,
  MessageSquare,
  Bot,
  ContactRound,
  Bell,
  BellRing,
  Newspaper,
  User as UserIcon,
  CreditCard,
  Users,
  Building2,
  EyeOff,
  History,
  Landmark,
} from "lucide-react";
import type { DealershipMembership } from "@/services/dealerships/types/team.types";

const basePath = "/usuario";

export interface UserSidebarLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface UserSidebarSection {
  id: string;
  title: string;
  links: UserSidebarLink[];
}

const USER_SIDEBAR_LINK_INICIO: UserSidebarLink = {
  href: `${basePath}/inicio`,
  label: "Inicio",
  icon: LayoutGrid,
};

const USER_SIDEBAR_LINK_MIS_ANUNCIOS: UserSidebarLink = {
  href: `${basePath}/mis-anuncios`,
  label: "Mis anuncios",
  icon: Car,
};

const USER_SIDEBAR_LINK_MENSAJES: UserSidebarLink = {
  href: `${basePath}/mensajes`,
  label: "Mensajes (chat)",
  icon: MessageSquare,
};

const USER_SIDEBAR_LINK_CONTACTOS: UserSidebarLink = {
  href: `${basePath}/contactos`,
  label: "Contactos / Leads",
  icon: ContactRound,
};

const buildPrimaryPanelSection = (
  isSubscribed: boolean,
): UserSidebarSection => ({
  id: "overview",
  title: "Panel",
  links: [
    USER_SIDEBAR_LINK_INICIO,
    USER_SIDEBAR_LINK_MIS_ANUNCIOS,
    USER_SIDEBAR_LINK_MENSAJES,
    ...(isSubscribed ? [USER_SIDEBAR_LINK_CONTACTOS] : []),
  ],
});

const USER_SIDEBAR_SECTION_APPRAISALS: UserSidebarSection = {
  id: "appraisals",
  title: "Tasaciones",
  links: [
    {
      href: `${basePath}/mi-tasador`,
      label: "Mis tasaciones",
      icon: Calculator,
    },
  ],
};

const USER_SIDEBAR_SECTION_SEARCH: UserSidebarSection = {
  id: "search",
  title: "Búsqueda y guardados",
  links: [
    { href: `${basePath}/favoritos`, label: "Favoritos", icon: Heart },
    {
      href: `${basePath}/busquedas-guardadas`,
      label: "Búsquedas guardadas",
      icon: Search,
    },
    {
      href: `${basePath}/busquedas-recientes`,
      label: "Búsquedas recientes",
      icon: History,
    },
    {
      href: `${basePath}/descartados`,
      label: "Descartados",
      icon: EyeOff,
    },
  ],
};

const USER_SIDEBAR_SECTION_COMMUNICATION: UserSidebarSection = {
  id: "communication",
  title: "Comunicación",
  links: [
    { href: `${basePath}/notificaciones`, label: "Notificaciones", icon: Bell },
  ],
};

const USER_SIDEBAR_SECTION_ACCOUNT: UserSidebarSection = {
  id: "account",
  title: "Cuenta",
  links: [
    { href: `${basePath}/monetizacion`, label: "Planes", icon: CreditCard },
    { href: `${basePath}/perfil`, label: "Mi perfil", icon: UserIcon },
    { href: `${basePath}/newsletter`, label: "Newsletter", icon: Newspaper },
  ],
};

/** @deprecated Usar secciones; se mantiene para compatibilidad con imports antiguos. */
export const USER_SIDEBAR_LINKS: UserSidebarLink[] = [
  USER_SIDEBAR_LINK_INICIO,
  USER_SIDEBAR_LINK_MIS_ANUNCIOS,
  USER_SIDEBAR_LINK_MENSAJES,
  ...USER_SIDEBAR_SECTION_APPRAISALS.links,
  ...USER_SIDEBAR_SECTION_SEARCH.links,
  ...USER_SIDEBAR_SECTION_COMMUNICATION.links,
  ...USER_SIDEBAR_SECTION_ACCOUNT.links,
];

const USER_SIDEBAR_SECTION_LEADS: UserSidebarSection = {
  id: "leads",
  title: "Leads y ventas",
  links: [
    {
      href: `${basePath}/asistente-leads`,
      label: "Asistente de leads",
      icon: Bot,
    },
    {
      href: `${basePath}/alertas-proactivas`,
      label: "Alertas proactivas",
      icon: BellRing,
    },
  ],
};

const USER_SIDEBAR_SECTION_ANALYTICS: UserSidebarSection = {
  id: "analytics",
  title: "Análisis",
  links: [
    { href: `${basePath}/estadisticas`, label: "Estadísticas", icon: BarChart3 },
  ],
};

const USER_SIDEBAR_SECTION_DEALERSHIP: UserSidebarSection = {
  id: "dealership",
  title: "Concesionario",
  links: [
    {
      href: `${basePath}/concesionario`,
      label: "Perfil de tu concesionario",
      icon: Building2,
    },
    {
      href: `${basePath}/equipo`,
      label: "Equipo",
      icon: Users,
    },
    {
      href: `${basePath}/mi-financiacion`,
      label: "Mi financiación",
      icon: Landmark,
    },
  ],
};

const USER_SIDEBAR_SECTION_APPRAISAL_OPPORTUNITIES: UserSidebarSection = {
  id: "appraisal-opportunities",
  title: "Oportunidades",
  links: [
    {
      href: `${basePath}/oportunidades-tasacion`,
      label: "Oportunidades de tasación",
      icon: HandCoins,
    },
  ],
};

/** @deprecated Usar secciones pro en getUserSidebarSections. */
export const USER_SIDEBAR_PRO_LINKS = [
  USER_SIDEBAR_LINK_CONTACTOS,
  ...USER_SIDEBAR_SECTION_LEADS.links,
  ...USER_SIDEBAR_SECTION_ANALYTICS.links,
  ...USER_SIDEBAR_SECTION_DEALERSHIP.links,
] as UserSidebarLink[];

/** @deprecated Usar secciones en getUserSidebarSections. */
export const USER_SIDEBAR_DEALERSHIP_MANAGER_LINKS: UserSidebarLink[] =
  USER_SIDEBAR_SECTION_APPRAISAL_OPPORTUNITIES.links;

export interface GetUserSidebarLinksParams {
  dealershipMembership?: DealershipMembership | null;
  isSubscribed?: boolean;
  isAdmin?: boolean;
}

const filterDealershipSectionLinks = (
  section: UserSidebarSection,
  dealershipMembership: DealershipMembership | null,
): UserSidebarSection => ({
  ...section,
  links: section.links.filter((link) => {
    if (link.href === `${basePath}/equipo`) {
      return Boolean(dealershipMembership);
    }
    if (link.href === `${basePath}/mi-financiacion`) {
      const role = dealershipMembership?.role;
      return role === "owner" || role === "admin";
    }
    return true;
  }),
});

const withVisibleLinks = (
  sections: UserSidebarSection[],
): UserSidebarSection[] =>
  sections.filter((section) => section.links.length > 0);

/** Secciones del menú de usuario según suscripción y membership. */
export const getUserSidebarSections = ({
  dealershipMembership = null,
  isSubscribed = false,
  isAdmin = false,
}: GetUserSidebarLinksParams = {}): UserSidebarSection[] => {
  const sections: UserSidebarSection[] = [
    buildPrimaryPanelSection(isSubscribed),
    USER_SIDEBAR_SECTION_APPRAISALS,
    USER_SIDEBAR_SECTION_SEARCH,
    USER_SIDEBAR_SECTION_COMMUNICATION,
  ];

  if (isSubscribed) {
    sections.push(
      USER_SIDEBAR_SECTION_LEADS,
      USER_SIDEBAR_SECTION_ANALYTICS,
      filterDealershipSectionLinks(
        USER_SIDEBAR_SECTION_DEALERSHIP,
        dealershipMembership,
      ),
    );
  }

  const role = dealershipMembership?.role;
  if (role === "owner" || role === "admin" || isAdmin) {
    sections.push(USER_SIDEBAR_SECTION_APPRAISAL_OPPORTUNITIES);
  }

  sections.push(USER_SIDEBAR_SECTION_ACCOUNT);

  return withVisibleLinks(sections);
};

/** Lista plana de links (dropdown, tests). */
export const getUserSidebarLinks = (
  params: GetUserSidebarLinksParams = {},
): UserSidebarLink[] =>
  getUserSidebarSections(params).flatMap((section) => section.links);
