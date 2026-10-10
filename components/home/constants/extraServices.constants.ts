
import { Brain, Car, Landmark, Shield, Star } from "lucide-react";
import type { VehicleExtraServiceItem } from "../types/vehicle-extra-service.types";

export const EXTRA_SERVICES_DATA: VehicleExtraServiceItem[] = [
  {
    name: "Financiación",
    color:"#0F45CA",
    icon: Landmark,
    href: "/simulador-financiacion",
    description: "Calcula tu cuota online en segundos.",
  },
  {
    name: "Vender vehículo",
    color:"#117751",
    icon: Car,
    href: "/vender-vehiculo",
    description: "Publica tu anuncio gratis.",
  },
  {
    name: "Seguros",
    color:"#5A44A6",
    icon: Shield,
    href: "/seguros",
    description: "Protege tu inversión con las mejores compañías y al mejor precio.",
  },
  {
    name: "Tasar vehículo",
    icon: Star,
    color:"#D89E4C",
    href: "/tasador",
    description: "Obtén una valoración justa y al instante de cualquier vehículo.",
  },
  {
    name: "Buscar con IA",
    color:"#0F45CA",
    icon: Brain,
    href: "/asistente/chat",
    description: "Tu asistente inteligente para encontrar el coche perfecto en segundos.",
  },
];

