import { useUser } from "@/app/contexts/auth/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";

export const UserAvatar = (props?: React.ComponentProps<typeof Avatar>) => {
  const { user } = useUser();
return (
    <Avatar {...props}>
      {user?.avatar_url && <AvatarImage src={getImageUrl(user?.avatar_url)} />}
      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}
