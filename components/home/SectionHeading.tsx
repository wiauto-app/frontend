"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { blurIn, popIn, usePrefersReducedMotion, withDelay } from "./motion";

interface SectionHeadingProps {
  lead: string;
  highlight?: string;
  className?: string;
  highlightClassName?: string;
  /** Si no hay `highlight`, resalta las últimas N palabras de `lead`. */
  highlightWordsCount?: number;
  description?: string;
  /** Anima el título al entrar en pantalla (blurIn + popIn del resaltado). */
  animated?: boolean;
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

const HIGHLIGHT_DELAY = 0.25;

const highlightVariants = withDelay(popIn, HIGHLIGHT_DELAY);

export function SectionHeading({
  lead,
  highlight,
  className,
  highlightClassName,
  highlightWordsCount = 1,
  description,
  animated = false,
}: SectionHeadingProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;
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
  const leadSeparator = leadText ? " " : null;

  const descriptionNode = description ? (
    <p className="text-sm text-muted-foreground text-center">{description}</p>
  ) : null;

  if (shouldAnimate) {
    return (
      <div>
        <motion.h2
          className={headingClassName}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={blurIn}
        >
          {leadText}
          {highlightText ? (
            <>
              {leadSeparator}
              {/* inline-block: los transforms no se aplican a elementos inline. */}
              <motion.span
                className={cn("inline-block", highlightClasses)}
                variants={highlightVariants}
              >
                {highlightText}
              </motion.span>
            </>
          ) : null}
        </motion.h2>
        {descriptionNode}
      </div>
    );
  }

  return (
    <div>
      <h2 className={headingClassName}>
        {leadText}
        {highlightText ? (
          <>
            {leadSeparator}
            <span className={highlightClasses}>{highlightText}</span>
          </>
        ) : null}
      </h2>
      {descriptionNode}
    </div>
  );
}
