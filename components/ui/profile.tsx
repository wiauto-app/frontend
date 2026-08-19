import { UserAvatar } from "../navbar/components/userAvatar";

type ProfileProps = {
  name: string;
  description?: string;
  avatar_url?: string;
  size?: "sm" | "md" | "lg";
};

export const Profile = ({
  name,
  description,
  avatar_url,
  size = "md",
}: ProfileProps) => {
  return (
    <div className="flex items-center gap-2">
      <UserAvatar imageUrl={avatar_url} name={name} />
      <div className="flex flex-col ">
        <h3 className="font-bold text-foreground text-sm">{name}</h3>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
    </div>
  );
};
