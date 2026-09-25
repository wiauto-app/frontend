"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AssistantConversationListItem } from "@/services/assistant/assistantConversationService";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface AssistantConversationHistoryItemProps {
  conversation: AssistantConversationListItem;
  isActive: boolean;
  onSelect: (conversationId: string) => void;
  onDelete: (conversationId: string) => Promise<void>;
  onRename: (conversationId: string, title: string) => Promise<void>;
}

export const AssistantConversationHistoryItem = ({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onRename,
}: AssistantConversationHistoryItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(conversation.title);

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(conversation.title);
    }
  }, [conversation.title, isEditing]);

  const handleCancelEdit = () => {
    setDraftTitle(conversation.title);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    const trimmedTitle = draftTitle.trim();

    if (!trimmedTitle || trimmedTitle === conversation.title) {
      handleCancelEdit();
      return;
    }

    await onRename(conversation.id, trimmedTitle);
    setIsEditing(false);
  };

  const handleDeleteClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    await onDelete(conversation.id);
  };

  if (isEditing) {
    return (
      <li className="px-1">
        <Input
          aria-label="Editar nombre de conversación"
          autoFocus
          className="h-8 text-sm"
          maxLength={120}
          onBlur={() => {
            void handleSaveEdit();
          }}
          onChange={(event) => setDraftTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleSaveEdit();
            }

            if (event.key === "Escape") {
              event.preventDefault();
              handleCancelEdit();
            }
          }}
          value={draftTitle}
        />
      </li>
    );
  }

  return (
    <li className="group relative">
      <button
        aria-current={isActive ? "true" : undefined}
        className={cn(
          "flex w-full items-center rounded-md px-2 py-1.5 pr-8 text-left text-sm transition-colors",
          isActive
            ? "bg-primary/10 font-medium text-primary"
            : "text-slate-700 hover:bg-muted",
        )}
        onClick={() => onSelect(conversation.id)}
        onDoubleClick={() => setIsEditing(true)}
        title={conversation.title}
        type="button"
      >
        <span className="truncate">{conversation.title}</span>
      </button>
      <Button
        aria-label={`Eliminar conversación ${conversation.title}`}
        className="absolute top-1/2 right-1 size-7 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        onClick={(event) => void handleDeleteClick(event)}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <Trash2 className="size-3.5" />
      </Button>
    </li>
  );
};
