import { AssistantSearchPanel } from "@/components/assistant/assistantSearchPanel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Asistente - Búsqueda",
  description: "Asistente de búsqueda de vehículos con IA",
};

export default function AssistantSearchPage() {
  return <AssistantSearchPanel />;
}
