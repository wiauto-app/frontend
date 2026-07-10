import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconContainerProps {
  Icon: LucideIcon;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
  iconColor?: string;
}

const sizes = {
  xs: {
    container: "size-8",
    icon: "size-4",
  },
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
  xl: {
    container: "size-20",
    icon: "size-10",
  },
};

export const IconContainer = ({
  Icon,
  className,
  size = "md",
  backgroundColor,
  iconColor,
}: IconContainerProps) => {
  const hasCustomColors = Boolean(backgroundColor || iconColor);

  return (
    <div
      className={cn(
        "rounded-md flex items-center justify-center shrink-0",
        !hasCustomColors && "bg-primary/10 text-primary",
        sizes[size].container,
        className,
      )}
      style={
        hasCustomColors
          ? {
              backgroundColor: backgroundColor
                ? `color-mix(in srgb, ${backgroundColor} 12%, transparent)`
                : undefined,
              color: iconColor,
            }
          : undefined
      }
    >
      <Icon className={sizes[size].icon} />
    </div>
  );
};