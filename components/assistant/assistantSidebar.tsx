"use client";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { MapIcon, MessageSquare, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AssistantConversationHistoryItem } from "./assistantConversationHistoryItem";
import { useAssistantChat } from "./assistantChatProvider";
import { AssistantCreditsPurchaseDialog } from "./AssistantCreditsPurchaseDialog";
import { useAssistantSidebarUi } from "./assistantSidebarUi";

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

export const AssistantSidebar = () => {
  const pathname = usePathname();
  const { isOpen, close } = useAssistantSidebarUi();
  const {
    conversationId,
    conversations,
    isConversationsLoading,
    quota,
    isQuotaLoading,
    openPurchaseDialog,
    isPurchaseDialogOpen,
    closePurchaseDialog,
    handleNewConversation,
    handleSelectConversation,
    handleDeleteConversation,
    handleRenameConversation,
  } = useAssistantChat();

  const handleSelectConversationAndClose = (id: string) => {
    handleSelectConversation(id);
    close();
  };

  const handleNavClick = () => {
    close();
  };

  return (
    <>
      <button
        aria-label="Cerrar menú del asistente"
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={close}
        type="button"
      />

      <aside
        aria-label="Menú del asistente"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-200 md:static md:z-auto md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b px-3 md:hidden">
          <p className="text-sm font-semibold text-slate-900">Menú</p>
          <Button
            aria-label="Cerrar menú"
            onClick={close}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-3">
          <section>
            <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
              Navegación
            </p>
            <nav aria-label="Navegación del asistente">
              <ul className="space-y-1">
                {assistantNavItems.map(({ title, Icon, href }) => {
                  const isActive =
                    pathname === href || pathname.startsWith(`${href}/`);

                  return (
                    <li key={title}>
                      <Link
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                          isActive
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-slate-700 hover:bg-muted",
                        )}
                        href={href}
                        onClick={handleNavClick}
                      >
                        <Icon className="size-4 shrink-0" aria-hidden />
                        <span>{title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </section>

          <section>
            <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
              Consultas
            </p>
            {isQuotaLoading ? (
              <div className="flex justify-center py-2">
                <Spinner className="size-4" />
              </div>
            ) : (
              <div className="space-y-2 rounded-lg border p-3 text-xs">
                <p className="font-semibold text-slate-900">
                  {quota?.totalRemaining ?? 0} consultas restantes
                </p>
                <p className="text-muted-foreground">
                  Gratis este mes: {quota?.monthlyFreeRemaining ?? 0}/
                  {quota?.monthlyFreeLimit ?? 0}
                </p>
                <p className="text-muted-foreground">
                  Compradas: {quota?.purchasedCredits ?? 0}
                </p>
                <Button
                  className="h-8 w-full text-xs"
                  onClick={openPurchaseDialog}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Comprar consultas
                </Button>
              </div>
            )}
          </section>

          <section className="flex min-h-0 flex-1 flex-col">
            <div className="mb-2 flex items-center justify-between px-2">
              <p className="text-xs font-medium text-muted-foreground">
                Historial
              </p>
              <Button
                aria-label="Nueva conversación"
                onClick={() => void handleNewConversation()}
                size="icon-sm"
                title="Nueva conversación"
                type="button"
                variant="ghost"
              >
                <Plus className="size-4" />
              </Button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {isConversationsLoading ? (
                <div className="flex justify-center py-4">
                  <Spinner className="size-5" />
                </div>
              ) : conversations.length === 0 ? (
                <p className="px-2 text-xs text-muted-foreground">
                  Aún no tienes conversaciones guardadas.
                </p>
              ) : (
                <ul className="space-y-0.5">
                  {conversations.map((conversation) => (
                    <AssistantConversationHistoryItem
                      conversation={conversation}
                      isActive={conversationId === conversation.id}
                      key={conversation.id}
                      onDelete={handleDeleteConversation}
                      onRename={handleRenameConversation}
                      onSelect={handleSelectConversationAndClose}
                    />
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </aside>

      <AssistantCreditsPurchaseDialog
        open={isPurchaseDialogOpen}
        onOpenChange={(open) => {
          if (open) {
            openPurchaseDialog();
            return;
          }

          closePurchaseDialog();
        }}
      />
    </>
  );
};
