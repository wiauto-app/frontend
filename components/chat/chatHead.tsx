"use client";

import { UserChatAvatar } from "@/components/chat/components/UserChatAvatar";
import { ChatSearchInput } from "@/components/chat/chatSearchInput";
import { CreateChatDialog } from "@/components/chat/createChatDialog";

export const ChatHead = () => {
  return (
    <div className="flex items-center gap-2">
      <UserChatAvatar className="size-10" />
      <ChatSearchInput />
      <CreateChatDialog />
    </div>
  );
};
