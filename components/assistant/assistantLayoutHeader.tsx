"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Menu } from "lucide-react";
import { useAssistantChat } from "./assistantChatProvider";
import { useAssistantSidebarUi } from "./assistantSidebarUi";

interface AssistantLayoutHeaderProps {
  title?: string;
}

export const AssistantLayoutHeader = ({
  title = "Asistente",
}: AssistantLayoutHeaderProps) => {
  const { quota, isQuotaLoading } = useAssistantChat();
  const { toggle } = useAssistantSidebarUi();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4 md:hidden">
      <div className="flex items-center gap-2">
        <Button
          aria-label="Abrir menú del asistente"
          onClick={toggle}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <Menu className="size-4" />
        </Button>
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
