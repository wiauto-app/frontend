"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Ban,
  Flag,
  MessageSquare,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { MessageStatusIcon } from "@/components/chat/components/MessageStatusIcon";
import { ChatMessageComposer } from "@/components/chat/chatMessageComposer";
import { ChatTicketStatusPanel } from "@/components/chat/ChatTicketStatusPanel";
import { useChatSocket } from "@/components/chat/context/chatSocketContext";
import { useChatFilters } from "@/components/chat/hooks/useChatFilters";
import { formatMessageTime } from "@/components/chat/utils/formatMessageTime";
import { formatParticipantNames } from "@/components/chat/utils/formatParticipantNames";
import { ReportDialog } from "@/components/reports/ReportDialog";
import CustomAlertDialog from "@/components/ui/customAlertDialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CHAT_MESSAGE_TYPE,
  type ChatListItem,
  type ChatMessageListItem,
  type ChatParticipantSummary,
} from "@/interfaces/chat.interface";
import {
  REPORT_TARGET_TYPE,
  type ReportTarget,
} from "@/interfaces/report.interface";
import { cn } from "@/lib/utils";
import {
  BLOCKS_QUERY_KEY,
  blocksService,
} from "@/services/blocksService";
import { chatService, unwrapChatResponse } from "@/services/chatService";

interface MessageBubbleProps {
  message: ChatMessageListItem;
  isOwn: boolean;
  onReport?: (message: ChatMessageListItem) => void;
}

const MessageBubble = ({ message, isOwn, onReport }: MessageBubbleProps) => {
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
    <div
      className={cn(
        "group flex w-full items-end gap-1",
        isOwn ? "justify-end" : "justify-start",
      )}
    >
      {!isOwn && onReport ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100 sm:data-popup-open:opacity-100"
                aria-label="Opciones del mensaje"
              >
                <MoreVertical className="size-4" aria-hidden />
              </Button>
            }
          />
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => {
                onReport(message);
              }}
            >
              <Flag className="size-4" aria-hidden />
              Reportar mensaje
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}

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

const getParticipantDisplayName = (
  participant: ChatParticipantSummary,
): string => formatParticipantNames([participant]);

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

  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false);
  const [pendingBlockParticipant, setPendingBlockParticipant] =
    useState<ChatParticipantSummary | null>(null);
  const [isBlockSubmitting, setIsBlockSubmitting] = useState(false);

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

  const { data: blocksData } = useQuery({
    queryKey: BLOCKS_QUERY_KEY,
    queryFn: async () => {
      const response = await blocksService.findAll();
      if (!response.ok) {
        throw new Error(response.message || "No se pudieron cargar los bloqueos");
      }
      return response.data ?? [];
    },
  });

  const blockedProfileIds = useMemo(
    () => new Set((blocksData ?? []).map((block) => block.blocked_profile_id)),
    [blocksData],
  );

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

  const canManageBlocks = Boolean(
    selectedChat && !selectedChat.ticket && otherParticipantIds.length > 0,
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
    ? selectedChat.ticket?.title?.trim() ||
      formatParticipantNames(selectedChat.other_participants)
    : "Conversación";

  const presenceLabel = useMemo(() => {
    if (selectedChat?.ticket) {
      return "Soporte WiAuto";
    }
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
  }, [otherParticipantIds, presenceByUserId, selectedChat?.ticket]);

  const handleBackToList = () => {
    handleChange("chat_id", undefined);
  };

  const resolveSenderName = useCallback(
    (senderId: string) => {
      const participant = selectedChat?.other_participants.find(
        (item) => item.id === senderId,
      );
      if (participant) {
        return getParticipantDisplayName(participant);
      }
      return "usuario";
    },
    [selectedChat?.other_participants],
  );

  const handleReportMessage = useCallback(
    (message: ChatMessageListItem) => {
      setReportTarget({
        targetType: REPORT_TARGET_TYPE.CHAT_MESSAGE,
        targetId: message.id,
        targetName: resolveSenderName(message.sender_id),
      });
    },
    [resolveSenderName],
  );

  const handleRequestBlock = (participant: ChatParticipantSummary) => {
    setPendingBlockParticipant(participant);
    setBlockConfirmOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (!pendingBlockParticipant) {
      return;
    }

    setIsBlockSubmitting(true);
    try {
      const response = await blocksService.create({
        blocked_profile_id: pendingBlockParticipant.id,
      });

      if (!response.ok) {
        toast.error(response.message || "No se pudo bloquear al usuario");
        return;
      }

      toast.success("Usuario bloqueado correctamente");
      setBlockConfirmOpen(false);
      setPendingBlockParticipant(null);
      void queryClient.invalidateQueries({ queryKey: BLOCKS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ["chat-list"] });
      handleChange("chat_id", undefined);
    } catch {
      toast.error("No se pudo bloquear al usuario");
    } finally {
      setIsBlockSubmitting(false);
    }
  };

  const handleUnblock = async (participant: ChatParticipantSummary) => {
    try {
      const response = await blocksService.remove(participant.id);
      if (!response.ok) {
        toast.error(response.message || "No se pudo desbloquear al usuario");
        return;
      }

      toast.success("Usuario desbloqueado correctamente");
      void queryClient.invalidateQueries({ queryKey: BLOCKS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ["chat-list"] });
    } catch {
      toast.error("No se pudo desbloquear al usuario");
    }
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
      <header className="flex flex-col gap-3 border-b pb-3">
        <div className="flex items-center gap-3">
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
              {selectedChat?.ticket
                ? "S"
                : (selectedChat?.other_participants[0]?.name?.charAt(0) ?? "?")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold">{headerTitle}</h2>
            {presenceLabel ? (
              <p className="text-xs text-muted-foreground">{presenceLabel}</p>
            ) : null}
          </div>

          {canManageBlocks ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Opciones de la conversación"
                  >
                    <MoreVertical className="size-4" aria-hidden />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                {selectedChat?.other_participants.map((participant) => {
                  const isBlocked = blockedProfileIds.has(participant.id);
                  const name = getParticipantDisplayName(participant);

                  return (
                    <DropdownMenuItem
                      key={participant.id}
                      variant={isBlocked ? "default" : "destructive"}
                      onClick={() => {
                        if (isBlocked) {
                          void handleUnblock(participant);
                          return;
                        }
                        handleRequestBlock(participant);
                      }}
                    >
                      <Ban className="size-4" aria-hidden />
                      {isBlocked
                        ? `Desbloquear a ${name}`
                        : `Bloquear a ${name}`}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
        {selectedChat?.ticket ? (
          <ChatTicketStatusPanel ticket={selectedChat.ticket} />
        ) : null}
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
              onReport={
                message.sender_id === user?.id
                  ? undefined
                  : handleReportMessage
              }
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

      {reportTarget ? (
        <ReportDialog
          open
          onOpenChange={(open) => {
            if (!open) {
              setReportTarget(null);
            }
          }}
          target={reportTarget}
        />
      ) : null}

      <CustomAlertDialog
        open={blockConfirmOpen}
        onOpenChange={(open) => {
          setBlockConfirmOpen(open);
          if (!open) {
            setPendingBlockParticipant(null);
          }
        }}
        title="¿Bloquear a este usuario?"
        description={
          pendingBlockParticipant
            ? `Dejarás de ver los chats con ${getParticipantDisplayName(pendingBlockParticipant)} y no podréis enviaros mensajes.`
            : undefined
        }
        confirmText="Bloquear"
        cancelText="Cancelar"
        isConfirming={isBlockSubmitting}
        onConfirm={handleConfirmBlock}
      />
    </div>
  );
};
