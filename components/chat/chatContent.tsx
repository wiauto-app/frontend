"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MessageSquare } from "lucide-react";

import { useUser } from "@/app/contexts/auth/useUser";
import { MessageStatusIcon } from "@/components/chat/components/MessageStatusIcon";
import { ChatMessageComposer } from "@/components/chat/chatMessageComposer";
import { useChatSocket } from "@/components/chat/context/chatSocketContext";
import { useChatFilters } from "@/components/chat/hooks/useChatFilters";
import { formatMessageTime } from "@/components/chat/utils/formatMessageTime";
import { formatParticipantNames } from "@/components/chat/utils/formatParticipantNames";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CHAT_MESSAGE_TYPE,
  type ChatListItem,
  type ChatMessageListItem,
} from "@/interfaces/chat.interface";
import { cn } from "@/lib/utils";
import { chatService, unwrapChatResponse } from "@/services/chatService";

const MessageBubble = ({
  message,
  isOwn,
}: {
  message: ChatMessageListItem;
  isOwn: boolean;
}) => {
  const renderBody = () => {
    if (message.type === CHAT_MESSAGE_TYPE.TEXT) {
      return (
        <p className="whitespace-pre-wrap break-words text-sm">
          {message.content}
        </p>
      );
    }
    if (message.type === CHAT_MESSAGE_TYPE.IMAGE && message.media_url) {
      return (
        <a href={message.media_url} target="_blank" rel="noreferrer">
          <img
            src={message.media_url}
            alt={message.metadata?.caption ?? "Imagen"}
            className="max-h-64 max-w-full rounded-md object-cover"
          />
        </a>
      );
    }
    if (message.type === CHAT_MESSAGE_TYPE.AUDIO && message.media_url) {
      return (
        <audio controls src={message.media_url} className="max-w-full">
          <track kind="captions" />
        </audio>
      );
    }
    if (message.type === CHAT_MESSAGE_TYPE.FILE && message.media_url) {
      return (
        <a
          href={message.media_url}
          target="_blank"
          rel="noreferrer"
          className="text-sm underline"
        >
          {message.metadata?.file_name ?? "Descargar archivo"}
        </a>
      );
    }
    return (
      <p className="text-sm text-muted-foreground">Adjunto no disponible</p>
    );
  };

  return (
    <div className={cn("flex w-full", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[min(85%,28rem)] rounded-2xl px-3 py-2 shadow-sm",
          isOwn ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {renderBody()}
        <div
          className={cn(
            "mt-1 flex items-center justify-end gap-1 text-[10px]",
            isOwn ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
        >
          {message.edited_at ? <span>editado</span> : null}
          <span>{formatMessageTime(message.created_at)}</span>
          {isOwn ? <MessageStatusIcon status={message.status} /> : null}
        </div>
      </div>
    </div>
  );
};

export const ChatContent = () => {
  const { user } = useUser();
  const { chatId, handleChange } = useChatFilters();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const markedReadRef = useRef<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const {
    isConnected,
    joinChat,
    leaveChat,
    emitTypingStart,
    emitTypingStop,
    subscribePresence,
    presenceByUserId,
    typingByChatId,
  } = useChatSocket();

  const { data: chatListData } = useQuery({
    queryKey: ["chat-list"],
    queryFn: async () =>
      unwrapChatResponse(
        await chatService.findAll({
          page: 1,
          limit: 30,
          order_direction: "DESC",
        }),
      ),
  });

  useEffect(() => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 500);
  }, [chatListData]);

  const selectedChat: ChatListItem | undefined = useMemo(
    () => chatListData?.data.find((chat) => chat.id === chatId),
    [chatListData, chatId],
  );

  const otherParticipantIds = useMemo(
    () => selectedChat?.other_participants.map((participant) => participant.id) ?? [],
    [selectedChat],
  );

  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["chat-messages", chatId],
    queryFn: async () =>
      unwrapChatResponse(
        await chatService.findMessages(chatId!, { limit: 100 }),
      ),
    enabled: Boolean(chatId),
  });

  const messages = useMemo(() => messagesData?.data ?? [], [messagesData]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!chatId || !isConnected) return;
    void joinChat(chatId);
    return () => {
      void leaveChat(chatId);
    };
  }, [chatId, isConnected, joinChat, leaveChat]);

  useEffect(() => {
    if (!chatId || !isConnected || otherParticipantIds.length === 0) return;
    void subscribePresence(otherParticipantIds);
  }, [chatId, isConnected, otherParticipantIds, subscribePresence]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const markMessagesRead = useCallback(async () => {
    if (!chatId || messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    if (markedReadRef.current === lastMessage.id) return;
    markedReadRef.current = lastMessage.id;
    try {
      unwrapChatResponse(await chatService.markAsRead(chatId, lastMessage.id));
      void queryClient.invalidateQueries({ queryKey: ["chat-list"] });
      void queryClient.invalidateQueries({ queryKey: ["chat-unread-total"] });
    } catch {
      markedReadRef.current = null;
    }
  }, [chatId, messages, queryClient]);

  useEffect(() => {
    if (!chatId || messages.length === 0) return;
    void markMessagesRead();
  }, [chatId, messages, markMessagesRead]);

  const handleMessageSent = useCallback(() => {
    scrollToBottom();
    void markMessagesRead();
  }, [scrollToBottom, markMessagesRead]);

  const typingUserIds = useMemo(() => {
    if (!chatId) return [];
    const set = typingByChatId[chatId];
    if (!set) return [];
    return Array.from(set).filter((id) => id !== user?.id);
  }, [typingByChatId, chatId, user?.id]);

  const headerTitle = selectedChat
    ? formatParticipantNames(selectedChat.other_participants)
    : "Conversación";

  const presenceLabel = useMemo(() => {
    if (otherParticipantIds.length === 0) return null;
    const onlineCount = otherParticipantIds.filter(
      (id) => presenceByUserId[id] === "online",
    ).length;
    if (onlineCount === otherParticipantIds.length) {
      return "En línea";
    }
    if (onlineCount > 0) {
      return `${onlineCount} en línea`;
    }
    return "Desconectado";
  }, [otherParticipantIds, presenceByUserId]);

  const handleBackToList = () => {
    handleChange("chat_id", undefined);
  };

  if (!chatId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
        <MessageSquare className="size-8 opacity-50" aria-hidden />
        <p className="text-sm">Selecciona un chat para ver la conversación.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col">
      <header className="flex items-center gap-3 border-b pb-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={handleBackToList}
          aria-label="Volver a la lista de chats"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <Avatar className="size-10">
          <AvatarImage src={selectedChat?.other_participants[0]?.avatar_url} />
          <AvatarFallback>
            {selectedChat?.other_participants[0]?.name?.charAt(0) ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">{headerTitle}</h2>
          {presenceLabel ? (
            <p className="text-xs text-muted-foreground">{presenceLabel}</p>
          ) : null}
        </div>
      </header>

      <div
        ref={messagesContainerRef}
        className="flex max-h-[70vh] flex-1 flex-col gap-3 overflow-y-auto py-4"
      >
        {isLoadingMessages ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={`msg-skel-${index}`}
                className="h-12 w-2/3 rounded-xl"
              />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Aún no hay mensajes. Envía el primero.
          </p>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender_id === user?.id}
            />
          ))
        )}
        {typingUserIds.length > 0 ? (
          <p className="text-xs italic text-muted-foreground">Escribiendo…</p>
        ) : null}
        <div ref={messagesEndRef} />
      </div>

      <ChatMessageComposer
        chatId={chatId}
        onMessageSent={handleMessageSent}
        onTypingStart={() => emitTypingStart(chatId)}
        onTypingStop={() => emitTypingStop(chatId)}
      />
    </div>
  );
};
