"use client";

import { API_URL } from "@/constants";
import {
  assistantConversationService,
  type AssistantConversationListItem,
} from "@/services/assistant/assistantConversationService";
import { assistantQuotaService } from "@/services/assistant/assistantQuotaService";
import type { AssistantQuotaResponse } from "@/interfaces/billing.interface";
import { useChat } from "@ai-sdk/react";
import { useQuery } from "@tanstack/react-query";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const ASSISTANT_CHAT_API_URL = `${API_URL}/v1/assistant/chat`;
const QUOTA_EXCEEDED_ERROR = "ASSISTANT_QUOTA_EXCEEDED";

type AssistantChatContextValue = ReturnType<typeof useChat> & {
  conversationId?: string;
  conversations: AssistantConversationListItem[];
  isConversationLoading: boolean;
  isConversationsLoading: boolean;
  quota: AssistantQuotaResponse | null;
  isQuotaLoading: boolean;
  refreshQuota: () => Promise<void>;
  isPurchaseDialogOpen: boolean;
  openPurchaseDialog: () => void;
  closePurchaseDialog: () => void;
  refreshConversations: () => Promise<void>;
  handleNewConversation: () => Promise<void>;
  handleSelectConversation: (conversationId: string) => void;
  handleDeleteConversation: (conversationId: string) => Promise<void>;
  handleRenameConversation: (
    conversationId: string,
    title: string,
  ) => Promise<void>;
  ensureConversationId: () => Promise<string | undefined>;
};

const AssistantChatContext = createContext<AssistantChatContextValue | null>(
  null,
);

type AssistantChatProviderProps = {
  children: ReactNode;
};

export const AssistantChatProvider = ({
  children,
}: AssistantChatProviderProps) => {
  const router = useRouter();
  const params = useParams<{ conversationId?: string }>();
  const searchParams = useSearchParams();
  const conversationId =
    typeof params.conversationId === "string" ? params.conversationId : undefined;
  const [resolvedConversationId, setResolvedConversationId] = useState(conversationId);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [isConversationLoading, setIsConversationLoading] = useState(
    Boolean(conversationId),
  );
  const [conversations, setConversations] = useState<
    AssistantConversationListItem[]
  >([]);
  const [isConversationsLoading, setIsConversationsLoading] = useState(true);

  useEffect(() => {
    setResolvedConversationId(conversationId);
  }, [conversationId]);

  const {
    data: quota = null,
    isLoading: isQuotaLoading,
    refetch: refetchQuota,
  } = useQuery({
    queryKey: ["assistant-quota"],
    queryFn: () => assistantQuotaService.getQuota(),
  });

  const refreshQuota = useCallback(async () => {
    await refetchQuota();
  }, [refetchQuota]);

  const openPurchaseDialog = useCallback(() => {
    setIsPurchaseDialogOpen(true);
  }, []);

  const closePurchaseDialog = useCallback(() => {
    setIsPurchaseDialogOpen(false);
  }, []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: ASSISTANT_CHAT_API_URL,
        credentials: "include",
        body: {
          conversation_id: resolvedConversationId,
        },
        fetch: async (input, init) => {
          const response = await fetch(input, init);

          if (response.status === 402) {
            throw new Error(QUOTA_EXCEEDED_ERROR);
          }

          return response;
        },
      }),
    [resolvedConversationId],
  );

  const refreshConversations = useCallback(async () => {
    setIsConversationsLoading(true);
    try {
      const items = await assistantConversationService.findAll();
      setConversations(items);
    } catch {
      setConversations([]);
    } finally {
      setIsConversationsLoading(false);
    }
  }, [setConversations, setIsConversationsLoading]);

  const chat = useChat({
    id: conversationId ?? "assistant-new-chat",
    transport,
    onFinish: async () => {
      await Promise.all([refreshConversations(), refreshQuota()]);
    },
    onError: (error) => {
      if (error.message === QUOTA_EXCEEDED_ERROR) {
        toast.error("No tienes consultas disponibles. Compra un pack para continuar.");
        openPurchaseDialog();
        void refreshQuota();
        return;
      }

      toast.error("No se pudo enviar el mensaje al asistente");
    },
  });

  useEffect(() => {
    void refreshConversations();
  }, [refreshConversations]);

  useEffect(() => {
    const checkout = searchParams.get("checkout");

    if (checkout === "success") {
      toast.success("Compra completada. Tus consultas ya están disponibles.");
      void refreshQuota();
    }

    if (checkout === "cancel") {
      toast.error("La compra fue cancelada");
    }
  }, [refreshQuota, searchParams]);

  useEffect(() => {
    let cancelled = false;

    if (!conversationId) {
      setInitialMessages([]);
      setIsConversationLoading(false);
      return;
    }

    setIsConversationLoading(true);

    assistantConversationService
      .findOne(conversationId)
      .then((conversation) => {
        if (cancelled) {
          return;
        }

        setInitialMessages(conversation.messages ?? []);
        setIsConversationLoading(false);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setInitialMessages([]);
        setIsConversationLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  useEffect(() => {
    if (isConversationLoading) {
      return;
    }

    chat.setMessages(initialMessages);
  }, [isConversationLoading]);

  const updateConversationIdInUrl = useCallback(
    (nextConversationId?: string) => {
      const checkout = searchParams.get("checkout");
      const query = checkout ? `?checkout=${checkout}` : "";

      if (nextConversationId) {
        router.replace(`/asistente/chat/${nextConversationId}${query}`);
        return;
      }

      router.replace(`/asistente/chat${query}`);
    },
    [router, searchParams],
  );

  const handleNewConversation = useCallback(async () => {
    const created = await assistantConversationService.create();
    setResolvedConversationId(created.id);
    updateConversationIdInUrl(created.id);
    setInitialMessages([]);
    chat.setMessages([]);
    await refreshConversations();
  }, [
    chat,
    refreshConversations,
    setInitialMessages,
    updateConversationIdInUrl,
  ]);

  const handleSelectConversation = useCallback(
    (nextConversationId: string) => {
      updateConversationIdInUrl(nextConversationId);
    },
    [updateConversationIdInUrl],
  );

  const handleDeleteConversation = useCallback(
    async (targetConversationId: string) => {
      await assistantConversationService.remove(targetConversationId);
      await refreshConversations();

      if (conversationId === targetConversationId) {
        setResolvedConversationId(undefined);
        updateConversationIdInUrl(undefined);
        setInitialMessages([]);
        chat.setMessages([]);
      }
    },
    [
      chat,
      conversationId,
      refreshConversations,
      setInitialMessages,
      updateConversationIdInUrl,
    ],
  );

  const handleRenameConversation = useCallback(
    async (targetConversationId: string, title: string) => {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        return;
      }

      await assistantConversationService.updateTitle(
        targetConversationId,
        trimmedTitle,
      );
      await refreshConversations();
    },
    [refreshConversations],
  );

  const ensureConversationId = useCallback(async () => {
    if (resolvedConversationId) {
      return resolvedConversationId;
    }

    const created = await assistantConversationService.create();
    setResolvedConversationId(created.id);
    updateConversationIdInUrl(created.id);
    await refreshConversations();
    return created.id;
  }, [refreshConversations, resolvedConversationId, updateConversationIdInUrl]);

  const contextValue = useMemo(
    () => ({
      ...chat,
      conversationId,
      conversations,
      isConversationLoading,
      isConversationsLoading,
      quota,
      isQuotaLoading,
      refreshQuota,
      isPurchaseDialogOpen,
      openPurchaseDialog,
      closePurchaseDialog,
      refreshConversations,
      handleNewConversation,
      handleSelectConversation,
      handleDeleteConversation,
      handleRenameConversation,
      ensureConversationId,
    }),
    [
      chat,
      closePurchaseDialog,
      conversationId,
      conversations,
      ensureConversationId,
      handleDeleteConversation,
      handleRenameConversation,
      handleNewConversation,
      handleSelectConversation,
      isConversationLoading,
      isConversationsLoading,
      isPurchaseDialogOpen,
      isQuotaLoading,
      openPurchaseDialog,
      quota,
      refreshConversations,
      refreshQuota,
    ],
  );

  return (
    <AssistantChatContext.Provider value={contextValue}>
      {children}
    </AssistantChatContext.Provider>
  );
};

export const useAssistantChat = () => {
  const context = useContext(AssistantChatContext);

  if (!context) {
    throw new Error(
      "useAssistantChat debe usarse dentro de AssistantChatProvider",
    );
  }

  return context;
};
