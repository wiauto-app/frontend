"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AskClarifyingQuestionsOutput } from "./types/assistant-tool-outputs";
import { useAssistantChat } from "./assistantChatProvider";

interface AssistantClarifyingQuestionsProps {
  output: AskClarifyingQuestionsOutput;
}

export const AssistantClarifyingQuestions = ({
  output,
}: AssistantClarifyingQuestionsProps) => {
  const { sendMessage, ensureConversationId, status } = useAssistantChat();
  const [selectedByQuestion, setSelectedByQuestion] = useState<
    Record<string, string[]>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isBusy = status === "submitted" || status === "streaming";
  const hasSelection = Object.values(selectedByQuestion).some(
    (ids) => ids.length > 0,
  );

  const handleToggleOption = (
    questionId: string,
    optionId: string,
    multi: boolean,
  ) => {
    if (isSubmitted || isBusy) {
      return;
    }

    setSelectedByQuestion((prev) => {
      const current = prev[questionId] ?? [];

      if (multi) {
        const next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];

        return { ...prev, [questionId]: next };
      }

      return {
        ...prev,
        [questionId]: current.includes(optionId) ? [] : [optionId],
      };
    });
  };

  const handleContinue = async () => {
    if (!hasSelection || isSubmitted || isBusy) {
      return;
    }

    const answerLines: string[] = [];
    const structuredAnswers: Array<{
      question_id: string;
      option_ids: string[];
      labels: string[];
    }> = [];

    for (const question of output.questions) {
      const selectedIds = selectedByQuestion[question.id] ?? [];

      if (selectedIds.length === 0) {
        continue;
      }

      const labels = question.options
        .filter((option) => selectedIds.includes(option.id))
        .map((option) => option.label);

      answerLines.push(`${question.prompt}: ${labels.join(", ")}`);
      structuredAnswers.push({
        question_id: question.id,
        option_ids: selectedIds,
        labels,
      });
    }

    if (answerLines.length === 0) {
      return;
    }

    const messageText = [
      "Mis respuestas:",
      ...answerLines.map((line) => `- ${line}`),
      "",
      `\`\`\`json\n${JSON.stringify({ answers: structuredAnswers })}\n\`\`\``,
    ].join("\n");

    setIsSubmitted(true);
    await ensureConversationId();
    sendMessage({ text: messageText });
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-border bg-muted/30 p-4">
      {output.reason ? (
        <p className="text-sm text-muted-foreground">{output.reason}</p>
      ) : null}

      {output.questions.map((question) => {
        const selectedIds = selectedByQuestion[question.id] ?? [];

        return (
          <fieldset key={question.id} className="flex flex-col gap-2" disabled={isSubmitted || isBusy}>
            <legend className="text-sm font-medium text-foreground">
              {question.prompt}
              {question.multi ? (
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  (puedes elegir varias)
                </span>
              ) : null}
            </legend>
            <div className="flex flex-wrap gap-2" role="group" aria-label={question.prompt}>
              {question.options.map((option) => {
                const isSelected = selectedIds.includes(option.id);

                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={option.label}
                    disabled={isSubmitted || isBusy}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted",
                      (isSubmitted || isBusy) && "cursor-not-allowed opacity-60",
                    )}
                    onClick={() =>
                      handleToggleOption(question.id, option.id, question.multi)
                    }
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}

      <div className="flex justify-end">
        <Button
          type="button"
          disabled={!hasSelection || isSubmitted || isBusy}
          aria-label="Continuar con las respuestas seleccionadas"
          onClick={() => {
            void handleContinue();
          }}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
