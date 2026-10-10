import {
  Brain,
  Car,
  Check,
  CreditCard,
  Headset,
  Landmark,
  Search,
  Shield,
  Star,
  User,
} from "lucide-react";

import type { StrapiIconPack } from "@/lib/strapi/resolveStrapiIconName";

import type { ExtraServiceCardItem } from "./extraServicesCards.types";

/** Iconos admitidos en `servicios_extra[].iconName` (nombre lucide exacto). */
export const extraServicesIconPack = {
  Search,
  Check,
  Car,
  CreditCard,
  Headset,
  User,
  Landmark,
  Shield,
  Star,
  Brain,
} satisfies StrapiIconPack;

/** Acentos por posición cuando Strapi no envía `colorTexto`. */
export const EXTRA_SERVICES_ACCENTS = [
  "#2563EB",
  "#F97316",
  "#16A34A",
  "#7C3AED",
] as const;

/** Fallback cuando `homepage.servicios_extra` llega vacío (contenido legacy EXTRA_SERVICES_DATA_2). */
export const EXTRA_SERVICES_CARDS_FALLBACK: ExtraServiceCardItem[] = [
  {
    id: "anuncios",
    title: "Anuncios verificados",
    description: "Compra con confianza.",
    href: "/vehiculos",
    isExternal: false,
    imageUrl: null,
    accentColor: EXTRA_SERVICES_ACCENTS[0],
    backgroundColor: "#EFF6FF",
    iconName: "Search",
  },
  {
    id: "vender",
    title: "Vender tu coche",
    description: "Publica tu anuncio gratis.",
    href: "/vender-vehiculo",
    isExternal: false,
    imageUrl: null,
    accentColor: EXTRA_SERVICES_ACCENTS[1],
    backgroundColor: "#FFF7ED",
    iconName: "Car",
  },
  {
    id: "financiacion",
    title: "Financiación",
    description: "Encuentra la mejor opción de financiación.",
    href: "/financiacion",
    isExternal: false,
    imageUrl: null,
    accentColor: EXTRA_SERVICES_ACCENTS[2],
    backgroundColor: "#F0FDF4",
    iconName: "CreditCard",
  },
  {
    id: "soporte",
    title: "Atención personalizada",
    description: "Te ayudaremos a encontrar el coche ideal.",
    href: "/soporte",
    isExternal: false,
    imageUrl: null,
    accentColor: EXTRA_SERVICES_ACCENTS[3],
    backgroundColor: "#F5F3FF",
    iconName: "Headset",
  },
];
