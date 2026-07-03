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
import { Button } from "../ui/button";

export const AssistantInput = () => {
  const {
    sendMessage,
    status,
    stop,
    ensureConversationId,
    quota,
    isQuotaLoading,
    openPurchaseDialog,
  } = useAssistantChat();

  const hasNoQuota = !isQuotaLoading && (quota?.totalRemaining ?? 0) <= 0;
  const isBusy = status === "submitted" || status === "streaming";

  const handleSubmit = async ({ text }: PromptInputMessage) => {
    const trimmed = text.trim();

    if (!trimmed || hasNoQuota) {
      return;
    }

    await ensureConversationId();
    sendMessage({ text: trimmed });
  };

  return (
    <div className="space-y-2 w-full">
      {hasNoQuota ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <p>No tienes consultas disponibles.</p>
          <Button onClick={openPurchaseDialog} size="sm" type="button" variant="outline">
            Comprar consultas
          </Button>
        </div>
      ) : null}

      <PromptInput className="" onSubmit={handleSubmit}>
        <PromptInputBody>
          <PromptInputTextarea
            disabled={hasNoQuota || isBusy}
            placeholder={
              hasNoQuota
                ? "Compra consultas para seguir usando el asistente"
                : "Describe el coche que buscas..."
            }
          />
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
          <PromptInputSubmit
            disabled={hasNoQuota}
            onStop={stop}
            status={status}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
};
