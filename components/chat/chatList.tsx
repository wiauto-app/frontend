"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquareText } from "lucide-react";

import { useChatFilters } from "@/components/chat/hooks/useChatFilters";
import { formatListMessageTime } from "@/components/chat/utils/formatMessageTime";
import { formatParticipantNames } from "@/components/chat/utils/formatParticipantNames";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { chatService, unwrapChatResponse } from "@/services/chatService";

export const ChatList = () => {
  const { chatId: selectedChatId, search, handleChange } = useChatFilters();

  const { data, isLoading } = useQuery({
    queryKey: ["chat-list", search],
    queryFn: async () =>
      unwrapChatResponse(
        await chatService.findAll({
          page: 1,
          limit: 30,
          search,
          order_by: "updated_at",
          order_direction: "DESC",
        }),
      ),
  });

  const chats = useMemo(() => data?.data ?? [], [data]);

  const handleSelectChat = (chatId: string) => {
    handleChange("chat_id", chatId);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`chat-skeleton-${index}`}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center">
        <MessageSquareText className="size-5 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">
          No hay chats disponibles{search ? " para esta búsqueda." : "."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto">
      {chats.map((chat) => {
        const title = formatParticipantNames(chat.other_participants);
        const subtitle =
          chat.last_message_preview?.trim() ||
          chat.other_participants[0]?.email?.trim() ||
          "Sin mensajes";
        const timeLabel = formatListMessageTime(chat.last_message_at);
        const hasUnread = chat.unread_count > 0;

        return (
          <button
            key={chat.id}
            type="button"
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors",
              selectedChatId === chat.id
                ? "border-primary bg-primary/5"
                : "hover:bg-muted/50",
              hasUnread &&
                selectedChatId !== chat.id &&
                "border-primary/30 bg-primary/5",
            )}
            onClick={() => handleSelectChat(chat.id)}
            aria-label={`Abrir chat con ${title}`}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <AvatarGroup>
                {chat.other_participants.map((participant) => (
                  <Avatar key={participant.id}>
                    <AvatarImage src={participant.avatar_url} />
                    <AvatarFallback>
                      {participant.name?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      "truncate text-sm",
                      hasUnread ? "font-semibold" : "font-medium",
                    )}
                  >
                    {title}
                  </p>
                  {timeLabel ? (
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {timeLabel}
                    </span>
                  ) : null}
                </div>
                <p
                  className={cn(
                    "truncate text-xs",
                    hasUnread ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {subtitle}
                </p>
              </div>
            </div>
            {hasUnread ? (
              <span
                className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground"
                aria-label={`${chat.unread_count} sin leer`}
              >
                {chat.unread_count > 9 ? "9+" : chat.unread_count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};
