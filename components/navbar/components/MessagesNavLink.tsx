"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { useNavbarChatUnread } from "../hooks/useNavbarChatUnread";

export const MessagesNavLink = () => {
  const { isAuthenticated, unreadCount, badgeLabel } = useNavbarChatUnread();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button
      nativeButton={false}
      render={
        <Link
          href="/usuario/mensajes"
          aria-label={
            unreadCount > 0
              ? `Mensajes, ${unreadCount} sin leer`
              : "Mensajes"
          }
        />
      }
      variant="ghost"
      size="icon-sm"
      className="relative"
    >
      <MessageCircle className="size-5" aria-hidden />
      {badgeLabel ? (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {badgeLabel}
        </span>
      ) : null}
    </Button>
  );
};
