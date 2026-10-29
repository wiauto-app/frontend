"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { isFocusedFlowPath } from "@/lib/focusedFlowRoutes";

const AssistantChatBundle = dynamic(
  () =>
    import("@/components/assistant/AssistantChatBundle").then(
      (mod) => mod.AssistantChatBundle,
    ),
  { ssr: false },
);

const ASSISTANT_ROUTE_PREFIX = "/asistente";

/**
 * Diálogo flotante con su provider. En `/asistente` el provider vive en el layout
 * anidado para no duplicar contexto ni cargar el diálogo.
 */
export const LazyAssistantShell = () => {
  const pathname = usePathname();

  if (pathname.startsWith(ASSISTANT_ROUTE_PREFIX) || isFocusedFlowPath(pathname)) {
    return null;
  }

  return <AssistantChatBundle />;
};
