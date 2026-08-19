import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn, getImageUrl } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface UserAvatarProps extends React.ComponentProps<typeof Avatar> {
  imageUrl?: string | null;
  name?: string | null;
  highlighted?: boolean;
  showBadge?: boolean;
}

export const UserAvatar = ({
  imageUrl,
  name,
  highlighted = false,
  showBadge = true,
  className,
  ...props
}: UserAvatarProps) => {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="relative inline-flex shrink-0">
      {highlighted && (
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 opacity-70 blur-[3px]" />
      )}

      <Avatar
        {...props}
        className={cn(
          "relative size-10",
          highlighted
            ? "border-2 border-background ring-2 ring-primary/40"
            : "border-2 border-primary/15 bg-primary/5",
          className,
        )}
      >
        {imageUrl && (
          <AvatarImage
            src={getImageUrl(imageUrl)}
            alt={name || "Avatar"}
          />
        )}

        <AvatarFallback
          className={cn(
            "font-semibold",
            highlighted
              ? "bg-gradient-to-br from-primary via-purple-500 to-pink-500 text-white"
              : "bg-gradient-to-br from-primary/20 to-primary/5 text-primary",
          )}
        >
          {initial}
        </AvatarFallback>
      </Avatar>

      {highlighted && showBadge && (
        <span className="absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-primary to-purple-600 text-white shadow-sm">
          <Sparkles className="size-2.5 fill-current" />
        </span>
      )}
    </div>
  );
};