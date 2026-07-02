"use client";

import { API_URL } from "@/constants";
import {
  assistantConversationService,
  type AssistantConversationListItem,
} from "@/services/assistant/assistantConversationService";
import { useChat } from "@ai-sdk/react";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ASSISTANT_CHAT_API_URL = `${API_URL}/v1/assistant/chat`;

type AssistantChatContextValue = ReturnType<typeof useChat> & {
  conversationId?: string;
  conversations: AssistantConversationListItem[];
  isConversationLoading: boolean;
  isConversationsLoading: boolean;
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId") ?? undefined;
  const conversationIdRef = useRef(conversationId);

  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [isConversationLoading, setIsConversationLoading] = useState(
    Boolean(conversationId),
  );
  const [conversations, setConversations] = useState<
    AssistantConversationListItem[]
  >([]);
  const [isConversationsLoading, setIsConversationsLoading] = useState(true);

  conversationIdRef.current = conversationId;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: ASSISTANT_CHAT_API_URL,
        credentials: "include",
        body: () => ({
          conversation_id: conversationIdRef.current,
        }),
      }),
    [],
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
  }, []);

  const chat = useChat({
    id: conversationId ?? "assistant-new-chat",
    transport,
    onFinish: async () => {
      await refreshConversations();
    },
  });

  useEffect(() => {
    void refreshConversations();
  }, [refreshConversations]);

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
      const params = new URLSearchParams(searchParams.toString());

      if (nextConversationId) {
        params.set("conversationId", nextConversationId);
      } else {
        params.delete("conversationId");
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const handleNewConversation = useCallback(async () => {
    const created = await assistantConversationService.create();
    updateConversationIdInUrl(created.id);
    setInitialMessages([]);
    chat.setMessages([]);
    await refreshConversations();
  }, [chat, refreshConversations, updateConversationIdInUrl]);

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
    if (conversationIdRef.current) {
      return conversationIdRef.current;
    }

    const created = await assistantConversationService.create();
    conversationIdRef.current = created.id;
    updateConversationIdInUrl(created.id);
    await refreshConversations();
    return created.id;
  }, [refreshConversations, updateConversationIdInUrl]);

  const contextValue = useMemo(
    () => ({
      ...chat,
      conversationId,
      conversations,
      isConversationLoading,
      isConversationsLoading,
      refreshConversations,
      handleNewConversation,
      handleSelectConversation,
      handleDeleteConversation,
      handleRenameConversation,
      ensureConversationId,
    }),
    [
      chat,
      conversationId,
      conversations,
      ensureConversationId,
      handleDeleteConversation,
      handleRenameConversation,
      handleNewConversation,
      handleSelectConversation,
      isConversationLoading,
      isConversationsLoading,
      refreshConversations,
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
