"use client";


import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { getVariant, staggerContainer, staggerItem } from "./motion";
import { usePrefersReducedMotion } from "./motion/usePrefersReducedMotion";

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
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerVariants = getVariant(staggerContainer, prefersReducedMotion);
  const itemVariants = getVariant(staggerItem, prefersReducedMotion);
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
    <motion.div
      className="mb-5 flex items-center justify-between"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={containerVariants}
    >
      <motion.h2 className={headingClassName} variants={itemVariants}>
        {lead}
        {highlightText ? (
          <>
            {" "}
            <motion.span className={highlightClasses} variants={itemVariants}>
              {highlightText}
            </motion.span>
          </>
        ) : null}
      </motion.h2>
    </motion.div>
  );
}
