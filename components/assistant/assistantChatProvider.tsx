"use client";

import { API_URL } from "@/constants";
import {
  assistantConversationService,
  type AssistantConversationListItem,
} from "@/services/assistant/assistantConversationService";
import { assistantQuotaService } from "@/services/assistant/assistantQuotaService";
import type { AssistantQuotaResponse } from "@/interfaces/billing.interface";
import type { SearchVehiclesInput } from "@/interfaces/search-vehicles.interface";
import { useChat } from "@ai-sdk/react";
import { useQuery } from "@tanstack/react-query";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ASSISTANT_KEYS,
  BUY_ASSISTANT_BOOTSTRAP_MESSAGE,
} from "./constants/assistantKeys.constants";
import {
  clearBuyAssistantInitialFilters,
  isBuyAssistantConversation,
  markConversationAsBuyAssistant,
  readBuyAssistantFiltersForConversation,
  readBuyAssistantInitialFilters,
  unmarkConversationAsBuyAssistant,
} from "./utils/buyAssistantSessionStorage";
import { useUser } from "@/app/contexts/auth/useUser";
import { resolveAssistantPageContext } from "./utils/assistantPageContext";

const ASSISTANT_CHAT_API_URL = `${API_URL}/v1/assistant/chat`;
const QUOTA_EXCEEDED_ERROR = "ASSISTANT_QUOTA_EXCEEDED";

interface BuyAssistantRequestState {
  mode?: "buy_assistant";
  initial_filters?: SearchVehiclesInput;
}

const messageHasBuyAssistantBootstrap = (messages: UIMessage[]): boolean => {
  return messages.some((message) => {
    if (message.role !== "user") {
      return false;
    }

    return message.parts.some(
      (part) =>
        part.type === "text" &&
        part.text === BUY_ASSISTANT_BOOTSTRAP_MESSAGE,
    );
  });
};

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

interface AssistantChatProviderProps {
  children: ReactNode;
}

export const AssistantChatProvider = ({
  children,
}: AssistantChatProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useUser();
  const params = useParams<{ conversationId?: string }>();

  const [buyerAssistantKey, setBuyerAssistantKey] = useState(false);
  const [checkout, setCheckout] = useState<string | undefined>();
  const conversationId =
    typeof params.conversationId === "string" ? params.conversationId : undefined;
  const [resolvedConversationId, setResolvedConversationId] =
    useState(conversationId);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setBuyerAssistantKey(params.has(ASSISTANT_KEYS.BUY_ASSISTANT_KEY));
    setCheckout(params.get(ASSISTANT_KEYS.CHECKOUT_KEY) ?? undefined);
  }, [pathname]);

  const handleRemove = useCallback(
    (key: string) => {
      const params = new URLSearchParams(window.location.search);
      params.delete(key);
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
      if (key === ASSISTANT_KEYS.BUY_ASSISTANT_KEY) setBuyerAssistantKey(false);
      if (key === ASSISTANT_KEYS.CHECKOUT_KEY) setCheckout(undefined);
    },
    [pathname, router],
  );

  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [isConversationLoading, setIsConversationLoading] = useState(
    Boolean(conversationId),
  );
  const [conversations, setConversations] = useState<
    AssistantConversationListItem[]
  >([]);
  const [isConversationsLoading, setIsConversationsLoading] = useState(true);

  const conversationIdRef = useRef(resolvedConversationId);
  const pageContextRef = useRef(resolveAssistantPageContext(pathname));
  const buyAssistantRequestRef = useRef<BuyAssistantRequestState>({});
  const buyAssistantBootstrapDoneRef = useRef(false);
  const buyAssistantBootstrapPendingRef = useRef(false);
  const sendMessageRef = useRef<ReturnType<typeof useChat>["sendMessage"] | null>(
    null,
  );

  useEffect(() => {
    if (conversationId || pathname.startsWith("/asistente")) {
      setResolvedConversationId(conversationId);
    }
  }, [conversationId, pathname]);

  useEffect(() => {
    conversationIdRef.current = resolvedConversationId;
  }, [resolvedConversationId]);

  useEffect(() => {
    if (pathname.startsWith("/asistente")) {
      return;
    }

    pageContextRef.current = resolveAssistantPageContext(pathname);
  }, [pathname]);

  useEffect(() => {
    if (!resolvedConversationId) {
      return;
    }

    if (!isBuyAssistantConversation(resolvedConversationId)) {
      return;
    }

    const storedFilters = readBuyAssistantFiltersForConversation(
      resolvedConversationId,
    );

    buyAssistantRequestRef.current = {
      mode: "buy_assistant",
      ...(storedFilters ? { initial_filters: storedFilters } : {}),
    };
  }, [resolvedConversationId]);

  const {
    data: quota = null,
    isLoading: isQuotaLoading,
    refetch: refetchQuota,
  } = useQuery({
    queryKey: ["assistant-quota"],
    queryFn: () => assistantQuotaService.getQuota(),
    enabled: isAuthenticated,
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

  const resolveBuyAssistantRequestState = useCallback(
    (conversationIdForRequest?: string): BuyAssistantRequestState => {
      const fromRef = buyAssistantRequestRef.current;
      const storedFilters = conversationIdForRequest
        ? readBuyAssistantFiltersForConversation(conversationIdForRequest)
        : undefined;

      if (fromRef.mode === "buy_assistant") {
        return {
          mode: "buy_assistant",
          ...(fromRef.initial_filters
            ? { initial_filters: fromRef.initial_filters }
            : storedFilters
              ? { initial_filters: storedFilters }
              : {}),
        };
      }

      if (
        conversationIdForRequest &&
        isBuyAssistantConversation(conversationIdForRequest)
      ) {
        return {
          mode: "buy_assistant",
          ...(storedFilters ? { initial_filters: storedFilters } : {}),
        };
      }

      return {};
    },
    [],
  );

  const transport = useMemo(
    () =>
      // Refs inside prepareSendMessagesRequest are read only at send time.
      // eslint-disable-next-line react-hooks/refs -- send-time callback, not render
      new DefaultChatTransport({
        api: ASSISTANT_CHAT_API_URL,
        credentials: "include",
        prepareSendMessagesRequest: ({
          id,
          messages,
          body,
          trigger,
          messageId,
        }) => {
          const activeConversationId = conversationIdRef.current;
          const buyAssistant =
            resolveBuyAssistantRequestState(activeConversationId);
          const initialFilters = buyAssistant.initial_filters;

          if (buyAssistant.mode === "buy_assistant" && activeConversationId) {
            markConversationAsBuyAssistant(
              activeConversationId,
              initialFilters,
            );
            buyAssistantRequestRef.current = {
              mode: "buy_assistant",
              ...(initialFilters ? { initial_filters: initialFilters } : {}),
            };
          }

          return {
            body: {
              ...body,
              id,
              messages,
              trigger,
              messageId,
              conversation_id: activeConversationId,
              page_context: pageContextRef.current,
              ...(buyAssistant.mode ? { mode: buyAssistant.mode } : {}),
              ...(initialFilters ? { initial_filters: initialFilters } : {}),
            },
          };
        },
        fetch: async (input, init) => {
          const response = await fetch(input, init);

          if (response.status === 402) {
            throw new Error(QUOTA_EXCEEDED_ERROR);
          }

          return response;
        },
      }),
    [resolveBuyAssistantRequestState],
  );

  const refreshConversations = useCallback(async () => {
    if (!isAuthenticated) {
      setConversations([]);
      setIsConversationsLoading(false);
      return;
    }
    setIsConversationsLoading(true);
    try {
      const items = await assistantConversationService.findAll();
      setConversations(items);
    } catch {
      setConversations([]);
    } finally {
      setIsConversationsLoading(false);
    }
  }, [isAuthenticated, setConversations, setIsConversationsLoading]);

  const chat = useChat({
    id: conversationId ?? "assistant-new-chat",
    transport,
    onFinish: async () => {
      await Promise.all([refreshConversations(), refreshQuota()]);
    },
    onError: (error) => {
      if (error.message === QUOTA_EXCEEDED_ERROR) {
        toast.error(
          "No tienes consultas disponibles. Compra un pack para continuar.",
        );
        openPurchaseDialog();
        void refreshQuota();
        return;
      }

      toast.error("No se pudo enviar el mensaje al asistente");
    },
  });

  useEffect(() => {
    sendMessageRef.current = chat.sendMessage;
  }, [chat.sendMessage]);

  useEffect(() => {
    if (isAuthenticated) {
      void refreshConversations();
    }
  }, [isAuthenticated, refreshConversations]);

  useEffect(() => {
    if (checkout === "success") {
      toast.success("Compra completada. Tus consultas ya están disponibles.");
      void refreshQuota();
    }

    if (checkout === "cancel") {
      toast.error("La compra fue cancelada");
    }
  }, [refreshQuota, checkout]);

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

        const loadedMessages = conversation.messages ?? [];
        setInitialMessages(loadedMessages);

        if (
          conversationId &&
          (isBuyAssistantConversation(conversationId) ||
            messageHasBuyAssistantBootstrap(loadedMessages))
        ) {
          const storedFilters =
            readBuyAssistantFiltersForConversation(conversationId);
          markConversationAsBuyAssistant(conversationId, storedFilters);
          buyAssistantRequestRef.current = {
            mode: "buy_assistant",
            ...(storedFilters ? { initial_filters: storedFilters } : {}),
          };
        }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync only when load finishes
  }, [isConversationLoading]);

  const updateConversationIdInUrl = useCallback(
    (nextConversationId?: string) => {
      const query = checkout ? `?checkout=${checkout}` : "";

      if (nextConversationId) {
        if (pathname.startsWith("/asistente")) {
          router.replace(`/asistente/chat/${nextConversationId}${query}`);
        }
        return;
      }

      if (pathname.startsWith("/asistente")) {
        router.replace(`/asistente/chat${query}`);
      }
    },
    [router, checkout, pathname],
  );

  const handleNewConversation = useCallback(async () => {
    buyAssistantRequestRef.current = {};
    buyAssistantBootstrapDoneRef.current = false;
    buyAssistantBootstrapPendingRef.current = false;
    const created = await assistantConversationService.create();
    setResolvedConversationId(created.id);
    updateConversationIdInUrl(created.id);
    setInitialMessages([]);
    chat.setMessages([]);
    await refreshConversations();
  }, [chat, refreshConversations, updateConversationIdInUrl]);

  const handleSelectConversation = useCallback(
    (nextConversationId: string) => {
      if (isBuyAssistantConversation(nextConversationId)) {
        const storedFilters =
          readBuyAssistantFiltersForConversation(nextConversationId);
        buyAssistantRequestRef.current = {
          mode: "buy_assistant",
          ...(storedFilters ? { initial_filters: storedFilters } : {}),
        };
      } else {
        buyAssistantRequestRef.current = {};
      }

      updateConversationIdInUrl(nextConversationId);
    },
    [updateConversationIdInUrl],
  );

  const handleDeleteConversation = useCallback(
    async (targetConversationId: string) => {
      await assistantConversationService.remove(targetConversationId);
      unmarkConversationAsBuyAssistant(targetConversationId);
      await refreshConversations();

      if (conversationId === targetConversationId) {
        buyAssistantRequestRef.current = {};
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
    conversationIdRef.current = created.id;
    updateConversationIdInUrl(created.id);
    await refreshConversations();
    return created.id;
  }, [refreshConversations, resolvedConversationId, updateConversationIdInUrl]);

  useEffect(() => {
    if (!buyerAssistantKey || buyAssistantBootstrapDoneRef.current) {
      return;
    }

    if (buyAssistantBootstrapPendingRef.current) {
      return;
    }

    if (isConversationLoading) {
      return;
    }

    if (conversationId && initialMessages.length > 0) {
      buyAssistantBootstrapDoneRef.current = true;
      const storedFilters =
        readBuyAssistantFiltersForConversation(conversationId);
      markConversationAsBuyAssistant(conversationId, storedFilters);
      buyAssistantRequestRef.current = {
        mode: "buy_assistant",
        ...(storedFilters ? { initial_filters: storedFilters } : {}),
      };
      handleRemove(ASSISTANT_KEYS.BUY_ASSISTANT_KEY);
      clearBuyAssistantInitialFilters();
      return;
    }

    const prepareBuyAssistantBootstrap = async () => {
      if (
        buyAssistantBootstrapPendingRef.current ||
        buyAssistantBootstrapDoneRef.current
      ) {
        return;
      }

      buyAssistantBootstrapPendingRef.current = true;

      const initialFilters = readBuyAssistantInitialFilters();
      buyAssistantRequestRef.current = {
        mode: "buy_assistant",
        ...(initialFilters ? { initial_filters: initialFilters } : {}),
      };

      handleRemove(ASSISTANT_KEYS.BUY_ASSISTANT_KEY);

      try {
        const ensuredConversationId = await ensureConversationId();

        if (ensuredConversationId) {
          markConversationAsBuyAssistant(
            ensuredConversationId,
            initialFilters,
          );
        }
      } catch {
        buyAssistantBootstrapPendingRef.current = false;
        toast.error("No se pudo iniciar el asistente de compra");
      }
    };

    void prepareBuyAssistantBootstrap();
  }, [
    buyerAssistantKey,
    conversationId,
    ensureConversationId,
    handleRemove,
    initialMessages.length,
    isConversationLoading,
  ]);

  useEffect(() => {
    if (!buyAssistantBootstrapPendingRef.current) {
      return;
    }

    if (buyAssistantBootstrapDoneRef.current) {
      return;
    }

    if (isConversationLoading) {
      return;
    }

    if (!conversationId || conversationId !== resolvedConversationId) {
      return;
    }

    if (initialMessages.length > 0) {
      buyAssistantBootstrapPendingRef.current = false;
      buyAssistantBootstrapDoneRef.current = true;
      clearBuyAssistantInitialFilters();
      return;
    }

    buyAssistantBootstrapDoneRef.current = true;
    buyAssistantBootstrapPendingRef.current = false;
    clearBuyAssistantInitialFilters();
    sendMessageRef.current?.({ text: BUY_ASSISTANT_BOOTSTRAP_MESSAGE });
  }, [
    conversationId,
    initialMessages.length,
    isConversationLoading,
    resolvedConversationId,
  ]);

  const contextValue = useMemo(
    () => ({
      ...chat,
      conversationId: resolvedConversationId,
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
      resolvedConversationId,
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
