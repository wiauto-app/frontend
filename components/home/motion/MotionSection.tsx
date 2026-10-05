"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { fadeUp, withDelay } from "./motion-variants";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface MotionSectionProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  as?: "section" | "div";
  amount?: number;
  /** When false, animates on mount instead of whileInView */
  inView?: boolean;
  /** Seconds to wait before the enter animation (also delays variant children) */
  delay?: number;
}

export const MotionSection = ({
  children,
  className,
  variants = fadeUp,
  as = "div",
  amount = 0.2,
  inView = true,
  delay,
  id,
  ...rest
}: MotionSectionProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    const StaticComponent = as;
    return (
      <StaticComponent id={id} className={cn(className)}>
        {children}
      </StaticComponent>
    );
  }

  const resolvedVariants = delay ? withDelay(variants, delay) : variants;
  const Component = as === "section" ? motion.section : motion.div;

  return (
    <Component
      id={id}
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
