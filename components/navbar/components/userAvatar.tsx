import { useUser } from "@/app/contexts/auth/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";

export const UserAvatar = (
  props?: React.ComponentProps<typeof Avatar>
) => {
  const { user } = useUser();

  return (
    <Avatar
      className="border-2 border-primary/20 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5"
      {...props}
    >
      {user?.avatar_url && (
        <AvatarImage
          src={getImageUrl(user.avatar_url)}
          alt={user.name ?? "Usuario"}
        />
      )}

      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 font-semibold text-primary-foreground">
        {user?.name?.charAt(0)?.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};