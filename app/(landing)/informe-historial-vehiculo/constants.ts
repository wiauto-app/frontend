import {
  AlertTriangle,
  Car,
  ClipboardCheck,
  Database,
  FileText,
  Gauge,
  Search,
  Settings2,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

import type {
  DiscoveryFeature,
  HowItWorksStep,
  ReportCheck,
  SampleVehicle,
  TrustItem,
} from "./interfaces/informe-historial-vehiculo.interface";

export const BRAND_BLUE = "#0061F2";
export const BRAND_BLUE_LIGHT = "#EBF2FF";

export const SAMPLE_VEHICLE: SampleVehicle = {
  make: "Toyota",
  model: "Corolla",
  variant: "1.8 Hybrid Active",
  year: 2019,
  power: "122 CV",
  vin: "SB1Z93BE50E123456",
  image: "/sample-corolla.jpg",
  heroImage: "/sample-corolla.jpg",
  mileage: "82.435 km",
  owners: "2",
  adminStatus: "En orden",
  inspections: "ITV al día",
  incidents: "1 encontrada",
  lastUpdate: "20/05/2024",
};

export const HERO_TRUST_ITEMS: TrustItem[] = [
  { icon: Database, label: "Datos de fuentes oficiales" },
  { icon: Zap, label: "Informe rápido y fiable" },
  { icon: ShieldCheck, label: "Compra con confianza" },
];

export const DISCOVERY_FEATURES: DiscoveryFeature[] = [
  {
    icon: Users,
    title: "Historial de propietarios",
    description: "Consulta cuántos propietarios ha tenido el vehículo.",
  },
  {
    icon: Gauge,
    title: "Kilometraje registrado",
    description: "Detecta posibles irregularidades en el contador.",
  },
  {
    icon: AlertTriangle,
    title: "Accidentes y daños",
    description: "Información sobre siniestros y reparaciones.",
  },
  {
    icon: FileText,
    title: "Situación administrativa",
    description: "Comprueba cargas, embargos o limitaciones.",
  },
  {
    icon: ClipboardCheck,
    title: "Inspecciones",
    description: "Estado de la ITV y revisiones periódicas.",
  },
  {
    icon: Settings2,
    title: "Datos técnicos",
    description: "Ficha completa con especificaciones del modelo.",
  },
];

export const REPORT_CHECKS: ReportCheck[] = [
  { label: "Identificación verificada", status: "ok" },
  { label: "Registros de kilometraje", status: "ok" },
  { label: "Datos técnicos disponibles", status: "ok" },
  { label: "1 incidencia encontrada", status: "warning" },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    icon: Car,
    title: "Introduce la matrícula",
    description: "Escribe la matrícula o el VIN del vehículo que quieres consultar.",
  },
  {
    icon: Search,
    title: "Localizamos información",
    description: "Cruzamos datos de fuentes oficiales y registros verificados.",
  },
  {
    icon: FileText,
    title: "Recibe tu informe",
    description: "Obtén el informe completo al instante en PDF.",
  },
];

export const CTA_BACKGROUND =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000";
