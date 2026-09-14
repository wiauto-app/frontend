"use client";

import { useMemo, useState } from "react";
import { getToolName, isToolUIPart } from "ai";
import { BotIcon, Flag } from "lucide-react";

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
import { ReportDialog } from "@/components/reports/ReportDialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  REPORT_TARGET_TYPE,
  type ReportTarget,
} from "@/interfaces/report.interface";

import { AssistantAnalyzeListing } from "./assistantAnalyzeListing";
import { AssistantClarifyingQuestions } from "./assistantClarifyingQuestions";
import { AssistantCompareVehicles } from "./assistantCompareVehicles";
import { AssistantNegotiation } from "./assistantNegotiation";
import { AssistantSellerContact } from "./assistantSellerContact";
import { AssistantVehicleResults } from "./assistantVehicleResults";
import { useAssistantChat } from "./assistantChatProvider";
import {
  isAnalyzeListingOutput,
  isAskClarifyingQuestionsOutput,
  isCompareVehiclesOutput,
  isPrepareNegotiationOutput,
  isPrepareSellerContactOutput,
  isSearchVehiclesOutput,
} from "./types/assistant-tool-outputs";

type ToolUiPart = Extract<Parameters<typeof isToolUIPart>[0], { state: string }>;

const ASSISTANT_TOOL_NAMES = new Set([
  "askClarifyingQuestions",
  "searchVehicles",
  "compareVehicles",
  "analyzeListing",
  "prepareSellerContact",
  "prepareNegotiation",
]);

interface AssistantPendingIndicatorProps {
  label: string;
}

const AssistantPendingIndicator = ({
  label,
}: AssistantPendingIndicatorProps) => (
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

const getToolCallId = (part: ToolUiPart): string | undefined => {
  if ("toolCallId" in part && typeof part.toolCallId === "string") {
    return part.toolCallId;
  }

  return undefined;
};

const renderToolPending = (key: string, label: string) => (
  <div
    className="flex items-center gap-2 text-sm text-muted-foreground"
    key={key}
  >
    <Spinner className="size-4" />
    <span>{label}</span>
  </div>
);

const renderToolError = (part: ToolUiPart, key: string, fallback: string) => (
  <p className="text-sm text-destructive" key={key}>
    {"errorText" in part && typeof part.errorText === "string"
      ? part.errorText
      : fallback}
  </p>
);

const renderAskClarifyingQuestionsPart = (part: ToolUiPart, key: string) => {
  if (part.state === "output-error") {
    return renderToolError(
      part,
      key,
      "No se pudieron cargar las preguntas de aclaración.",
    );
  }

  if (
    part.state === "output-available" &&
    "output" in part &&
    isAskClarifyingQuestionsOutput(part.output)
  ) {
    return <AssistantClarifyingQuestions key={key} output={part.output} />;
  }

  return renderToolPending(key, "Preparando preguntas...");
};

const renderSearchVehiclesPart = (part: ToolUiPart, key: string) => {
  if (part.state === "output-error") {
    return renderToolError(
      part,
      key,
      "No se pudo completar la búsqueda de vehículos.",
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

  return renderToolPending(key, "Buscando vehículos...");
};

const renderCompareVehiclesPart = (part: ToolUiPart, key: string) => {
  if (part.state === "output-error") {
    return renderToolError(part, key, "No se pudo comparar los vehículos.");
  }

  if (
    part.state === "output-available" &&
    "output" in part &&
    isCompareVehiclesOutput(part.output)
  ) {
    return <AssistantCompareVehicles key={key} output={part.output} />;
  }

  return renderToolPending(key, "Comparando vehículos...");
};

const renderAnalyzeListingPart = (part: ToolUiPart, key: string) => {
  if (part.state === "output-error") {
    return renderToolError(part, key, "No se pudo analizar el anuncio.");
  }

  if (
    part.state === "output-available" &&
    "output" in part &&
    isAnalyzeListingOutput(part.output)
  ) {
    return <AssistantAnalyzeListing key={key} output={part.output} />;
  }

  return renderToolPending(key, "Analizando anuncio...");
};

const renderPrepareSellerContactPart = (part: ToolUiPart, key: string) => {
  if (part.state === "output-error") {
    return renderToolError(
      part,
      key,
      "No se pudo preparar el contacto con el vendedor.",
    );
  }

  if (
    part.state === "output-available" &&
    "output" in part &&
    isPrepareSellerContactOutput(part.output)
  ) {
    return <AssistantSellerContact key={key} output={part.output} />;
  }

  return renderToolPending(key, "Preparando contacto...");
};

const renderPrepareNegotiationPart = (part: ToolUiPart, key: string) => {
  if (part.state === "output-error") {
    return renderToolError(
      part,
      key,
      "No se pudo preparar la negociación.",
    );
  }

  if (
    part.state === "output-available" &&
    "output" in part &&
    isPrepareNegotiationOutput(part.output)
  ) {
    return <AssistantNegotiation key={key} output={part.output} />;
  }

  return renderToolPending(key, "Preparando negociación...");
};

const renderAssistantToolPart = (part: ToolUiPart, key: string) => {
  const toolName = getToolName(part);

  switch (toolName) {
    case "askClarifyingQuestions":
      return renderAskClarifyingQuestionsPart(part, key);
    case "searchVehicles":
      return renderSearchVehiclesPart(part, key);
    case "compareVehicles":
      return renderCompareVehiclesPart(part, key);
    case "analyzeListing":
      return renderAnalyzeListingPart(part, key);
    case "prepareSellerContact":
      return renderPrepareSellerContactPart(part, key);
    case "prepareNegotiation":
      return renderPrepareNegotiationPart(part, key);
    default:
      return null;
  }
};

const hasAssistantVisibleContent = (
  message: ReturnType<typeof useAssistantChat>["messages"][number],
): boolean => {
  return message.parts.some((part) => {
    if (part.type === "text" && part.text.trim().length > 0) {
      return true;
    }

    if (isToolUIPart(part) && ASSISTANT_TOOL_NAMES.has(getToolName(part))) {
      return true;
    }

    return false;
  });
};

export const AssistantMessages = () => {
  const { messages, isConversationLoading, status, conversationId } =
    useAssistantChat();
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);

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

  const streamingAssistantMessageId = useMemo(() => {
    if (status !== "streaming" && status !== "submitted") {
      return null;
    }

    const lastMessage = messages.at(-1);
    if (!lastMessage || lastMessage.role !== "assistant") {
      return null;
    }

    return lastMessage.id;
  }, [messages, status]);

  const handleReportAssistantMessage = (messageId: string) => {
    if (!conversationId) {
      return;
    }

    setReportTarget({
      targetType: REPORT_TARGET_TYPE.ASSISTANT_MESSAGE,
      targetId: conversationId,
      targetName: "respuesta del asistente",
      targetAssistantMessageId: messageId,
    });
  };

  if (isConversationLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-8">
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <>
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
              const canReportAssistantMessage =
                message.role === "assistant" &&
                Boolean(conversationId) &&
                hasAssistantVisibleContent(message) &&
                message.id !== streamingAssistantMessageId;

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

                      if (!isToolUIPart(part)) {
                        return null;
                      }

                      const toolName = getToolName(part);

                      if (!ASSISTANT_TOOL_NAMES.has(toolName)) {
                        return null;
                      }

                      const toolCallId = getToolCallId(part);

                      if (toolCallId) {
                        if (seenToolCallIds.has(toolCallId)) {
                          return null;
                        }

                        seenToolCallIds.add(toolCallId);
                      }

                      return renderAssistantToolPart(
                        part,
                        `${message.id}-tool-${toolName}-${toolCallId ?? index}`,
                      );
                    })}

                    {canReportAssistantMessage ? (
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto px-0 text-xs text-muted-foreground"
                          aria-label="Reportar respuesta del asistente"
                          onClick={() => {
                            handleReportAssistantMessage(message.id);
                          }}
                        >
                          <Flag className="mr-1.5 size-3.5" aria-hidden />
                          Reportar respuesta
                        </Button>
                      </div>
                    ) : null}
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
    </>
  );
};
