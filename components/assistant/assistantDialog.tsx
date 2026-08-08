"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Car,
  ChevronUp,
  CreditCard,
  MessageCircle,
  Search,
  X,
  Zap,
} from "lucide-react";

import { useUser } from "@/app/contexts/auth/useUser";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { useCardOpenStatusStore } from "./stores/cardOpenStatusStore";

const ASSISTANT_OPTIONS = [
  {
    label: "Buscar vehículos según mis preferencias",
    icon: Search,
  },
  {
    label: "Comparar modelos",
    icon: Car,
  },
  {
    label: "Opciones de financiación",
    icon: CreditCard,
  },
] as const;

const gradientClasses = "bg-linear-to-r from-purple to-primary-soft";
const RENDER_DELAY_MS = 1000;

export const AssistantDialog = () => {
  const { isOpen, setIsOpen } = useCardOpenStatusStore();
  const { user } = useUser();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsReady(true);
    }, RENDER_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isReady) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <>
          <Button
            type="button"
            onClick={handleOpen}
            size="4xl"
            aria-label="Abrir asistente IA"
            aria-expanded={false}
            aria-controls="assistant-dialog-card"
            className="fixed right-2 bottom-20 z-10 h-16 w-16 rounded-full border bg-linear-to-r from-purple to-primary md:hidden"
          >
            <MessageCircle className="size-8" aria-hidden />
          </Button>

          <button
            type="button"
            onClick={handleOpen}
            aria-label="Abrir asistente IA"
            aria-expanded={false}
            aria-controls="assistant-dialog-card"
            className={cn(
              "fixed right-4 bottom-4 z-10 hidden w-sm items-center justify-between rounded-xl px-4 py-3 text-left shadow-sm transition-opacity hover:opacity-95 md:flex",
              gradientClasses,
            )}
          >
            <div>
              <p className="text-sm font-semibold text-white">Asistente IA</p>
              <p className="flex items-center gap-1.5 text-xs text-white/90">
                <span
                  className="inline-block size-2 rounded-full bg-green-500"
                  aria-hidden
                />
                En línea
              </p>
            </div>
            <ChevronUp className="size-6 text-white" aria-hidden />
          </button>
        </>
      )}

      {isOpen && (
        <Card
          id="assistant-dialog-card"
          className="fixed right-4 bottom-16 z-10 w-[min(100%-2rem,24rem)] bg-white pt-0 md:bottom-4 md:w-sm border"
          role="dialog"
          aria-label="Asistente IA"
        >
          <CardHeader
            className={cn(
              "flex flex-row items-center justify-between py-3",
              gradientClasses,
            )}
          >
            <div>
              <CardTitle className="font-semibold text-white">
                Asistente IA
              </CardTitle>
              <CardDescription className="text-white">
                <span
                  className="mr-1.5 inline-block size-2 rounded-full bg-green-500"
                  aria-hidden
                />
                En línea
              </CardDescription>
            </div>
            <Button
              type="button"
              onClick={handleClose}
              variant="ghost"
              size="icon"
              aria-label="Cerrar asistente IA"
            >
              <X className="size-4 text-white" aria-hidden />
            </Button>
          </CardHeader>

          <CardContent className="flex flex-col gap-2">
            <div className="w-fit rounded-xl border p-3">
              <span className="font-bold">
                Hola{user?.name ? ` ${user.name}` : ""}!
              </span>
              <br />
              <div className="mt-2 ml-5">
                Soy tu asistente de WiAuto.
                <br />
                <span className="font-bold">¿En qué te puedo ayudar?</span>
              </div>
            </div>
            {ASSISTANT_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.label}
                  type="button"
                  size="sm"
                  variant="outline"
                  className="w-fit text-start text-xs text-primary hover:text-primary"
                >
                  <Icon className="size-4" aria-hidden />
                  {option.label}
                </Button>
              );
            })}
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Link className="w-full" href="/asistente/chat">
              <Button type="button" className={cn("w-full", gradientClasses)}>
                <MessageCircle className="size-4" aria-hidden />
                <span>Chat</span>
              </Button>
            </Link>
            <span className="flex items-center gap-2 text-xs text-gray-500">
              <Zap className="size-4 text-primary" aria-hidden />
              Respuestas en segundos
            </span>
          </CardFooter>
        </Card>
      )}
    </>
  );
};
