"use client";

import { useUser } from "@/app/contexts/auth/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserChatAvatar = (
  props?: React.ComponentProps<typeof Avatar>,
) => {
  const { user } = useUser();

  return (
    <Avatar {...props}>
      {user?.avatar_url ? <AvatarImage src={user.avatar_url} /> : null}
      <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
    </Avatar>
  );
};
