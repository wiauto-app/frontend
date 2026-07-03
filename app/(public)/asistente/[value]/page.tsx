import { AssistantMapPanel } from "@/components/assistant/assistantMapPanel";
import { AssistantSearchPanel } from "@/components/assistant/assistantSearchPanel";
import { AssistantSuggestions } from "@/components/assistant/assistantSuggestions";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Asistente",
  description: "Asistente de búsqueda de vehículos con IA",
};

export default async function Page(props: {
  params: Promise<{ value: string }>;
}) {
  const params = await props.params;

  switch (params.value) {
    case "chat":
      return <AssistantSuggestions />;
    case "search":
      return <AssistantSearchPanel />;
    case "map":
      return <AssistantMapPanel />;
    default:
      return <div>Not found</div>;
  }
}
