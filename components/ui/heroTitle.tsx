import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface HeroTitleProps {
  children: ReactNode;
  className?: string;
  highlightClassName?: string;
  /** Si es `true`, resalta la última palabra. Por defecto `true`. */
  highlight?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const extractText = (children: ReactNode): string => {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(extractText).join("");
  }

  return "";
};

const splitLastWord = (
  text: string,
): { lead: string; highlight: string | null } => {
  const trimmed = text.trim();
  if (!trimmed) {
    return { lead: "", highlight: null };
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { lead: "", highlight: parts[0] ?? null };
  }

  return {
    lead: parts.slice(0, -1).join(" "),
    highlight: parts[parts.length - 1] ?? null,
  };
};

export const HeroTitle = ({
  children,
  className,
  highlightClassName,
  highlight = true,
  as = "h1",
}: HeroTitleProps) => {
  const Component = as;
  const text = extractText(children);
  const { lead, highlight: last_word } = highlight
    ? splitLastWord(text)
    : { lead: text.trim(), highlight: null };
  const highlight_classes = cn("text-primary", highlightClassName);

  return (
    <Component
      className={cn(
        "w-full text-center text-2xl font-bold text-white lg:w-auto lg:max-w-md lg:text-left lg:text-4xl",
        className,
      )}
    >
      {lead}
      {last_word ? (
        <>
          {lead ? " " : null}
          <span className={highlight_classes}>{last_word}</span>
        </>
      ) : null}
    </Component>
  );
};
