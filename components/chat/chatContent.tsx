"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Ban, MessageSquare, MoreVertical } from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { MessageBubble } from "@/components/chat/components/messageBubble";
import {
  MessagesContainer,
  type MessagesContainerHandle,
} from "@/components/chat/components/messagesContainer";
import { ChatMessageComposer } from "@/components/chat/chatMessageComposer";
import { ChatTicketStatusPanel } from "@/components/chat/ChatTicketStatusPanel";
import { useChatSocket } from "@/components/chat/context/chatSocketContext";
import { useChatFilters } from "@/components/chat/hooks/useChatFilters";
import { formatParticipantNames } from "@/components/chat/utils/formatParticipantNames";
import { ReportDialog } from "@/components/reports/ReportDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CustomAlertDialog from "@/components/ui/customAlertDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { MessageScrollerItem } from "@/components/ui/message-scroller";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  ChatListItem,
  ChatMessageListItem,
  ChatParticipantSummary,
} from "@/interfaces/chat.interface";
import {
  REPORT_TARGET_TYPE,
  type ReportTarget,
} from "@/interfaces/report.interface";
import { BLOCKS_QUERY_KEY, blocksService } from "@/services/blocksService";
import { chatService, unwrapChatResponse } from "@/services/chatService";

const getParticipantDisplayName = (
  participant: ChatParticipantSummary,
): string => formatParticipantNames([participant]);

export const ChatContent = () => {
  const { user } = useUser();
  const { chatId, handleChange } = useChatFilters();
  const queryClient = useQueryClient();
  const messagesContainerRef = useRef<MessagesContainerHandle>(null);
  const markedReadRef = useRef<string | null>(null);
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
        throw new Error(
          response.message || "No se pudieron cargar los bloqueos",
        );
      }
      return response.data ?? [];
    },
  });

  const blockedProfileIds = useMemo(
    () => new Set((blocksData ?? []).map((block) => block.blocked_profile_id)),
    [blocksData],
  );

  const selectedChat: ChatListItem | undefined = useMemo(
    () => chatListData?.data.find((chat) => chat.id === chatId),
    [chatListData, chatId],
  );

  const otherParticipantIds = useMemo(
    () =>
      selectedChat?.other_participants.map((participant) => participant.id) ??
      [],
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
    messagesContainerRef.current?.scrollToEnd({ behavior: "smooth" });
    void markMessagesRead();
  }, [markMessagesRead]);

  const typingUserIds = useMemo(() => {
    if (!chatId) return [];
    const set = typingByChatId[chatId];
    if (!set) return [];
    return Array.from(set).filter((id) => id !== user?.id);
  }, [typingByChatId, chatId, user?.id]);

  const typingLabel = useMemo(() => {
    if (typingUserIds.length === 0) return null;
    const names = typingUserIds
      .map((id) => {
        const participant = selectedChat?.other_participants.find(
          (item) => item.id === id,
        );
        return participant ? getParticipantDisplayName(participant) : null;
      })
      .filter(Boolean);

    if (names.length === 0) return "Escribiendo…";
    if (names.length === 1) return `${names[0]} está escribiendo…`;
    return "Varias personas están escribiendo…";
  }, [selectedChat?.other_participants, typingUserIds]);

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

  const resolveSender = useCallback(
    (senderId: string): ChatParticipantSummary | null => {
      return (
        selectedChat?.other_participants.find((item) => item.id === senderId) ??
        null
      );
    },
    [selectedChat?.other_participants],
  );

  const resolveSenderName = useCallback(
    (senderId: string) => {
      const participant = resolveSender(senderId);
      if (participant) {
        return getParticipantDisplayName(participant);
      }
      return "usuario";
    },
    [resolveSender],
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
    <div className="flex h-[min(70vh,720px)] min-h-[60vh] w-full flex-col">
      <header className="flex shrink-0 flex-col gap-3 border-b pb-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={handleBackToList}
            aria-label="Volver a la lista de chats"
          >
            <ArrowLeft />
          </Button>
          <Avatar className="size-10">
            <AvatarImage
              src={selectedChat?.other_participants[0]?.avatar_url}
            />
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
                    <MoreVertical aria-hidden />
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
                      <Ban aria-hidden />
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

      <MessagesContainer ref={messagesContainerRef}>
        {isLoadingMessages ? (
          <MessageScrollerItem messageId="loading">
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={`msg-skel-${index}`}
                  className="h-12 w-2/3 rounded-xl"
                />
              ))}
            </div>
          </MessageScrollerItem>
        ) : messages.length === 0 ? (
          <MessageScrollerItem messageId="empty">
            <p className="text-center text-sm text-muted-foreground">
              Aún no hay mensajes. Envía el primero.
            </p>
          </MessageScrollerItem>
        ) : (
          messages.map((message, index) => {
            const isOwn = message.sender_id === user?.id;
            const isLast = index === messages.length - 1;

            return (
              <MessageScrollerItem
                key={message.id}
                messageId={message.id}
                scrollAnchor={isOwn && isLast}
              >
                <MessageBubble
                  message={message}
                  isOwn={isOwn}
                  sender={resolveSender(message.sender_id)}
                  currentUserAvatarUrl={user?.avatar_url}
                  currentUserName={user?.name}
                  onReport={isOwn ? undefined : handleReportMessage}
                />
              </MessageScrollerItem>
            );
          })
        )}

        {typingLabel ? (
          <MessageScrollerItem messageId="typing">
            <Marker role="status">
              <MarkerContent>{typingLabel}</MarkerContent>
            </Marker>
          </MessageScrollerItem>
        ) : null}
      </MessagesContainer>

      <div className="shrink-0 border-t pt-3">
        <ChatMessageComposer
          chatId={chatId}
          onMessageSent={handleMessageSent}
          onTypingStart={() => emitTypingStart(chatId)}
          onTypingStop={() => emitTypingStop(chatId)}
        />
      </div>

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
