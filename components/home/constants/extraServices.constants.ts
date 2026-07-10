
import { Car, Check, CreditCard, Landmark, Shield, Star, User } from "lucide-react";
import { VehicleExtraServiceItem } from "../types/home-page.types";

export const EXTRA_SERVICES_DATA: VehicleExtraServiceItem[] = [
  {
    name: "Financiamiento",
    icon: Landmark,
    href: "/financia-tu-vehiculo",
    description: "Calcula tu cuota online.",
  },
  {
    name: "Vender vehículo",
    icon: Car,
    href: "/vende-tu-vehiculo",
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
    href: "/valora-tu-vehiculo",
    description: "Obtén una valoración estimada.",
  },
];


export const EXTRA_SERVICES_DATA_2: VehicleExtraServiceItem[] = [
  {
    name: "Miles de anuncios",
    icon: Check,
    href: "/anuncios-verificados",
    description: "Compra con confianza.",
  },
  {
    name: "Vender tu auto gratis",
    icon: Car,
    href: "/vende-tu-vehiculo",
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
    href: "/atencion-personalizada",
    description: "Te ayudaremos a encontrar el auto ideal.",
  },
];