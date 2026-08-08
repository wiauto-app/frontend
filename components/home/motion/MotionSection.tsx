"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { fadeUp, getVariant } from "./motion-variants";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface MotionSectionProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  as?: "section" | "div";
  amount?: number;
  /** When false, animates on mount instead of whileInView */
  inView?: boolean;
}

export const MotionSection = ({
  children,
  className,
  variants = fadeUp,
  as = "div",
  amount = 0.2,
  inView = true,
  ...rest
}: MotionSectionProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const resolvedVariants = getVariant(variants, prefersReducedMotion);
  const Component = as === "section" ? motion.section : motion.div;

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      {...(inView
        ? { whileInView: "visible", viewport: { once: true, amount } }
        : { animate: "visible" })}
      variants={resolvedVariants}
      {...rest}
    >
      {children}
    </Component>
  );
};
