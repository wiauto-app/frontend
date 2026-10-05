"use client";

import { motion } from "motion/react";

import type { NewsListItem } from "@/app/(landing)/noticias/types/news.types";
import { cn } from "@/lib/utils";

import { MotionHoverCard } from "./motion";
import {
  getVariant,
  slideFromLeft,
  staggerContainerExpressive,
  staggerItemPop,
} from "./motion/motion-variants";
import { usePrefersReducedMotion } from "./motion/usePrefersReducedMotion";
import { NewCard } from "./newCard";

interface RelatedNewsGridProps {
  items: NewsListItem[];
}

export const RelatedNewsGrid = ({ items }: RelatedNewsGridProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerVariants = getVariant(
    staggerContainerExpressive,
    prefersReducedMotion,
  );
  const featuredVariants = getVariant(slideFromLeft, prefersReducedMotion);
  const itemVariants = getVariant(staggerItemPop, prefersReducedMotion);

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:auto-rows-[minmax(180px,1fr)] lg:grid-cols-4 lg:max-h-96"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {items.map((item, index) => {
        const isFeatured = index === 0;

        return (
          <MotionHoverCard
            key={item.document_id}
            className={cn(
              isFeatured && "sm:col-span-2 lg:col-span-2 lg:row-span-2",
            )}
            variants={isFeatured ? featuredVariants : itemVariants}
          >
            <NewCard item={item} variant={isFeatured ? "featured" : "default"} />
          </MotionHoverCard>
        );
      })}
    </motion.div>
  );
};
