"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { getVariant, staggerContainer, staggerItem } from "./motion";
import { usePrefersReducedMotion } from "./motion/usePrefersReducedMotion";

interface SectionHeadingProps {
  lead: string;
  highlight: string;
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
  const highlightClasses = cn("text-primary", highlightClassName);

  if (!animate) {
    return (
      <div className="mb-5 flex items-center justify-between">
        <h2
          className={cn(
            "text-center text-xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem] lg:text-2xl",
            className,
          )}
        >
          {lead} <span className={highlightClasses}>{highlight}</span>
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
      <motion.h2
        className={cn(
          "text-center text-xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem] lg:text-2xl",
          className,
        )}
        variants={itemVariants}
      >
        {lead}{" "}
        <motion.span className={highlightClasses} variants={itemVariants}>
          {highlight}
        </motion.span>
      </motion.h2>
    </motion.div>
  );
}
