"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Bot,
  ChevronUp,
  LoaderCircle,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useUser } from "@/app/contexts/auth/useUser";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AssistantMessages } from "./assistantMessages";
import { useAssistantChat } from "./assistantChatProvider";
import { useAssistantSuggestions } from "./hooks/useAssistantSuggestions";
import { useCardOpenStatusStore } from "./stores/cardOpenStatusStore";
import { resolveAssistantPageRoute } from "./utils/assistantPageContext";

const gradientClasses = "bg-linear-to-r from-purple to-primary-soft";
const RENDER_DELAY_MS = 700;
const SECTION_COPY = {
  "/": "Pregúntame cómo aprovechar WiAuto",
  "/vehiculos": "Te ayudo a encontrar y comparar coches",
  "/concesionarias": "Encuentra la concesionaria adecuada",
  "/noticias": "Descubre lo más relevante del motor",
} as const;

export const AssistantDialog = () => {
  const pathname = usePathname();
  const route = resolveAssistantPageRoute(pathname);
  const { isOpen, setIsOpen } = useCardOpenStatusStore();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useUser();
  const {
    messages,
    sendMessage,
    ensureConversationId,
    conversationId,
    status,
    quota,
    isQuotaLoading,
  } = useAssistantChat();
  const { data, isLoading: areSuggestionsLoading } =
    useAssistantSuggestions(route);
  const [isReady, setIsReady] = useState(false);
  const [input, setInput] = useState("");

  const isBusy = status === "submitted" || status === "streaming";
  const hasNoQuota =
    !isQuotaLoading && isAuthenticated && (quota?.totalRemaining ?? 0) <= 0;
  const fullChatHref = conversationId
    ? `/asistente/chat/${conversationId}`
    : "/asistente/chat";
  const suggestions = data?.suggestions ?? [];
  const subtitle = useMemo(() => SECTION_COPY[route], [route]);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setIsReady(true),
      RENDER_DELAY_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, []);

  const submitPrompt = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed || isBusy || hasNoQuota || !isAuthenticated) return;
    await ensureConversationId();
    await sendMessage({ text: trimmed });
    setInput("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitPrompt(input);
  };

  if (!isReady || pathname.startsWith("/asistente")) return null;

  if (!isOpen) {
    return (
      <>
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir asistente IA"
          aria-controls="assistant-dialog-card"
          className={cn(
            "fixed right-3 bottom-20 z-40 size-15 rounded-full shadow-lg md:hidden",
            gradientClasses,
          )}
        >
          <MessageCircle className="size-7" />
        </Button>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed right-4 bottom-4 z-40 hidden w-80 items-center justify-between rounded-2xl px-4 py-3 text-left shadow-xl transition hover:-translate-y-0.5 md:flex",
            gradientClasses,
          )}
          aria-label="Abrir asistente IA"
          aria-controls="assistant-dialog-card"
        >
          <span>
            <span className="block text-sm font-semibold text-white">
              WiAuto AI
            </span>
            <span className="block text-xs text-white/85">{subtitle}</span>
          </span>
          <ChevronUp className="size-5 text-white" />
        </button>
      </>
    );
  }

  return (
    <Card
      id="assistant-dialog-card"
      role="dialog"
      aria-label="Asistente WiAuto AI"
      className={
        cn(
          "fixed right-3 bottom-19 z-40 flex w-[calc(100%-1.5rem)] max-w-md flex-col overflow-hidden border bg-background p-0 shadow-2xl md:right-4 md:bottom-4 md:border-none",
          isAuthenticated && "h-[min(76dvh,42rem)]  md:h-[min(72dvh,42rem)] "
        )
      }
    >
      <CardHeader
        className={cn(
          "flex shrink-0 flex-row items-center justify-between px-4 py-3",
          gradientClasses,
        )}
      >
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-white/15 text-white">
            <Bot className="size-5" />
          </span>
          <div>
            <p className="font-semibold text-white">WiAuto AI</p>
            <p className="text-xs text-white/85">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            nativeButton={false}
            render={
              <Link href={fullChatHref} aria-label="Abrir el chat completo" />
            }
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/15 hover:text-white"
          >
            <ArrowUpRight className="size-4" />
          </Button>
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/15 hover:text-white"
            aria-label="Cerrar asistente"
          >
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-3">
        {!isAuthenticated && !isAuthLoading ? (
          <div className="mt-auto rounded-xl border border-primary/15 bg-primary/5 p-3 text-sm">
            <p className="font-medium">
              Inicia sesión para conversar con WiAuto AI.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/asistente/chat" />}
              size="sm"
              className={cn("mt-2 w-full", gradientClasses)}
            >
              Iniciar conversación
            </Button>
          </div>
        ) : (
          <>
            {messages.length > 0 && isAuthenticated ? (
              <AssistantMessages />
            ) : (
              <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-1">
                <div className="rounded-2xl rounded-tl-sm bg-muted p-3 text-sm leading-relaxed">
                  <p className="font-semibold">
                    Hola{user?.name ? `, ${user.name}` : ""} 👋
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {subtitle}. Puedes empezar con una de estas ideas:
                  </p>
                </div>
                <div className="grid gap-2">
                  {areSuggestionsLoading ? (
                    <div className="flex items-center gap-2 px-2 py-4 text-sm text-muted-foreground">
                      <LoaderCircle className="size-4 animate-spin" />{" "}
                      Preparando sugerencias…
                    </div>
                  ) : (
                    suggestions.map((suggestion) => (
                      <Button
                        key={suggestion.prompt}
                        type="button"
                        variant="outline"
                        disabled={isBusy || hasNoQuota || isAuthLoading}
                        onClick={() => void submitPrompt(suggestion.prompt)}
                        className="h-auto justify-start gap-2 whitespace-normal rounded-xl px-3 py-2.5 text-left text-xs"
                      >
                        <Sparkles className="size-4 shrink-0 text-primary" />
                        {suggestion.label}
                      </Button>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      {isAuthenticated ? (
        <CardFooter className="shrink-0 border-t p-3">
          {hasNoQuota ? (
            <Button
              nativeButton={false}
              render={<Link href={fullChatHref} />}
              className="w-full"
              variant="outline"
            >
              Obtener más consultas
            </Button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-full items-end gap-2 rounded-2xl border bg-muted/40 p-2 focus-within:ring-2 focus-within:ring-primary/20"
            >
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                disabled={isBusy}
                rows={1}
                aria-label="Mensaje para WiAuto AI"
                placeholder="Escribe tu pregunta…"
                className="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isBusy}
                className="shrink-0 rounded-xl"
              >
                {isBusy ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </form>
          )}
        </CardFooter>
      ) : null}
    </Card>
  );
};
