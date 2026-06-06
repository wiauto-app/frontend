"use client";

import { MessageSquare } from "lucide-react";

import { ChatContent } from "@/components/chat/chatContent";
import { ChatHead } from "@/components/chat/chatHead";
import { ChatList } from "@/components/chat/chatList";
import { ChatSocketProvider } from "@/components/chat/context/chatSocketContext";
import { useChatFilters } from "@/components/chat/hooks/useChatFilters";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const ChatPanel = () => {
  const { chatId } = useChatFilters();
  const hasSelectedChat = Boolean(chatId);
  const blockStyles = "flex flex-col gap-4";

  return (
    <ChatSocketProvider>
      <div className="space-y-6 pb-20">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-6 text-gray-700" aria-hidden />
          <h1 className="text-2xl font-bold text-gray-900">Mensajes</h1>
        </div>

        <Card size="sm" className="border-gray-100 shadow-sm">
          <CardContent>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[23rem_auto_minmax(0,1fr)]">
              <div
                className={cn(
                  blockStyles,
                  hasSelectedChat ? "hidden lg:flex" : "flex",
                )}
              >
                <ChatHead />
                <Separator />
                <ChatList />
              </div>

              <Separator orientation="vertical" className="hidden lg:block" />

              <div
                className={cn(
                  "min-h-[70vh]",
                  blockStyles,
                  hasSelectedChat ? "flex" : "hidden lg:flex",
                )}
              >
                <ChatContent />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ChatSocketProvider>
  );
};
