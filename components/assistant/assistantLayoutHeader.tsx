"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useAssistantChat } from "./assistantChatProvider";

interface AssistantLayoutHeaderProps {
  title?: string;
}

export const AssistantLayoutHeader = ({
  title = "Asistente",
}: AssistantLayoutHeaderProps) => {
  const { quota, isQuotaLoading } = useAssistantChat();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4 md:hidden">
      <div className="flex items-center gap-2">
        <SidebarTrigger aria-label="Abrir menú del asistente" />
        <h1 className="text-sm font-semibold text-slate-900">{title}</h1>
      </div>
      <div className="text-xs text-muted-foreground">
        {isQuotaLoading ? (
          <Spinner className="size-4" />
        ) : (
          <span>{quota?.totalRemaining ?? 0} consultas</span>
        )}
      </div>
    </header>
  );
};
