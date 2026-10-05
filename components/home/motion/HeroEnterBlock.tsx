"use client";

import type { ReactNode } from "react";
import type { Variants } from "motion/react";

import { MotionSection } from "./MotionSection";

interface HeroEnterBlockProps {
  children: ReactNode;
  className?: string;
  variants: Variants;
  delay?: number;
}

export const HeroEnterBlock = ({
  children,
  className,
  variants,
  delay,
}: HeroEnterBlockProps) => (
  <MotionSection
    inView={false}
    variants={variants}
    delay={delay}
    className={className}
  >
    {children}
  </MotionSection>
);
