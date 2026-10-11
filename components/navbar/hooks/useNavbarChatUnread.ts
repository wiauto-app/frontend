"use client";

import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/app/contexts/auth/useUser";
import { CHAT_QUERY_KEYS } from "@/components/chat/context/chatSocketContext";
import { chatService } from "@/services/chatService";

const UNREAD_BADGE_CAP = 99;
const UNREAD_REFETCH_INTERVAL_MS = 30_000;

export interface NavbarChatUnreadResult {
  isAuthenticated: boolean;
  unreadCount: number;
  badgeLabel: string | null;
}

export const useNavbarChatUnread = (): NavbarChatUnreadResult => {
  const { isAuthenticated } = useUser();

  const unreadQuery = useQuery({
    queryKey: CHAT_QUERY_KEYS.unreadTotal,
    enabled: isAuthenticated,
    refetchInterval: UNREAD_REFETCH_INTERVAL_MS,
    queryFn: async () => {
      const response = await chatService.getUnreadTotal();
      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudo cargar el total de mensajes sin leer",
        );
      }
      return response.data;
    },
  });

  const unreadCount = unreadQuery.data?.total ?? 0;
  const badgeLabel =
    unreadCount > UNREAD_BADGE_CAP
      ? `${UNREAD_BADGE_CAP}+`
      : unreadCount > 0
        ? String(unreadCount)
        : null;

  return {
    isAuthenticated,
    unreadCount,
    badgeLabel,
  };
};
