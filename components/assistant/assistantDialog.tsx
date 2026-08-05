"use client";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Car,
  ChevronUp,
  CreditCard,
  MessageCircle,
  Search,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useCardOpenStatusStore } from "./stores/cardOpenStatusStore";
import { useUser } from "@/app/contexts/auth/useUser";
import { cn } from "@/lib/utils";
export const AssistantDialog = () => {
  const { isOpen, setIsOpen } = useCardOpenStatusStore();
  const { user } = useUser();

  const options = [
    {
      label: "Buscar vehículos según mis preferencias",
      icon: <Search className="size-4" />,
    },
    {
      label: "Comparar modelos",
      icon: <Car className="size-4" />,
    },
    {
      label: "Opciones de financiación",
      icon: <CreditCard className="size-4" />,
    },
  ];

  const gradientClasses = "from-purple to-primary-soft bg-linear-to-r";

  return (
    <>
      <Card
        className={cn(
          "fixed bottom-4 right-4 bg-white z-10 w-sm pt-0 hidden md:block",
          !isOpen && "pb-0",
        )}
      >
        <CardHeader className={cn(
          "flex items-center justify-between  py-3",
          gradientClasses,
        )}>
          <div>
            <CardTitle className="text-white font-semibold">
              Asistente IA
            </CardTitle>
            <CardDescription className="text-white">
              <div className="inline-block w-2 h-2 bg-green-500 rounded-full"></div>{" "}
              En linea
            </CardDescription>
          </div>
          <div>
            {isOpen && (
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
              >
                <X className="size-4 text-white" />
              </Button>
            )}
            {!isOpen && (
              <Button
                onClick={() => setIsOpen(true)}
                variant="ghost"
                size="icon"
              >
                <ChevronUp className="size-6 text-white" />
              </Button>
            )}
          </div>
        </CardHeader>
        {isOpen && (
          <>
            <CardContent className="flex flex-col gap-2">
              <div className="border rounded-xl p-3 w-fit">
                <span className="font-bold">👋 Hola {user?.name}!👋</span>
                <br />
                <div className="ml-5 mt-2">
                  Soy tu asistente de WiAuto.
                  <br />
                  <span className="font-bold">¿En que te puedo ayudar?</span>
                </div>
              </div>
              {options.map((option) => (
                <Button
                  size="sm"
                  key={option.label}
                  variant="outline"
                  className="w-fit text-start hover:text-primary  text-primary text-xs"
                >
                  {option.icon}
                  {option.label}
                </Button>
              ))}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Link className="w-full" href="/asistente/chat">
                <Button className={cn(
                  "w-full",
                  gradientClasses,
                )}>
                  <MessageCircle className="size-4" />
                  <span>Chat</span>
                </Button>
              </Link>
              <span className="text-xs text-gray-500 flex items-center gap-2">
                <Zap className="size-4 text-primary" />
                Respuestas en segundos
              </span>
            </CardFooter>
          </>
        )}
      </Card>
    </>
  );
};
