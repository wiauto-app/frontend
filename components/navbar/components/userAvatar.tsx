import { useUser } from "@/app/contexts/auth/useUser";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useEntitlements } from "@/hooks/useEntitlements";
import { cn, getImageUrl } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export const UserAvatar = (
  props?: React.ComponentProps<typeof Avatar>,
) => {
  const { user } = useUser();
  const { isSubscribed } = useEntitlements();

  return (
    <div className="relative inline-flex">
      {/* Glow */}
      {isSubscribed && (
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 opacity-70 blur-[3px]" />
      )}

      <Avatar
        {...props}
        className={cn(
          "relative size-10",
          isSubscribed
            ? "border-2 border-background ring-2 ring-primary/40"
            : "border-2 border-primary/15 bg-primary/5",
          props?.className,
        )}
      >
        {user?.avatar_url && (
          <AvatarImage
            src={getImageUrl(user.avatar_url)}
            alt={user.name ?? "Usuario"}
          />
        )}

        <AvatarFallback
          className={cn(
            "font-semibold",
            isSubscribed
              ? "bg-gradient-to-br from-primary via-purple-500 to-pink-500 text-white"
              : "bg-gradient-to-br from-primary/20 to-primary/5 text-primary",
          )}
        >
          {user?.name?.charAt(0)?.toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Subscriber badge */}
      {isSubscribed && (
        <span className="absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-primary to-purple-600 text-white shadow-sm">
          <Sparkles className="size-2.5 fill-current" />
        </span>
      )}
    </div>
  );
};