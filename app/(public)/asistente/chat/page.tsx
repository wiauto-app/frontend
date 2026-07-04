import { AssistantSuggestions } from "@/components/assistant/assistantSuggestions";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Asistente",
  description: "Asistente de búsqueda de vehículos con IA",
};

interface AssistantChatPageProps {
  searchParams: Promise<{ conversationId?: string }>;
}

export default async function AssistantChatPage({
  searchParams,
}: AssistantChatPageProps) {
  const { conversationId } = await searchParams;

  if (conversationId) {
    redirect(`/asistente/chat/${conversationId}`);
  }

  return <AssistantSuggestions />;
}
