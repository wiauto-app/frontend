import {
  BatteryCharging,
  Car,
  CheckCircle2,
  Clock,
  Gauge,
  PiggyBank,
  PlusCircle,
  ShieldCheck,
  Snowflake,
  Truck,
  Wrench,
} from "lucide-react";

import type {
  GuaranteeBenefit,
  GuaranteeTrustBadge,
  ProtectedPart,
} from "./interfaces/garantia-mecanica.interface";

export const HERO_TRUST_BADGES: GuaranteeTrustBadge[] = [
  {
    icon: ShieldCheck,
    label: "Cobertura nacional en talleres concertados",
  },
  {
    icon: CheckCircle2,
    label: "Reparaciones con piezas de calidad",
  },
  {
    icon: Clock,
    label: "Duración flexible 12, 24 o 36 meses",
  },
];

export const PROTECTED_PARTS: ProtectedPart[] = [
  {
    icon: Wrench,
    title: "Motor",
    description:
      "Bloque motor, culata, árbol de levas, pistones, cigüeñal y más.",
  },
  {
    icon: Gauge,
    title: "Caja de cambios",
    description:
      "Manual, automática o DSG. Cubrimos los componentes internos.",
  },
  {
    icon: BatteryCharging,
    title: "Sistema eléctrico",
    description:
      "Alternador, motor de arranque, centralitas, sensores y más.",
  },
  {
    icon: Snowflake,
    title: "Climatización",
    description:
      "Compresor, condensador, ventiladores y sistema de aire acondicionado.",
  },
  {
    icon: Truck,
    title: "Asistencia",
    description:
      "Asistencia en carretera 24/7 y vehículo de cortesía opcional.",
  },
  {
    icon: PlusCircle,
    title: "Otros componentes",
    description:
      "Dirección, suspensión, frenos, turbo y otros elementos cubiertos.",
  },
];

export const GUARANTEE_BENEFITS: GuaranteeBenefit[] = [
  {
    icon: ShieldCheck,
    title: "Protección real",
    description:
      "Cubrimos las averías más comunes con piezas de calidad y mano de obra especializada.",
  },
  {
    icon: PiggyBank,
    title: "Menos gastos inesperados",
    description:
      "Evita facturas elevadas y mantén tu coche siempre en las mejores condiciones.",
  },
  {
    icon: Car,
    title: "Conduce con tranquilidad",
    description:
      "Si ocurre algo, estamos contigo. Talleres de confianza y atención cercana y rápida.",
  },
];
