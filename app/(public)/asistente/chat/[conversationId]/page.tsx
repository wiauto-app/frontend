import { AssistantSuggestions } from "@/components/assistant/assistantSuggestions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Asistente",
  description: "Asistente de búsqueda de vehículos con IA",
};

export default function AssistantConversationPage() {
  return <AssistantSuggestions />;
}
