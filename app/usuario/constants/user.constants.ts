import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  BarChart3,
  Calculator,
  Car,
  Heart,
  Search,
  MessageSquare,
  ContactRound,
  Bell,
  Newspaper,
  User as UserIcon,
  Settings,
  CreditCard,
  Users,
  Building2,
  EyeOff,
} from "lucide-react";
import type { DealershipMembership } from "@/services/dealerships/types/team.types";

const basePath = "/usuario";

export interface UserSidebarLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const USER_SIDEBAR_LINKS: UserSidebarLink[] = [
  { href: `${basePath}/inicio`, label: "Inicio", icon: LayoutGrid },
  { href: `${basePath}/estadisticas`, label: "Estadísticas", icon: BarChart3 },
  { href: `${basePath}/mis-anuncios`, label: "Mis anuncios", icon: Car },
  { href: `${basePath}/mi-tasador`, label: "Tasador", icon: Calculator },
  { href: `${basePath}/favoritos`, label: "Favoritos", icon: Heart },
  {
    href: `${basePath}/busquedas-guardadas`,
    label: "Búsquedas guardadas",
    icon: Search,
  },
  { href: `${basePath}/mensajes`, label: "Mensajes (chat)", icon: MessageSquare },
  { href: `${basePath}/contactos`, label: "Contactos / Leads", icon: ContactRound },
  { href: `${basePath}/notificaciones`, label: "Notificaciones", icon: Bell },
  { href: `${basePath}/newsletter`, label: "Newsletter", icon: Newspaper },
  { href: `${basePath}/perfil`, label: "Mi perfil", icon: UserIcon },
  { href: `${basePath}/configuracion`, label: "Configuración", icon: Settings },
];

export const USER_SIDEBAR_DEALERSHIP_PROFILE_LINK: UserSidebarLink = {
  href: `${basePath}/perfil?tab=dealership`,
  label: "Perfil de concesionaria",
  icon: Building2,
};

export const USER_SIDEBAR_MONETIZATION_LINK: UserSidebarLink = {
  href: `${basePath}/monetizacion`,
  label: "Monetización",
  icon: CreditCard,
};

export const USER_SIDEBAR_DISMISSED_LINK: UserSidebarLink = {
  href: `${basePath}/descartados`,
  label: "Descartados",
  icon: EyeOff,
};

export const USER_SIDEBAR_TEAM_LINK: UserSidebarLink = {
  href: `${basePath}/equipo`,
  label: "Equipo",
  icon: Users,
};

export interface GetUserSidebarLinksParams {
  dealershipMembership?: DealershipMembership | null;
  hasDismissedVehicles?: boolean;
}

const insertAfterMisAnuncios = (
  links: UserSidebarLink[],
  extra: UserSidebarLink[],
): UserSidebarLink[] => {
  if (extra.length === 0) {
    return links;
  }

  const misAnunciosIndex = links.findIndex(
    (link) => link.href === `${basePath}/mis-anuncios`,
  );

  if (misAnunciosIndex === -1) {
    return [...links, ...extra];
  }

  return [
    ...links.slice(0, misAnunciosIndex + 1),
    ...extra,
    ...links.slice(misAnunciosIndex + 1),
  ];
};

const insertDealershipProfileLink = (
  links: UserSidebarLink[],
): UserSidebarLink[] => {
  const perfilIndex = links.findIndex((link) => link.href === `${basePath}/perfil`);

  if (perfilIndex === -1) {
    return [...links, USER_SIDEBAR_DEALERSHIP_PROFILE_LINK];
  }

  return [
    ...links.slice(0, perfilIndex + 1),
    USER_SIDEBAR_DEALERSHIP_PROFILE_LINK,
    ...links.slice(perfilIndex + 1),
  ];
};

export const getUserSidebarLinks = (
  params?: GetUserSidebarLinksParams,
): UserSidebarLink[] => {
  const membership = params?.dealershipMembership ?? null;
  const hasDismissedVehicles = params?.hasDismissedVehicles === true;

  const entitlementLinks: UserSidebarLink[] = [
    USER_SIDEBAR_MONETIZATION_LINK,
    ...(hasDismissedVehicles ? [USER_SIDEBAR_DISMISSED_LINK] : []),
    ...(membership ? [USER_SIDEBAR_TEAM_LINK] : []),
  ];

  const withEntitlements = insertAfterMisAnuncios(
    USER_SIDEBAR_LINKS,
    entitlementLinks,
  );

  return insertDealershipProfileLink(withEntitlements);
};
