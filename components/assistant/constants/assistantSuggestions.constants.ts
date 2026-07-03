import { BatteryCharging, Car, LucideIcon, Map, Search, Tag, Truck } from "lucide-react";

export type AssistantSuggestionItem = {
  label: string;
  description?: string;
  prompt: string;
  icon?: LucideIcon;
};

export const ASSISTANT_STARTER_IDEAS: AssistantSuggestionItem[] = [
  {
    label: "Busco un Toyota Corolla",
    prompt:
      "Busco un Toyota Corolla ",
    icon: Search,
  },
  {
    label: "Automático diésel pocos km",
    prompt: "Quiero un coche automático diésel con menos de 100.000 km",
    icon: Car,
  },
  {
    label: "Eléctrico en Barcelona",
    prompt: "Recomiéndame un coche eléctrico con buena autonomía en Barcelona",
    icon: BatteryCharging,
  },
  {
    label: "Furgoneta de trabajo",
    prompt: "Necesito una furgoneta de trabajo en Valencia",
    icon: Truck,
  },
];

export const ASSISTANT_TRENDING_SEARCHES: AssistantSuggestionItem[] = [
  {
    label: "Híbridos enchufables",
    description: "Hasta 30.000 €",
    prompt: "Híbridos enchufables hasta 30.000 €",
  },
  {
    label: "Berlinas automáticas",
    description: "De particulares",
    prompt: "Busco berlinas automáticas de particulares con menos de 80.000 km",
  },
  {
    label: "Diésel etiqueta C",
    description: "Todo terreno",
    prompt: "Quiero un todo terreno diésel con etiqueta C en Sevilla",
  },
  {
    label: "Coches con garantía",
    description: "Más buscados",
    prompt: "Recomiéndame coches con garantía en Málaga",
  },
];

export type AssistantQuickLink = {
  label: string;
  href: string;
  description: string;
  Icon: LucideIcon;
};
export const ASSISTANT_QUICK_LINKS: AssistantQuickLink[] = [
  { label: "Explorar vehículos", href: "/vehiculos", description: "Encuentra tu próximo coche", Icon: Car },
  { label: "Publicar anuncio", href: "/publicar-vehiculo", description: "Vende tu coche rápido y fácil", Icon: Tag },
  // { label: "Mapa", href: "/asistente/map", description: "Ver coches cerca de ti", Icon: Map },
] as const;
