"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { FaLeaf } from "react-icons/fa";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { fadeUp, getVariant } from "@/components/home/motion";
import { usePrefersReducedMotion } from "@/components/home/motion/usePrefersReducedMotion";
import type { DiscoveryAccordionSection, QuickLink } from "./types";
import { VehicleDiscoveryAccordion } from "./VehicleDiscoveryAccordion";
import { VehicleDiscoveryQuickCards } from "./VehicleDiscoveryQuickCards";

interface VehicleDiscoveryMotionContentProps {
  title: string;
  description: string;
  imageUrl?: string | null;
  quickLinks?: QuickLink[];
  sections: DiscoveryAccordionSection[];
  className?: string;
  renderHighlightedTitle: (title: string) => ReactNode;
}

export const VehicleDiscoveryMotionContent = ({
  title,
  description,
  imageUrl,
  quickLinks,
  sections,
  className,
  renderHighlightedTitle,
}: VehicleDiscoveryMotionContentProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const headerVariants = getVariant(fadeUp, prefersReducedMotion);

  return (
    <section
      className={cn(className, "flex flex-col space-y-4")}
      aria-labelledby="vehicle-discovery-title"
    >
      <motion.div
        className="grid grid-cols-1 gap-2 md:grid-cols-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={headerVariants}
      >
        <div className="flex flex-col justify-center gap-5">
          <h2
            id="vehicle-discovery-title"
            className="space-y-2 text-4xl font-bold text-foreground"
          >
            <span className="flex flex-wrap items-center gap-2">
              {renderHighlightedTitle(title)}
              <FaLeaf className="h-4 w-4 text-nature" aria-hidden />
            </span>
          </h2>
          <p>{description}</p>
        </div>
        {imageUrl ? (
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ) : (
          <div />
        )}
      </motion.div>

      {quickLinks && quickLinks.length > 0 ? (
        <VehicleDiscoveryQuickCards quickLinks={quickLinks} className="" />
      ) : null}

      <VehicleDiscoveryAccordion sections={sections} />
    </section>
  );
};
