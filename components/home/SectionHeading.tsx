"use client";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  lead: string;
  highlight?: string;
  className?: string;
  highlightClassName?: string;
  animate?: boolean;
}

export function SectionHeading({
  lead,
  highlight,
  className,
  highlightClassName,
  animate = true,
}: SectionHeadingProps) {
  const highlightText = highlight?.trim() || null;
  const highlightClasses = cn("text-primary", highlightClassName);
  const headingClassName = cn(
    "text-center text-xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem] lg:text-2xl",
    className,
  );

  if (!animate) {
    return (
      <div className="mb-5 flex items-center justify-between">
        <h2 className={headingClassName}>
          {lead}
          {highlightText ? (
            <>
              {" "}
              <span className={highlightClasses}>{highlightText}</span>
            </>
          ) : null}
        </h2>
      </div>
    );
  }

  return (
   
      <h2 className={headingClassName}>
        {lead}
        {highlightText ? (
          <>
            {" "}
            <span className={highlightClasses} >
              {highlightText}
            </span>
          </>
        ) : null}
      </h2>
  );
}
