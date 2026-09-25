import type { ChatMessageMetadata } from "@/interfaces/chat.interface";

export const CHAT_AI_ASSISTANT_AUTHOR = "ai_assistant" as const;

export const isAiAssistantChatMessage = (
  metadata: ChatMessageMetadata | null | undefined,
): boolean => metadata?.author === CHAT_AI_ASSISTANT_AUTHOR;
