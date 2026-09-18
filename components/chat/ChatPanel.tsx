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
      <div className="space-y-6 ">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-6 text-gray-700" aria-hidden />
          <h1 className="text-2xl font-bold text-gray-900">Mensajes</h1>
        </div>

        <Card size="sm">
          <CardContent>
            <div className="flex gap-5">
              <div
                className={cn(
                  "w-96",
                  blockStyles,
                  hasSelectedChat ? "hidden lg:flex" : "flex",
                )}
              >
                <ChatHead />
                <Separator />
                <ChatList />
              </div>


              <div
                className={cn(
                  "min-h-0 min-w-0 flex-1",
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
