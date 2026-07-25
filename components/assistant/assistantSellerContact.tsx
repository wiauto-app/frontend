"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Copy, Mail, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type {
  PrepareSellerContactOutput,
  SellerContactChannel,
} from "./types/assistant-tool-outputs";

interface AssistantSellerContactProps {
  output: PrepareSellerContactOutput;
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);

const formatMileage = (mileage: number): string =>
  `${new Intl.NumberFormat("es-ES").format(mileage)} km`;

const buildComposedMessage = (
  baseMessage: string,
  questions: string[],
  selectedIndexes: number[],
): string => {
  const selectedQuestions = selectedIndexes
    .slice()
    .sort((a, b) => a - b)
    .map((index) => questions[index])
    .filter(Boolean);

  if (selectedQuestions.length === 0) {
    return baseMessage;
  }

  return `${baseMessage}\n\n${selectedQuestions.map((question) => `- ${question}`).join("\n")}`;
};

const buildWhatsAppHref = (
  channel: SellerContactChannel,
  composedMessage: string,
): string | undefined => {
  const digits = channel.value.replace(/\D/g, "");
  if (digits) {
    return `https://wa.me/${digits}?text=${encodeURIComponent(composedMessage)}`;
  }

  if (channel.href?.includes("wa.me") || channel.href?.includes("whatsapp")) {
    try {
      const url = new URL(channel.href);
      url.searchParams.set("text", composedMessage);
      return url.toString();
    } catch {
      return channel.href;
    }
  }

  return channel.href;
};

const buildPhoneHref = (channel: SellerContactChannel): string | undefined => {
  if (channel.href?.startsWith("tel:")) {
    return channel.href;
  }

  const digits = channel.value.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : channel.href;
};

const buildEmailHref = (
  channel: SellerContactChannel,
  composedMessage: string,
  vehicleTitle: string,
): string | undefined => {
  const email = channel.value.includes("@")
    ? channel.value
    : channel.href?.replace(/^mailto:/, "").split("?")[0];

  if (!email) {
    return channel.href;
  }

  const subject = encodeURIComponent(`Interés en ${vehicleTitle}`);
  const body = encodeURIComponent(composedMessage);
  return `mailto:${email}?subject=${subject}&body=${body}`;
};

export const AssistantSellerContact = ({
  output,
}: AssistantSellerContactProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedQuestionIndexes, setSelectedQuestionIndexes] = useState<
    number[]
  >([]);

  const composedMessage = buildComposedMessage(
    output.suggested_message,
    output.recommended_questions,
    selectedQuestionIndexes,
  );

  const summary = output.vehicle_summary;
  const summaryLine = [
    summary.title,
    formatPrice(summary.price),
    formatMileage(summary.mileage),
    summary.year != null ? String(summary.year) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const handleToggleQuestion = (index: number) => {
    setSelectedQuestionIndexes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((item) => item !== index);
      }

      return [...prev, index];
    });
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(composedMessage);
      setCopied(true);
      toast.success("Mensaje copiado");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar el mensaje");
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-border bg-muted/20 p-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium">Contactar al vendedor</h3>
        <p className="text-sm text-muted-foreground">{summaryLine}</p>
      </div>

      {output.recommended_questions.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium">Preguntas recomendadas</h4>
          <p className="text-xs text-muted-foreground">
            Marca las que quieras añadir al mensaje.
          </p>
          <ul className="flex flex-col gap-2">
            {output.recommended_questions.map((question, index) => {
              const isChecked = selectedQuestionIndexes.includes(index);

              return (
                <li key={`${question}-${index}`}>
                  <label
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-lg border border-border/70 bg-background px-3 py-2 text-sm",
                      isChecked && "border-primary/50 bg-primary/5",
                    )}
                  >
                    <Checkbox
                      checked={isChecked}
                      className="mt-0.5"
                      aria-label={`Incluir pregunta: ${question}`}
                      onCheckedChange={() => {
                        handleToggleQuestion(index);
                      }}
                    />
                    <span>{question}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-2 rounded-lg border border-border bg-background p-3">
        <p className="whitespace-pre-wrap text-sm">{composedMessage}</p>
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          aria-label="Copiar mensaje compuesto"
          onClick={() => {
            void handleCopyMessage();
          }}
        >
          {copied ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {output.channels.map((channel, index) => {
          const key = `${channel.type}-${index}`;

          if (channel.type === "whatsapp") {
            const href = buildWhatsAppHref(channel, composedMessage);

            if (!href) {
              return null;
            }

            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={channel.label || "Abrir WhatsApp"}
                className={cn(buttonVariants(), "gap-1.5")}
              >
                <MessageCircle className="size-4" aria-hidden />
                {channel.label || "WhatsApp"}
              </a>
            );
          }

          if (channel.type === "phone") {
            const href = buildPhoneHref(channel);

            if (!href) {
              return null;
            }

            return (
              <a
                key={key}
                href={href}
                aria-label={channel.label || "Llamar al vendedor"}
                className={cn(buttonVariants({ variant: "outline" }), "gap-1.5")}
              >
                <Phone className="size-4" aria-hidden />
                {channel.label || "Llamar"}
              </a>
            );
          }

          if (channel.type === "email") {
            const href = buildEmailHref(
              channel,
              composedMessage,
              summary.title,
            );

            if (!href) {
              return null;
            }

            return (
              <a
                key={key}
                href={href}
                aria-label={channel.label || "Enviar email"}
                className={cn(buttonVariants({ variant: "secondary" }), "gap-1.5")}
              >
                <Mail className="size-4" aria-hidden />
                {channel.label || "Email"}
              </a>
            );
          }

          if (channel.href) {
            return (
              <a
                key={key}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={channel.label}
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                {channel.label}
              </a>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
