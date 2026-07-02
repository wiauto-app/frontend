"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";
import { useCallback } from "react";

export type SuggestionsProps = ComponentProps<typeof ScrollArea>;

export const Suggestions = ({
  className,
  children,
  ...props
}: SuggestionsProps) => (
  <ScrollArea className="w-full overflow-x-auto whitespace-nowrap" {...props}>
    <div className={cn("flex w-max flex-nowrap items-center gap-2", className)}>
      {children}
    </div>
    <ScrollBar className="hidden" orientation="horizontal" />
  </ScrollArea>
);

export interface SuggestionProps extends HTMLAttributes<HTMLButtonElement> {
  suggestion: string;
  description?: string;
  Icon?: LucideIcon;
  disabled?: boolean;
  iconClassName?: string;
}

export const Suggestion = ({
  suggestion,
  description,
  onClick,
  className,
  Icon,
  iconClassName,
  children,
  disabled,
  ...props
}: SuggestionProps) => {
  return (
    <button
      className={cn(
        "flex h-auto w-full cursor-pointer flex-col gap-2 whitespace-normal rounded-xl border-0 bg-white p-2 2xl:p-3 text-left text-sm text-foreground hover:bg-muted/90 xl:flex-row xl:gap-4",
        className,
      )}
      onClick={onClick}
      type="button"
      disabled={disabled}
      {...props}
    >
      {Icon && (
        <Icon className={cn("size-5 text-primary", iconClassName)} />
      )}
      <span>{children || suggestion}</span>
      {description && (
        <p className="text-xs text-muted-foreground truncate ">{description}</p>
      )}
    </button>
  );
};
