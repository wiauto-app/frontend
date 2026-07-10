"use client";

import type { NewsListItem } from "@/app/(landing)/noticias/types/news.types";
import { motion } from "motion/react";

import { NewCard } from "./newCard";
import { getVariant, staggerContainer, staggerItem } from "./motion";
import { usePrefersReducedMotion } from "./motion/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface RelatedNewsGridProps {
  items: NewsListItem[];
}

export const RelatedNewsGrid = ({ items }: RelatedNewsGridProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerVariants = getVariant(staggerContainer, prefersReducedMotion);
  const itemVariants = getVariant(staggerItem, prefersReducedMotion);

  return (
    <motion.div
      className="grid max-h-96 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:auto-rows-[minmax(180px,1fr)] lg:grid-cols-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {items.map((item, index) => {
        const isFeatured = index === 0;

        return (
          <motion.div
            key={item.document_id}
            className={cn(
              isFeatured && "sm:col-span-2 lg:col-span-2 lg:row-span-2",
            )}
            variants={itemVariants}
          >
            <NewCard item={item} variant={isFeatured ? "featured" : "default"} />
          </motion.div>
        );
      })}
    </motion.div>
  );
};
