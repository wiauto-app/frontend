"use client";

import Image from "next/image";
import { FaLeaf } from "react-icons/fa";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { getVariant } from "@/components/home/motion";
import {
  slideFromLeft,
  slideFromRight,
} from "@/components/home/motion/motion-variants";
import { usePrefersReducedMotion } from "@/components/home/motion/usePrefersReducedMotion";

import { renderHighlightedDiscoveryTitle } from "./renderHighlightedDiscoveryTitle";
import type { DiscoveryAccordionSection, QuickLink } from "./types";
import { VehicleDiscoveryAccordion } from "./VehicleDiscoveryAccordion";
import { VehicleDiscoveryQuickCardsMotion } from "./VehicleDiscoveryQuickCardsMotion";

interface VehicleDiscoveryMotionContentProps {
  title: string;
  description: string;
  imageUrl?: string | null;
  quickLinks?: QuickLink[];
  sections: DiscoveryAccordionSection[];
  className?: string;
}

export const VehicleDiscoveryMotionContent = ({
  title,
  description,
  imageUrl,
  quickLinks,
  sections,
  className,
}: VehicleDiscoveryMotionContentProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const textVariants = getVariant(slideFromLeft, prefersReducedMotion);
  const imageVariants = getVariant(slideFromRight, prefersReducedMotion);

  const textBlock = (
    <>
      <h2
        id="vehicle-discovery-title"
        className="text-2xl text-center font-bold text-foreground lg:text-left lg:text-4xl"
      >
        <span className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
          {renderHighlightedDiscoveryTitle(title)}
          <FaLeaf className="h-4 w-4 text-nature" aria-hidden />
        </span>
      </h2>
      <p className="text-center text-sm text-muted-foreground lg:text-left">
        {description}
      </p>
    </>
  );

  return (
    <section
      className={cn(className, "flex flex-col space-y-4")}
      aria-labelledby="vehicle-discovery-title"
    >
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {prefersReducedMotion ? (
          <div className="flex flex-col items-center justify-center gap-5 lg:items-start">
            {textBlock}
          </div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center gap-5 lg:items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={textVariants}
          >
            {textBlock}
          </motion.div>
        )}
        {prefersReducedMotion ? (
          imageUrl ? (
            <div className="overflow-hidden rounded-xl">
              <Image
                src={imageUrl}
                alt={title}
                width={1280}
                height={720}
                className="aspect-video h-auto w-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div />
          )
        ) : (
          <motion.div
            className="overflow-hidden rounded-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={imageVariants}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                width={1280}
                height={720}
                className="aspect-video h-auto w-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : null}
          </motion.div>
        )}
      </div>

      {quickLinks && quickLinks.length > 0 ? (
        <VehicleDiscoveryQuickCardsMotion quickLinks={quickLinks} />
      ) : null}

      <VehicleDiscoveryAccordion sections={sections} />
    </section>
  );
};
