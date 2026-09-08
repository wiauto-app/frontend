"use client";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  lead: string;
  highlight?: string;
  className?: string;
  highlightClassName?: string;
  /** Si no hay `highlight`, resalta las últimas N palabras de `lead`. */
  highlightWordsCount?: number;
  description?: string;
}

interface SplitHeading {
  leadText: string;
  highlightText: string | null;
}

const splitLeadHighlight = (
  lead: string,
  highlight: string | undefined,
  highlightWordsCount: number,
): SplitHeading => {
  const explicitHighlight = highlight?.trim() || null;
  if (explicitHighlight) {
    return { leadText: lead, highlightText: explicitHighlight };
  }

  const words = lead.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return { leadText: lead, highlightText: null };
  }

  const count = Math.min(Math.max(highlightWordsCount, 0), words.length);
  if (count === 0) {
    return { leadText: lead, highlightText: null };
  }

  const highlightText = words.slice(-count).join(" ");
  const leadText = words.slice(0, -count).join(" ");

  return { leadText, highlightText };
};

export function SectionHeading({
  lead,
  highlight,
  className,
  highlightClassName,
  highlightWordsCount = 1,
  description,
}: SectionHeadingProps) {
  const { leadText, highlightText } = splitLeadHighlight(
    lead,
    highlight,
    highlightWordsCount,
  );
  const highlightClasses = cn("text-primary", highlightClassName);
  const headingClassName = cn(
    "text-center text-xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem] lg:text-2xl",
    className,
  );

  return (
    <div className="space-y-2">
      <h2 className={headingClassName}>
        {leadText}
        {highlightText ? (
          <>
            {leadText ? " " : null}
            <span className={highlightClasses}>{highlightText}</span>
          </>
        ) : null}
      </h2>
      {description ? (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
