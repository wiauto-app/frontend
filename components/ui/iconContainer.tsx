import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

import { cn } from "@/lib/utils";

export type AppIconComponent = LucideIcon | IconType;

interface IconContainerProps {
  Icon?: AppIconComponent | null;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
  iconColor?: string;
  rounded?: boolean;
  justIcon?: boolean;
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
  rounded,
  justIcon = false,
}: IconContainerProps) => {
  const hasCustomColors = Boolean(backgroundColor || iconColor);

  return (
    <div
      className={cn(
        "rounded-md flex items-center justify-center shrink-0",
        !hasCustomColors && "bg-primary/10 text-primary",
       justIcon ? "" : sizes[size].container,
        rounded && "rounded-full",
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
      {Icon ? <Icon className={sizes[size].icon} /> : null}
    </div>
  );
};
