"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { IconContainer } from "../ui/iconContainer";
import { usePrefersReducedMotion } from "./motion/usePrefersReducedMotion";
import type { VehicleExtraServiceItem } from "./types/vehicle-extra-service.types";

interface ServiceHomeItemProps {
  item: VehicleExtraServiceItem;
}

const buildServiceGradient = (color: string): string =>
  `linear-gradient(
    to bottom,
    color-mix(in srgb, ${color} 18%, transparent) 0%,
    color-mix(in srgb, ${color} 6%, transparent) 45%,
    transparent 100%
  )`;

export const ServiceHomeItem = ({ item }: ServiceHomeItemProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const accentColor = item.color;

  const card = (
    <Card
      size="sm"
      className={cn("h-full", accentColor && "border-0 shadow-sm")}
      style={
        accentColor
          ? {
              backgroundImage: buildServiceGradient(accentColor),
              backgroundColor: "var(--card)",
            }
          : undefined
      }
    >
      <CardContent className="flex-1 flex flex-col items-center gap-4">
        <IconContainer
          iconColor={accentColor}
          className="bg-white/10 shadow-md"
          Icon={item.icon}
        />
        <h3 className="text-center text-lg font-bold">{item.name}</h3>
        {accentColor ? (
          <div
            style={{ backgroundColor: accentColor }}
            className="h-1 w-8 rounded-full"
          />
        ) : null}
        <p className="text-center text-sm text-muted-foreground">
          {item.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          className="rounded-full group/btn"
          variant="outline"
          style={{ borderColor: accentColor, color: accentColor }}
        >
          <motion.span
            className="inline-flex"
            whileHover={prefersReducedMotion ? undefined : { x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <ArrowRight className="size-4" aria-hidden />
          </motion.span>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <Link
      href={item.href}
      aria-label={item.name}
      className="block h-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {card}
    </Link>
  );
};
