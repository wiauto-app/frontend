import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type IconContainerProps = {
  Icon: LucideIcon;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: {
    container: "size-10",
    icon: "size-5",
  },
  md: {
    container: "size-12",
    icon: "size-6",
  },
  lg: {
    container: "size-16",
    icon: "size-8",
  },
};

export const IconContainer = ({
  Icon,
  className,
  size = "md",
}: IconContainerProps) => {
  return (
    <div
      className={cn(
        "bg-primary/10 text-primary rounded-md flex items-center justify-center shrink-0",
        sizes[size].container,
        className,
      )}
    >
      <Icon className={sizes[size].icon} />
    </div>
  );
};