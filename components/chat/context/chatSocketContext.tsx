"use client";

import { useUser } from "@/app/contexts/auth/useUser";
import { useQueryClient } from "@tanstack/react-query";
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
import { io, type Socket } from "socket.io-client";

import { CHAT_SOCKET_EVENTS } from "@/components/chat/constants/chatSocketEvents";
import { getSocketBaseUrl } from "@/components/chat/utils/getSocketBaseUrl";
import type {
  ChatMessageListItem,
  MessageDeletedPayload,
  MessagesReadPayload,
  PresenceStatus,
  PresenceUserSnapshot,
  TypingPayload,
} from "@/interfaces/chat.interface";

type PresenceMap = Record<string, PresenceStatus>;

interface ChatSocketContextValue {
  isConnected: boolean;
  presenceByUserId: PresenceMap;
  typingByChatId: Record<string, Set<string>>;
  joinChat: (chatId: string) => Promise<void>;
  leaveChat: (chatId: string) => Promise<void>;
  emitTypingStart: (chatId: string) => void;
  emitTypingStop: (chatId: string) => void;
  subscribePresence: (userIds: string[]) => Promise<PresenceUserSnapshot[]>;
}

const ChatSocketContext = createContext<ChatSocketContextValue | null>(null);

const CHAT_UNREAD_TOTAL_QUERY_KEY = ["chat-unread-total"] as const;
const CHAT_LIST_QUERY_KEY = ["chat-list"] as const;

export const ChatSocketProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useUser();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const joinedChatsRef = useRef<Set<string>>(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const [presenceByUserId, setPresenceByUserId] = useState<PresenceMap>({});
  const [typingByChatId, setTypingByChatId] = useState<
    Record<string, Set<string>>
  >({});

  const invalidateChatQueries = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: CHAT_LIST_QUERY_KEY });
    void queryClient.invalidateQueries({
      queryKey: CHAT_UNREAD_TOTAL_QUERY_KEY,
    });
  }, [queryClient]);

  const upsertMessageInCache = useCallback(
    (message: ChatMessageListItem) => {
      queryClient.setQueryData<{
        data: ChatMessageListItem[];
        total: number;
        page: number;
        limit: number;
      }>(["chat-messages", message.chat_id], (previous) => {
        if (!previous) return previous;
        const existsIndex = previous.data.findIndex(
          (item) => item.id === message.id,
        );
        if (existsIndex >= 0) {
          const nextData = [...previous.data];
          nextData[existsIndex] = message;
          return { ...previous, data: nextData };
        }
        return { ...previous, data: [...previous.data, message] };
      });
      invalidateChatQueries();
    },
    [queryClient, invalidateChatQueries],
  );

  const removeMessageFromCache = useCallback(
    (payload: MessageDeletedPayload) => {
      queryClient.setQueryData<{
        data: ChatMessageListItem[];
        total: number;
        page: number;
        limit: number;
      }>(["chat-messages", payload.chat_id], (previous) => {
        if (!previous) return previous;
        return {
          ...previous,
          data: previous.data.filter((item) => item.id !== payload.id),
        };
      });
      invalidateChatQueries();
    },
    [queryClient, invalidateChatQueries],
  );

  const applyMessagesRead = useCallback(
    (payload: MessagesReadPayload) => {
      queryClient.setQueryData<{
        data: ChatMessageListItem[];
        total: number;
        page: number;
        limit: number;
      }>(["chat-messages", payload.chat_id], (previous) => {
        if (!previous) return previous;
        return {
          ...previous,
          data: previous.data.map((item) =>
            payload.message_ids.includes(item.id)
              ? { ...item, status: "read" as const }
              : item,
          ),
        };
      });
      invalidateChatQueries();
    },
    [queryClient, invalidateChatQueries],
  );

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    const socket = io(`${getSocketBaseUrl()}/chat`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const handleMessageCreated = (message: ChatMessageListItem) => {
      upsertMessageInCache(message);
    };

    const handleMessageUpdated = (message: ChatMessageListItem) => {
      upsertMessageInCache(message);
    };

    const handleMessageDeleted = (payload: MessageDeletedPayload) => {
      removeMessageFromCache(payload);
    };

    const handleMessagesRead = (payload: MessagesReadPayload) => {
      applyMessagesRead(payload);
    };

    const handleUnreadUpdated = () => {
      invalidateChatQueries();
    };

    const handleTypingStart = (payload: TypingPayload) => {
      setTypingByChatId((previous) => {
        const current = new Set(previous[payload.chat_id] ?? []);
        current.add(payload.user_id);
        return { ...previous, [payload.chat_id]: current };
      });
    };

    const handleTypingStop = (payload: TypingPayload) => {
      setTypingByChatId((previous) => {
        const current = new Set(previous[payload.chat_id] ?? []);
        current.delete(payload.user_id);
        return { ...previous, [payload.chat_id]: current };
      });
    };

    const handlePresenceChanged = (payload: {
      user_id: string;
      status: PresenceStatus;
    }) => {
      setPresenceByUserId((previous) => ({
        ...previous,
        [payload.user_id]: payload.status,
      }));
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(CHAT_SOCKET_EVENTS.MESSAGE_CREATED, handleMessageCreated);
    socket.on(CHAT_SOCKET_EVENTS.MESSAGE_UPDATED, handleMessageUpdated);
    socket.on(CHAT_SOCKET_EVENTS.MESSAGE_DELETED, handleMessageDeleted);
    socket.on(CHAT_SOCKET_EVENTS.MESSAGES_READ, handleMessagesRead);
    socket.on(CHAT_SOCKET_EVENTS.UNREAD_UPDATED, handleUnreadUpdated);
    socket.on(CHAT_SOCKET_EVENTS.TYPING_START, handleTypingStart);
    socket.on(CHAT_SOCKET_EVENTS.TYPING_STOP, handleTypingStop);
    socket.on(CHAT_SOCKET_EVENTS.PRESENCE_CHANGED, handlePresenceChanged);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off(CHAT_SOCKET_EVENTS.MESSAGE_CREATED, handleMessageCreated);
      socket.off(CHAT_SOCKET_EVENTS.MESSAGE_UPDATED, handleMessageUpdated);
      socket.off(CHAT_SOCKET_EVENTS.MESSAGE_DELETED, handleMessageDeleted);
      socket.off(CHAT_SOCKET_EVENTS.MESSAGES_READ, handleMessagesRead);
      socket.off(CHAT_SOCKET_EVENTS.UNREAD_UPDATED, handleUnreadUpdated);
      socket.off(CHAT_SOCKET_EVENTS.TYPING_START, handleTypingStart);
      socket.off(CHAT_SOCKET_EVENTS.TYPING_STOP, handleTypingStop);
      socket.off(CHAT_SOCKET_EVENTS.PRESENCE_CHANGED, handlePresenceChanged);
      socket.disconnect();
      socketRef.current = null;
      joinedChatsRef.current.clear();
      setIsConnected(false);
    };
  }, [
    isAuthenticated,
    user?.id,
    upsertMessageInCache,
    removeMessageFromCache,
    applyMessagesRead,
    invalidateChatQueries,
  ]);

  const joinChat = useCallback(async (chatId: string) => {
    const socket = socketRef.current;
    if (!socket?.connected || joinedChatsRef.current.has(chatId)) return;
    await socket.emitWithAck(CHAT_SOCKET_EVENTS.JOIN_CHAT, { chat_id: chatId });
    joinedChatsRef.current.add(chatId);
  }, []);

  const leaveChat = useCallback(async (chatId: string) => {
    const socket = socketRef.current;
    if (!socket?.connected || !joinedChatsRef.current.has(chatId)) return;
    await socket.emitWithAck(CHAT_SOCKET_EVENTS.LEAVE_CHAT, { chat_id: chatId });
    joinedChatsRef.current.delete(chatId);
  }, []);

  const emitTypingStart = useCallback((chatId: string) => {
    socketRef.current?.emit(CHAT_SOCKET_EVENTS.TYPING_START, { chat_id: chatId });
  }, []);

  const emitTypingStop = useCallback((chatId: string) => {
    socketRef.current?.emit(CHAT_SOCKET_EVENTS.TYPING_STOP, { chat_id: chatId });
  }, []);

  const subscribePresence = useCallback(async (userIds: string[]) => {
    const socket = socketRef.current;
    if (!socket?.connected || userIds.length === 0) return [];
    const response = (await socket.emitWithAck(
      CHAT_SOCKET_EVENTS.PRESENCE_SUBSCRIBE,
      { user_ids: userIds },
    )) as { users?: PresenceUserSnapshot[] };
    const users = response.users ?? [];
    setPresenceByUserId((previous) => {
      const next = { ...previous };
      for (const item of users) {
        next[item.user_id] = item.status;
      }
      return next;
    });
    return users;
  }, []);

  const value = useMemo(
    () => ({
      isConnected,
      presenceByUserId,
      typingByChatId,
      joinChat,
      leaveChat,
      emitTypingStart,
      emitTypingStop,
      subscribePresence,
    }),
    [
      isConnected,
      presenceByUserId,
      typingByChatId,
      joinChat,
      leaveChat,
      emitTypingStart,
      emitTypingStop,
      subscribePresence,
    ],
  );

  return (
    <ChatSocketContext.Provider value={value}>
      {children}
    </ChatSocketContext.Provider>
  );
};

export const useChatSocket = (): ChatSocketContextValue => {
  const context = useContext(ChatSocketContext);
  if (!context) {
    throw new Error("useChatSocket debe usarse dentro de ChatSocketProvider.");
  }
  return context;
};

export const CHAT_QUERY_KEYS = {
  unreadTotal: CHAT_UNREAD_TOTAL_QUERY_KEY,
  chatList: CHAT_LIST_QUERY_KEY,
} as const;
