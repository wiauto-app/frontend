import {
  Building2,
  Car,
  CheckCircle2,
  FileSignature,
  FileText,
  Lock,
  ShieldCheck,
  Upload,
  UserCheck,
  Users,
} from "lucide-react";

import type {
  HeroTrustBadge,
  PaperService,
  PreviewStep,
  SoldVehicle,
  TransferFormBenefit,
  TransferStep,
} from "./interfaces/transferir-vehiculo.interface";

export const TRANSFER_HERO_BADGES: HeroTrustBadge[] = [
  { label: "Gestión 100% online" },
  { label: "Seguro y confidencial" },
  { label: "Trámite rápido y fiable" },
];

export const PAPERS: PaperService[] = [
  {
    icon: Users,
    title: "Cambio de titularidad",
    description:
      "Realizamos el cambio de titular en Tráfico para que el vehículo quede correctamente a nombre del comprador.",
  },
  {
    icon: FileText,
    title: "Documentación",
    description:
      "Revisamos, preparamos y presentamos toda la documentación necesaria ante la DGT.",
  },
  {
    icon: FileSignature,
    title: "Contrato de compraventa",
    description:
      "Te proporcionamos un contrato válido y adaptado a la normativa actual para proteger a ambas partes.",
  },
  {
    icon: Building2,
    title: "Gestión administrativa",
    description:
      "Nos ocupamos de tasas, modelos oficiales y presentación telemática para que no tengas que desplazarte.",
  },
];

export const TRANSFER_STEPS: TransferStep[] = [
  {
    number: 1,
    icon: Car,
    title: "Introduce el vehículo",
    description: "Añade la matrícula y verificamos los datos del coche.",
  },
  {
    number: 2,
    icon: Users,
    title: "Datos del comprador y vendedor",
    description:
      "Indicamos los datos de ambas partes para preparar el expediente.",
  },
  {
    number: 3,
    icon: Upload,
    title: "Sube la documentación",
    description: "Adjunta los documentos requeridos de forma rápida y segura.",
  },
  {
    number: 4,
    icon: CheckCircle2,
    title: "Realizamos la gestión",
    description:
      "Nos encargamos de todo y te informamos cuando la transferencia esté completa.",
  },
];

export const MY_SELL: SoldVehicle = {
  badge: "Vendido",
  model: "Volkswagen Tiguan",
  version: "2.0 TDI Advance 4Motion",
  plate: "6678 LKM",
  year: "2020",
  km: "82.500 km",
  buyer: "Ana Martínez",
  image: "/sample-tiguan.jpg",
};

export const FORM_BENEFITS: TransferFormBenefit[] = [
  {
    icon: UserCheck,
    text: "Sin desplazamientos. Gestionamos todo online por ti.",
  },
  { icon: ShieldCheck, text: "Asesoramiento real durante el proceso." },
  {
    icon: Lock,
    text: "Seguridad y cumplimiento. Cumplimos con la normativa de la DGT.",
  },
];

export const TRANSFER_PROVINCES: string[] = [
  "Madrid",
  "Barcelona",
  "Valencia",
  "Sevilla",
  "Zaragoza",
  "Málaga",
  "Murcia",
  "Palma",
  "Las Palmas",
  "Bilbao",
  "Alicante",
  "Córdoba",
  "Valladolid",
  "Vigo",
  "Gijón",
  "Hospitalet",
  "Vitoria",
  "Granada",
];

export const PREVIEW_STEPS: PreviewStep[] = [
  { number: 1, label: "Datos del vehículo", status: "done" },
  { number: 2, label: "Vendedor", status: "done" },
  { number: 3, label: "Comprador", status: "active" },
  { number: 4, label: "Documentación", status: "pending" },
  { number: 5, label: "Transferencia", status: "pending" },
];
