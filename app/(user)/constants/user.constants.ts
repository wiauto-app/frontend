import {
  LayoutGrid,
  Car,
  Heart,
  Search,
  MessageSquare,
  Bell,
  User as UserIcon,
  Settings,
} from "lucide-react";

export const USER_SIDEBAR_LINKS = [
  { href: "/inicio", label: "Inicio", icon: LayoutGrid },
  { href: "/mis-anuncios", label: "Mis anuncios", icon: Car },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  {
    href: "/busquedas-guardadas",
    label: "Búsquedas guardadas",
    icon: Search,
  },
  { href: "/mensajes", label: "Mensajes (chat)", icon: MessageSquare },
  { href: "/notificaciones", label: "Notificaciones", icon: Bell },
  { href: "/perfil", label: "Mi perfil", icon: UserIcon },
  { href: "/configuracion", label: "Configuración", icon: Settings },
];