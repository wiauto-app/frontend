"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { IconContainer } from "../ui/iconContainer";
import { MotionHoverCard } from "../home/motion";
import {
  getVariant,
  staggerContainerExpressive,
  staggerItemPop,
} from "../home/motion/motion-variants";
import { usePrefersReducedMotion } from "../home/motion/usePrefersReducedMotion";
import type { QuickLink } from "./types";
import { resolveLowEmissionsQuickLinkIcon } from "./utils/resolve-low-emissions-quick-link-icon";

interface VehicleDiscoveryQuickCardsMotionProps {
  quickLinks: QuickLink[];
  className?: string;
}

export const VehicleDiscoveryQuickCardsMotion = ({
  quickLinks,
  className,
}: VehicleDiscoveryQuickCardsMotionProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerVariants = getVariant(
    staggerContainerExpressive,
    prefersReducedMotion,
  );
  const itemVariants = getVariant(staggerItemPop, prefersReducedMotion);

  return (
    <motion.div
      className={cn("grid grid-cols-1 gap-4 sm:grid-cols-3", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {quickLinks.map((link) => {
        const LinkIcon = resolveLowEmissionsQuickLinkIcon(link.href);

        return (
        <MotionHoverCard key={link.href} variants={itemVariants}>
          <Link
            href={link.href}
            className={cn(
              "group flex h-full items-center justify-between rounded-xl border bg-white p-3 transition-colors",
              !link.borderColor && "hover:border-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            )}
            style={
              link.borderColor ? { borderColor: link.borderColor } : undefined
            }
            aria-label={`Explorar ${link.label}`}
          >
            <div className="flex items-center gap-2">
              {link.imageUrl ? (
                <div className="relative size-10 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={link.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ) : LinkIcon ? (
                <IconContainer
                  Icon={LinkIcon}
                  size="sm"
                  backgroundColor={link.borderColor}
                  iconColor={link.titleColor}
                />
              ) : null}
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    !link.titleColor && "text-foreground",
                  )}
                  style={link.titleColor ? { color: link.titleColor } : undefined}
                >
                  {link.label}
                </p>
                {link.description ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {link.description}
                  </p>
                ) : null}
              </div>
            </div>
            <ChevronRight
              className={cn(
                "size-5 shrink-0 transition-transform group-hover:translate-x-0.5",
                !link.titleColor && "text-primary",
              )}
              style={link.titleColor ? { color: link.titleColor } : undefined}
              aria-hidden
            />
          </Link>
        </MotionHoverCard>
        );
      })}
    </motion.div>
  );
};
