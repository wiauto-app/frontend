"use client";

import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { MicIcon } from "lucide-react";
import { useAssistantChat } from "./assistantChatProvider";

export const AssistantInput = () => {
  const { sendMessage, status, stop, ensureConversationId } = useAssistantChat();

  const handleSubmit = async ({ text }: PromptInputMessage) => {
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    await ensureConversationId();
    sendMessage({ text: trimmed });
  };

  return (
    <PromptInput className="" onSubmit={handleSubmit}>
      <PromptInputBody>
        <PromptInputTextarea placeholder="Describe el coche que buscas..." />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputButton
            disabled
            tooltip={{ content: "Entrada por voz", side: "top" }}
          >
            <MicIcon className="text-primary size-6" />
          </PromptInputButton>
        </PromptInputTools>
        <PromptInputSubmit onStop={stop} status={status} />
      </PromptInputFooter>
    </PromptInput>
  );
};
