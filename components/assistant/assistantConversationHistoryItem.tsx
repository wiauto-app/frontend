"use client";

import { SidebarInput } from "@/components/ui/sidebar";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
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
      <SidebarMenuItem>
        <SidebarInput
          aria-label="Editar nombre de conversación"
          autoFocus
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
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        onClick={() => onSelect(conversation.id)}
        onDoubleClick={() => setIsEditing(true)}
        tooltip={conversation.title}
        type="button"
      >
        <span className="truncate">{conversation.title}</span>
      </SidebarMenuButton>
      <SidebarMenuAction
        aria-label={`Eliminar conversación ${conversation.title}`}
        onClick={(event) => void handleDeleteClick(event)}
        showOnHover
        type="button"
      >
        <Trash2 />
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
};
