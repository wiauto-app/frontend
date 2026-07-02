"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

interface AssistantLayoutHeaderProps {
  title?: string;
}

export const AssistantLayoutHeader = ({
  title = "Asistente",
}: AssistantLayoutHeaderProps) => {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 md:hidden">
      <SidebarTrigger aria-label="Abrir menú del asistente" />
      <h1 className="text-sm font-semibold text-slate-900">{title}</h1>
    </header>
  );
};
