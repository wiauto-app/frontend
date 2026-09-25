import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  BarChart3,
  Calculator,
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
  { href: `${basePath}/mis-anuncios`, label: "Mis anuncios", icon: Car },
  { href: `${basePath}/favoritos`, label: "Favoritos", icon: Heart },
  {
    href: `${basePath}/busquedas-guardadas`,
    label: "Búsquedas guardadas",
    icon: Search,
  },
  { href: `${basePath}/mensajes`, label: "Mensajes (chat)", icon: MessageSquare },
  {
    href: `${basePath}/monetizacion`,
    label: "Planes",
    icon: CreditCard,
  },
  { href: `${basePath}/notificaciones`, label: "Notificaciones", icon: Bell },
  { href: `${basePath}/perfil`, label: "Mi perfil", icon: UserIcon },
  {
    href: `${basePath}/descartados`,
    label: "Descartados",
    icon: EyeOff,
  },
  { href: `${basePath}/newsletter`, label: "Newsletter", icon: Newspaper },
  // { href: `${basePath}/configuracion`, label: "Configuración", icon: Settings },
];


export const USER_SIDEBAR_PRO_LINKS = [
  { href: `${basePath}/asistente-leads`, label: "Asistente de leads", icon: Bot },
  {
    href: `${basePath}/alertas-proactivas`,
    label: "Alertas proactivas",
    icon: BellRing,
  },
  { href: `${basePath}/contactos`, label: "Contactos / Leads", icon: ContactRound },
  { href: `${basePath}/estadisticas`, label: "Estadísticas", icon: BarChart3 },
  { href: `${basePath}/mi-tasador`, label: "Tasador", icon: Calculator },
  {
    href: `${basePath}/concesionario`,
    label: "Concesionario",
    icon: Building2,
  },
  {
    href: `${basePath}/equipo`,
    label: "Equipo",
    icon: Users,
  },
] as UserSidebarLink[]


export interface GetUserSidebarLinksParams {
  dealershipMembership?: DealershipMembership | null;
  isSubscribed?: boolean;
}

/** Construye los links del sidebar según suscripción y membership. */
export const getUserSidebarLinks = ({
  dealershipMembership = null,
  isSubscribed = false,
}: GetUserSidebarLinksParams = {}): UserSidebarLink[] => {
  const links = [...USER_SIDEBAR_LINKS];

  if (isSubscribed) {
    links.push(
      ...USER_SIDEBAR_PRO_LINKS.filter((link) => {
        if (link.href === `${basePath}/equipo`) {
          return Boolean(dealershipMembership);
        }
        return true;
      }),
    );
  }

  return links;
};
