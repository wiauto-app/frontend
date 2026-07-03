"use client";

import { Suggestion } from "@/components/ai-elements/suggestion";
import Link from "next/link";
import {
  ASSISTANT_QUICK_LINKS,
  ASSISTANT_STARTER_IDEAS,
  ASSISTANT_TRENDING_SEARCHES,
} from "./constants/assistantSuggestions.constants";
import { useAssistantChat } from "./assistantChatProvider";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useUser } from "@/app/contexts/auth/useUser";
import { ChartColumnIncreasing, FastForward, ShoppingCart } from "lucide-react";
import { IconContainer } from "../ui/iconContainer";
import { Button } from "../ui/button";

export const AssistantSuggestions = () => {
  const {
    sendMessage,
    status,
    ensureConversationId,
    openPurchaseDialog,
  } = useAssistantChat();
  const { user } = useUser();
  const isBusy = status === "submitted" || status === "streaming";

  const handleSuggestionClick = async (prompt: string) => {
    if (isBusy) {
      return;
    }

    await ensureConversationId();
    sendMessage({ text: prompt });
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto p-1 sm:gap-4 sm:p-2">
      <Card size="sm" className="relative min-h-36 overflow-hidden sm:min-h-40">
        <CardHeader className="relative z-10 gap-1">
          <CardTitle className="text-base font-semibold text-white sm:text-lg">
            {!user?.name ? "Hola!" : `Hola ${user.name}!`} 👋
          </CardTitle>
          <CardDescription className="text-xs text-white/90 sm:text-sm sr-only 2xl:not-sr-only ">
            Prueba una búsqueda en lenguaje natural
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pt-0">
          <div className="grid w-full grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2">
            {ASSISTANT_STARTER_IDEAS.map((item) => (
              <Suggestion
                key={item.prompt}
                suggestion={item.prompt}
                onClick={() => handleSuggestionClick(item.prompt)}
                disabled={isBusy}
                Icon={item.icon}
                className="bg-white/95 text-xs  sm:text-sm"
                iconClassName="size-4 sm:size-5"
              >
                {item.label}
              </Suggestion>
            ))}
          </div>
        </CardContent>
        <Image
          fill
          src="/chat/suggestion.png"
          alt=""
          className="object-cover"
          priority
        />
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <ChartColumnIncreasing className="size-4 text-primary sm:size-5" />
            Tendencias
          </CardTitle>
          <CardDescription className="sr-only">
            Búsquedas populares en WiAuto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 gap-1.5 @sm/panel:grid-cols-2 sm:gap-2">
            {ASSISTANT_TRENDING_SEARCHES.map((item) => (
              <li key={item.prompt}>
                <Suggestion
                  suggestion={item.prompt}
                  description={item.description}
                  onClick={() => handleSuggestionClick(item.prompt)}
                  disabled={isBusy}
                  className="border py-2.5 text-xs sm:py-3 sm:text-sm"
                >
                  {item.label}
                </Suggestion>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader >
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <FastForward className="size-4 text-primary sm:size-5" />
            Accesos rápidos
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ul className="grid grid-cols-1 gap-1.5 @sm/panel:grid-cols-2 sm:gap-2">
            {ASSISTANT_QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 rounded-lg border px-2.5 py-2.5 text-xs font-medium text-slate-900 transition-colors hover:bg-muted sm:gap-3 sm:px-3 sm:py-3 sm:text-sm"
                >
                  {link.Icon && <IconContainer Icon={link.Icon} size="sm" />}
                  <div className="min-w-0">
                    <h3 className="truncate text-xs font-bold sm:text-sm">
                      {link.label}
                    </h3>
                    <p className="line-clamp-2 text-[10px] text-muted-foreground sm:text-xs">
                      {link.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card size="sm" className="relative flex min-h-26 justify-center overflow-hidden sm:min-h-44">
        <CardContent className="relative z-10 flex flex-col gap-1 py-3 sm:gap-2 sm:py-4">
          <CardTitle className="text-sm sm:text-base">
            ¿Quieres aumentar el uso de tu asistente?
          </CardTitle>
          <CardDescription className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
            Conoce nuestras opciones de uso y descubre cómo puedes obtener más
            para tu asistente.
          </CardDescription>
          <Button
            className="mt-2 h-8 w-fit text-xs sm:mt-3 sm:h-9 sm:text-sm"
            onClick={openPurchaseDialog}
            type="button"
          >
            <ShoppingCart className="size-3.5 sm:size-4" />
            Comprar consultas
          </Button>
        </CardContent>
        <Image
          fill
          src="/chat/more_tokens.png"
          alt=""
          className="object-cover object-bottom brightness-90"
        />
      </Card>
    </div>
  );
};
