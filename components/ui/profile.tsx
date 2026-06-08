import { getImageUrl } from "@/app/(public)/vehiculos/utils";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
      <div
        className={cn(
          "relative rounded-full overflow-hidden",
          size === "sm" ? "size-10" : size === "md" ? "size-12" : "size-14",
        )}
      >
        <Image
          src={getImageUrl(avatar_url ?? "")}
          unoptimized
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col ">
        <h3 className="font-bold text-foreground text-lg">{name}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};
