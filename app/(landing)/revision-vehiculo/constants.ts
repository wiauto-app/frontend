import {
  Activity,
  Calendar,
  Car,
  CircleDot,
  FileCheck2,
  FileText,
  Gauge,
  Handshake,
  Layers,
  MapPin,
  Search,
  Settings,
  UserCheck,
  Zap,
} from "lucide-react";

import type {
  HowItWorksStep,
  InspectionBenefit,
  InspectionPointsSection,
  TrustBadge,
} from "./interfaces/revision-vehiculo.interface";

export const HERO_BADGES: TrustBadge[] = [
  { icon: UserCheck, label: "Técnicos expertos a tu servicio" },
  { icon: MapPin, label: "Cobertura nacional en toda España" },
  { icon: FileText, label: "Informe claro con fotos y recomendaciones" },
];

export const INSPECTION_POINTS: InspectionPointsSection = {
  left: [
    {
      icon: Settings,
      title: "Motor",
      description: "Estado y rendimiento",
      point: { x: "42%", y: "22%" },
    },
    {
      icon: CircleDot,
      title: "Frenos",
      description: "Discos, pastillas y más",
      point: { x: "32%", y: "38%" },
    },
    {
      icon: Activity,
      title: "Suspensión",
      description: "Amortiguadores y más",
      point: { x: "32%", y: "58%" },
    },
    {
      icon: Gauge,
      title: "Neumáticos",
      description: "Estado y profundidad",
      point: { x: "32%", y: "78%" },
    },
  ],
  right: [
    {
      icon: Car,
      title: "Carrocería",
      description: "Golpes, óxido, pintura",
      point: { x: "68%", y: "22%" },
    },
    {
      icon: Zap,
      title: "Electrónica",
      description: "Sistemas y diagnosis",
      point: { x: "50%", y: "38%" },
    },
    {
      icon: Layers,
      title: "Interior",
      description: "Estado y acabados",
      point: { x: "50%", y: "52%" },
    },
    {
      icon: UserCheck,
      title: "Prueba de conducción",
      description: "Comportamiento en ruta",
      point: { x: "68%", y: "78%" },
    },
  ],
};

export const BUY_BENEFITS: InspectionBenefit[] = [
  {
    icon: Search,
    title: "Detectamos problemas",
    description:
      "Identificamos defectos ocultos, averías recurrentes y daños no visibles a simple vista.",
  },
  {
    icon: FileCheck2,
    title: "Conoce los gastos futuros",
    description:
      "Estimamos el coste de reparaciones y mantenimiento para que tomes la mejor decisión.",
  },
  {
    icon: Handshake,
    title: "Negocia mejor",
    description:
      "Usa nuestro informe como ventaja para negociar un precio justo y transparente.",
  },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: 1,
    icon: Search,
    title: "Encuentra el coche",
    description:
      "Busca el vehículo que te interesa en portales o con particulares.",
  },
  {
    step: 2,
    icon: FileText,
    title: "Solicita la inspección",
    description:
      "Completa el formulario con los datos del coche y nosotros nos encargamos del resto.",
  },
  {
    step: 3,
    icon: Calendar,
    title: "Coordinamos la visita",
    description:
      "Un técnico se desplaza al lugar y realiza la inspección profesional.",
  },
  {
    step: 4,
    icon: FileCheck2,
    title: "Recibe el informe",
    description:
      "En 24-48h recibirás un informe detallado con fotos, valoración y recomendaciones.",
  },
];

export const SPANISH_PROVINCES: string[] = [
  "Álava",
  "Albacete",
  "Alicante",
  "Almería",
  "Asturias",
  "Ávila",
  "Badajoz",
  "Barcelona",
  "Burgos",
  "Cáceres",
  "Cádiz",
  "Cantabria",
  "Castellón",
  "Ciudad Real",
  "Córdoba",
  "Cuenca",
  "Girona",
  "Granada",
  "Guadalajara",
  "Guipúzcoa",
  "Huelva",
  "Huesca",
  "Illes Balears",
  "Jaén",
  "La Rioja",
  "Las Palmas",
  "León",
  "Lleida",
  "Lugo",
  "Madrid",
  "Málaga",
  "Murcia",
  "Navarra",
  "Ourense",
  "Palencia",
  "Pontevedra",
  "Salamanca",
  "Santa Cruz de Tenerife",
  "Segovia",
  "Sevilla",
  "Soria",
  "Tarragona",
  "Teruel",
  "Toledo",
  "Valencia",
  "Valladolid",
  "Vizcaya",
  "Zamora",
  "Zaragoza",
];
