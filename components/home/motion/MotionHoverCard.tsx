"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  HOVER_LIFT,
  HOVER_TRANSITION,
  TAP_PRESS,
} from "./motion-variants";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface MotionHoverCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}

export const MotionHoverCard = ({
  children,
  className,
  variants,
  ...rest
}: MotionHoverCardProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      whileHover={HOVER_LIFT}
      whileTap={TAP_PRESS}
      transition={HOVER_TRANSITION}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
