"use client";

import { Spinner } from "@/components/ui/spinner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";
import { MapIcon, MessageSquare, Plus, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AssistantConversationHistoryItem } from "./assistantConversationHistoryItem";
import { useAssistantChat } from "./assistantChatProvider";

interface AssistantNavItem {
  title: string;
  Icon: LucideIcon;
  href: string;
}

const assistantNavItems: AssistantNavItem[] = [
  { title: "Chat", Icon: MessageSquare, href: "/asistente/chat" },
  { title: "Búsqueda", Icon: Search, href: "/asistente/search" },
  { title: "Mapa", Icon: MapIcon, href: "/asistente/map" },
];

const buildAssistantHref = (href: string, query: string): string => {
  return query ? `${href}?${query}` : href;
};

export const AssistantSidebar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const {
    conversationId,
    conversations,
    isConversationsLoading,
    handleNewConversation,
    handleSelectConversation,
    handleDeleteConversation,
    handleRenameConversation,
  } = useAssistantChat();

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="relative" >
   

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {assistantNavItems.map(({ title, Icon, href }) => {
                const isActive =
                  pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={<Link href={buildAssistantHref(href, query)} />}
                      tooltip={title}
                    >
                      <Icon />
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup className="min-h-0 flex-1">
          <SidebarGroupLabel>Historial</SidebarGroupLabel>
          <SidebarGroupAction
            aria-label="Nueva conversación"
            onClick={() => void handleNewConversation()}
            title="Nueva conversación"
            type="button"
          >
            <Plus />
          </SidebarGroupAction>
          <SidebarGroupContent className="min-h-0 flex-1">
            {isConversationsLoading ? (
              <div className="flex justify-center py-4">
                <Spinner className="size-5" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                Aún no tienes conversaciones guardadas.
              </p>
            ) : (
              <SidebarMenu className="max-h-[calc(100vh-20rem)] overflow-y-auto">
                {conversations.map((conversation) => (
                  <AssistantConversationHistoryItem
                    conversation={conversation}
                    isActive={conversationId === conversation.id}
                    key={conversation.id}
                    onDelete={handleDeleteConversation}
                    onRename={handleRenameConversation}
                    onSelect={handleSelectConversation}
                  />
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
};
