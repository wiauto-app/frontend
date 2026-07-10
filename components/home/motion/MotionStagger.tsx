"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  getVariant,
  staggerContainer,
  staggerItem,
} from "./motion-variants";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface MotionStaggerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  amount?: number;
  /** When false, animates on mount instead of whileInView */
  inView?: boolean;
}

export const MotionStagger = ({
  children,
  className,
  itemClassName,
  amount = 0.2,
  inView = true,
  ...rest
}: MotionStaggerProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerVariants = getVariant(staggerContainer, prefersReducedMotion);
  const itemVariants = getVariant(staggerItem, prefersReducedMotion);

  const childArray = Array.isArray(children) ? children : [children];

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      {...(inView
        ? { whileInView: "visible", viewport: { once: true, amount } }
        : { animate: "visible" })}
      variants={containerVariants}
      {...rest}
    >
      {childArray.map((child, index) => {
        if (child == null || child === false) {
          return null;
        }

        const key =
          typeof child === "object" &&
          child !== null &&
          "key" in child &&
          child.key != null
            ? String(child.key)
            : `stagger-${index}`;

        return (
          <motion.div
            key={key}
            className={cn(itemClassName)}
            variants={itemVariants}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

interface MotionStaggerItemProps {
  children: ReactNode;
  className?: string;
}

/** Use inside a MotionSection / motion container that already has staggerContainer variants */
export const MotionStaggerItem = ({
  children,
  className,
}: MotionStaggerItemProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const itemVariants = getVariant(staggerItem, prefersReducedMotion);

  return (
    <motion.div className={cn(className)} variants={itemVariants}>
      {children}
    </motion.div>
  );
};
