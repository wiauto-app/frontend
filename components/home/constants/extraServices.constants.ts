
import { Brain, Car, Check, CreditCard, Landmark, Shield, Star, User } from "lucide-react";
import { VehicleExtraServiceItem } from "../types/home-page.types";

export const EXTRA_SERVICES_DATA: VehicleExtraServiceItem[] = [
  {
    name: "Financiamiento",
    icon: Landmark,
    href: "/simulador-financiamiento",
    description: "Calcula tu cuota online.",
  },
  {
    name: "Vender vehículo",
    icon: Car,
    href: "/vender-vehiculo",
    description: "Publica tu anuncio gratis.",
  },
  {
    name: "Seguros",
    icon: Shield,
    href: "/seguros",
    description: "Protege tu inversión.",
  },
  {
    name: "Tasar vehículo",
    icon: Star,
    href: "/tasador",
    description: "Obtén una valoración.",
  },
  {
    name: "Buscar Con IA",
    icon: Brain,
    href: "/asistente/chat",
    description: "Tu asistente virtual para comprar y vender coches.",
  },
];


export const EXTRA_SERVICES_DATA_2: VehicleExtraServiceItem[] = [
  {
    name: "Miles de anuncios",
    icon: Check,
    href: "/vehiculos",
    description: "Compra con confianza.",
  },
  {
    name: "Vender tu coche",
    icon: Car,
    href: "/vender-vehiculo",
    description: "Publica tu anuncio gratis.",
  },
  {
    name: "Financiamiento",
    icon: CreditCard,
    href: "/financiamiento",
    description: "Encuentra la mejor opción de financiamiento.",
  },
  {
    name: "Atención personalizada",
    icon: User,
    href: "/soporte",
    description: "Te ayudaremos a encontrar el coche ideal.",
  },
];