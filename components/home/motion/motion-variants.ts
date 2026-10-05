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

export const SPRING_ENTER: Transition = {
  type: "spring",
  visualDuration: 0.6,
  bounce: 0.25,
};

// `inherit` conserva el `delay` del padre (p. ej. el inyectado por `withDelay`).
const OPACITY_TRANSITION: Transition = {
  inherit: true,
  type: "tween",
  duration: 0.4,
  ease: EASE_ENTER,
};

const SPRING_ENTER_WITH_FADE: Transition = {
  ...SPRING_ENTER,
  opacity: OPACITY_TRANSITION,
};

export const riseUp: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_ENTER_WITH_FADE,
  },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: SPRING_ENTER_WITH_FADE,
  },
};

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: SPRING_ENTER_WITH_FADE,
  },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: SPRING_ENTER_WITH_FADE,
  },
};

// El blur va en tween: con spring el rebote generaría valores negativos inválidos.
export const blurIn: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      ...SPRING_ENTER_WITH_FADE,
      filter: { ...OPACITY_TRANSITION, duration: 0.6 },
    },
  },
};

export const staggerContainerExpressive: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemPop: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 32 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: SPRING_ENTER_WITH_FADE,
  },
};

export const HOVER_LIFT = { y: -6, scale: 1.02 } as const;

export const TAP_PRESS = { scale: 0.97 } as const;

export const HOVER_TRANSITION: Transition = {
  type: "spring",
  visualDuration: 0.25,
  bounce: 0.3,
};

export const heroBackgroundEnter: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: EASE_ENTER },
  },
};

// `delay` no se propaga a los hijos con variantes; por eso también se suma a `delayChildren`.
export const withDelay = (variants: Variants, delay: number): Variants => {
  const visible = variants.visible;
  if (!visible || typeof visible === "function") {
    return variants;
  }

  const transition = visible.transition ?? {};
  const delayChildren =
    typeof transition.delayChildren === "function"
      ? transition.delayChildren
      : (transition.delayChildren ?? 0) + delay;

  return {
    ...variants,
    visible: {
      ...visible,
      transition: { ...transition, delay, delayChildren },
    },
  };
};

export const staggerItemPopAt = (index: number): Variants =>
  withDelay(staggerItemPop, 0.1 + index * 0.08);

export const HERO_DELAYS = {
  background: 0,
  title: 0.1,
  subtitle: 0.2,
  features: 0.3,
  search: 0.4,
  storeButtons: 0.5,
} as const;
