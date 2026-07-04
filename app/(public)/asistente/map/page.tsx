import { AssistantMapPanel } from "@/components/assistant/assistantMapPanel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Asistente - Mapa",
  description: "Asistente de búsqueda de vehículos con IA",
};

export default function AssistantMapPage() {
  return <AssistantMapPanel />;
}
