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
  User as UserIcon,
  Settings,
  CreditCard,
  Users,
  Building2,
} from "lucide-react";
import {
  PUBLISHER_TYPE,
  type PublisherType,
} from "@/interfaces/vehicle.interface";
import type { DealershipMembership } from "@/services/dealerships/types/team.types";

export type UserSidebarLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const USER_SIDEBAR_LINKS: UserSidebarLink[] = [
  { href: "/inicio", label: "Inicio", icon: LayoutGrid },
  { href: "/estadisticas", label: "Estadísticas", icon: BarChart3 },
  { href: "/mis-anuncios", label: "Mis anuncios", icon: Car },
  { href: "/mi-tasador", label: "Tasador", icon: Calculator },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  {
    href: "/busquedas-guardadas",
    label: "Búsquedas guardadas",
    icon: Search,
  },
  { href: "/mensajes", label: "Mensajes (chat)", icon: MessageSquare },
  { href: "/contactos", label: "Contactos / Leads", icon: ContactRound },
  { href: "/notificaciones", label: "Notificaciones", icon: Bell },
  { href: "/perfil", label: "Mi perfil", icon: UserIcon },
  { href: "/configuracion", label: "Configuración", icon: Settings },
];

export const USER_SIDEBAR_DEALERSHIP_PROFILE_LINK: UserSidebarLink = {
  href: "/perfil?tab=dealership",
  label: "Perfil de concesionaria",
  icon: Building2,
};

export const USER_SIDEBAR_PROFESSIONAL_LINKS: UserSidebarLink[] = [
  { href: "/monetizacion", label: "Monetización", icon: CreditCard },
];

export const USER_SIDEBAR_TEAM_LINK: UserSidebarLink = {
  href: "/equipo",
  label: "Equipo",
  icon: Users,
};

export type GetUserSidebarLinksParams = {
  userType?: PublisherType;
  dealershipMembership?: DealershipMembership | null;
};

const insertDealershipProfileLink = (
  links: UserSidebarLink[],
): UserSidebarLink[] => {
  const perfilIndex = links.findIndex((link) => link.href === "/perfil");

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
  params?: GetUserSidebarLinksParams | PublisherType,
  dealershipMembership?: DealershipMembership | null,
): UserSidebarLink[] => {
  const userType = typeof params === "object" ? params?.userType : params;
  const membership =
    typeof params === "object" ? params?.dealershipMembership : dealershipMembership;

  const teamLinks = membership ? [USER_SIDEBAR_TEAM_LINK] : [];

  if (userType !== PUBLISHER_TYPE.PROFESSIONAL) {
    return insertDealershipProfileLink([...USER_SIDEBAR_LINKS, ...teamLinks]);
  }

  const misAnunciosIndex = USER_SIDEBAR_LINKS.findIndex(
    (link) => link.href === "/mis-anuncios",
  );

  if (misAnunciosIndex === -1) {
    return insertDealershipProfileLink([
      ...USER_SIDEBAR_LINKS,
      ...USER_SIDEBAR_PROFESSIONAL_LINKS,
      ...teamLinks,
    ]);
  }

  return insertDealershipProfileLink([
    ...USER_SIDEBAR_LINKS.slice(0, misAnunciosIndex + 1),
    ...USER_SIDEBAR_PROFESSIONAL_LINKS,
    ...teamLinks,
    ...USER_SIDEBAR_LINKS.slice(misAnunciosIndex + 1),
  ]);
};
