import type { Transition, Variants } from "motion/react";

export const EASE_ENTER = [0.22, 1, 0.36, 1] as const;

export const ENTER_TRANSITION: Transition = {
  duration: 0.3,
  ease: EASE_ENTER,
};

export const STAGGER_CHILDREN = 0.04;
export const STAGGER_CHILDREN_FAST = 0.035;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: ENTER_TRANSITION,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: EASE_ENTER },
  },
};

export const fadeInFromRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: ENTER_TRANSITION,
  },
};

export const fadeInFromLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: ENTER_TRANSITION,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: EASE_ENTER },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_CHILDREN,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: ENTER_TRANSITION,
  },
};

export const reducedMotionVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0 },
  },
};

export const getVariant = (
  variant: Variants,
  prefersReducedMotion: boolean,
): Variants => (prefersReducedMotion ? reducedMotionVariant : variant);

export const HERO_DELAYS = {
  background: 0,
  title: 0.12,
  search: 0.28,
  storeButtons: 0.32,
  aiCard: 0.48,
  aiChips: 0.62,
} as const;
