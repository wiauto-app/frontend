"use client";

import { Flag } from "lucide-react";

import { MessageStatusIcon } from "@/components/chat/components/MessageStatusIcon";
import { formatMessageTime } from "@/components/chat/utils/formatMessageTime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message";
import {
  CHAT_MESSAGE_TYPE,
  type ChatMessageListItem,
  type ChatParticipantSummary,
} from "@/interfaces/chat.interface";

interface MessageBubbleProps {
  message: ChatMessageListItem;
  isOwn: boolean;
  sender?: ChatParticipantSummary | null;
  currentUserAvatarUrl?: string | null;
  currentUserName?: string | null;
  onReport?: (message: ChatMessageListItem) => void;
}

const getInitials = (name?: string | null): string => {
  const trimmed = name?.trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toUpperCase();
};

export const MessageBubble = ({
  message,
  isOwn,
  sender,
  currentUserAvatarUrl,
  currentUserName,
  onReport,
}: MessageBubbleProps) => {
  const align = isOwn ? "end" : "start";
  const bubbleVariant = isOwn ? "default" : "muted";

  const avatarUrl = isOwn
    ? (currentUserAvatarUrl ?? undefined)
    : sender?.avatar_url;
  const avatarName = isOwn
    ? (currentUserName ?? "Tú")
    : (sender?.name ?? "Usuario");
  const avatarAlt = isOwn ? "Tu avatar" : `Avatar de ${avatarName}`;

  const renderBody = () => {
    if (message.type === CHAT_MESSAGE_TYPE.TEXT) {
      return (
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      );
    }

    if (message.type === CHAT_MESSAGE_TYPE.IMAGE && message.media_url) {
      return (
        <a href={message.media_url} target="_blank" rel="noreferrer">
          <img
            src={message.media_url}
            alt={message.metadata?.caption ?? "Imagen del mensaje"}
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
          className="underline"
        >
          {message.metadata?.file_name ?? "Descargar archivo"}
        </a>
      );
    }

    return (
      <p className="text-muted-foreground">Adjunto no disponible</p>
    );
  };

  return (
    <Message align={align}>
      <MessageAvatar>
        <Avatar size="sm">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={avatarAlt} /> : null}
          <AvatarFallback>{getInitials(avatarName)}</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <Bubble variant={bubbleVariant} align={align}>
          <BubbleContent>{renderBody()}</BubbleContent>
        </Bubble>
        <MessageFooter className="gap-2 bg-black">
          {!isOwn && onReport ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Reportar mensaje"
              title="Reportar mensaje"
              onClick={() => onReport(message)}
            >
              <Flag />
            </Button>
          ) : null}
          {message.edited_at ? <span>editado</span> : null}
          <span>{formatMessageTime(message.created_at)}</span>
          {isOwn ? <MessageStatusIcon status={message.status} /> : null}
        </MessageFooter>
      </MessageContent>
    </Message>
  );
};
