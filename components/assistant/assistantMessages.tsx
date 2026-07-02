"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Spinner } from "@/components/ui/spinner";
import { getToolName, isToolUIPart } from "ai";
import { BotIcon } from "lucide-react";
import { useMemo } from "react";
import { AssistantVehicleResults } from "./assistantVehicleResults";
import { useAssistantChat } from "./assistantChatProvider";
import { isSearchVehiclesOutput } from "./utils/extractLatestSearchVehicles";

const renderSearchVehiclesPart = (
  part: Extract<Parameters<typeof isToolUIPart>[0], { state: string }>,
  key: string,
) => {
  if (part.state === "output-error") {
    return (
      <p className="text-sm text-destructive" key={key}>
        {"errorText" in part && typeof part.errorText === "string"
          ? part.errorText
          : "No se pudo completar la búsqueda de vehículos."}
      </p>
    );
  }

  if (
    part.state === "output-available" &&
    "output" in part &&
    isSearchVehiclesOutput(part.output)
  ) {
    return (
      <AssistantVehicleResults
        key={key}
        total={part.output.total}
        vehicles={part.output.vehicles}
      />
    );
  }

  return (
    <div
      className="flex items-center gap-2 text-sm text-muted-foreground"
      key={key}
    >
      <Spinner className="size-4" />
      <span>Buscando vehículos...</span>
    </div>
  );
};

const getSearchVehiclesToolCallId = (
  part: Extract<Parameters<typeof isToolUIPart>[0], { state: string }>,
): string | undefined => {
  if ("toolCallId" in part && typeof part.toolCallId === "string") {
    return part.toolCallId;
  }

  return undefined;
};

interface AssistantPendingIndicatorProps {
  label: string;
}

const AssistantPendingIndicator = ({ label }: AssistantPendingIndicatorProps) => (
  <Message from="assistant">
    <MessageContent>
      <div
        aria-live="polite"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Spinner className="size-4" />
        <span>{label}</span>
      </div>
    </MessageContent>
  </Message>
);

const hasAssistantVisibleContent = (
  message: ReturnType<typeof useAssistantChat>["messages"][number],
): boolean => {
  return message.parts.some((part) => {
    if (part.type === "text" && part.text.trim().length > 0) {
      return true;
    }

    if (isToolUIPart(part) && getToolName(part) === "searchVehicles") {
      return true;
    }

    return false;
  });
};

export const AssistantMessages = () => {
  const { messages, isConversationLoading, status } = useAssistantChat();

  const pendingLabel = useMemo(() => {
    if (status === "submitted") {
      return "Pensando...";
    }

    if (status === "streaming") {
      return "Generando respuesta...";
    }

    return null;
  }, [status]);

  const showPendingIndicator = useMemo(() => {
    if (status === "submitted") {
      return true;
    }

    if (status !== "streaming") {
      return false;
    }

    const lastMessage = messages.at(-1);

    if (!lastMessage || lastMessage.role !== "assistant") {
      return true;
    }

    return !hasAssistantVisibleContent(lastMessage);
  }, [messages, status]);

  if (isConversationLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-8">
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <Conversation className="min-h-0 flex-1">
      <ConversationContent className="gap-6 p-0">
        {messages.length === 0 ? (
          <ConversationEmptyState
            title="¿En qué puedo ayudarte?"
            description="Pregunta por marcas, presupuesto, combustible o ubicación y te mostraré anuncios de WiAuto."
            icon={<BotIcon className="size-10" />}
          />
        ) : (
          messages.map((message) => {
            const seenToolCallIds = new Set<string>();

            return (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <MessageResponse
                          isAnimating={part.state === "streaming"}
                          key={`${message.id}-text-${index}`}
                        >
                          {part.text}
                        </MessageResponse>
                      );
                    }

                    if (
                      isToolUIPart(part) &&
                      getToolName(part) === "searchVehicles"
                    ) {
                      const toolCallId = getSearchVehiclesToolCallId(part);

                      if (toolCallId) {
                        if (seenToolCallIds.has(toolCallId)) {
                          return null;
                        }

                        seenToolCallIds.add(toolCallId);
                      }

                      return renderSearchVehiclesPart(
                        part,
                        `${message.id}-tool-${toolCallId ?? index}`,
                      );
                    }

                    return null;
                  })}
                </MessageContent>
              </Message>
            );
          })
        )}

        {showPendingIndicator && pendingLabel && (
          <AssistantPendingIndicator label={pendingLabel} />
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
};
