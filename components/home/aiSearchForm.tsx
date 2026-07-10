"use client";

import { SearchIcon, SparklesIcon } from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

import {
  getVariant,
  HERO_DELAYS,
  scaleIn,
  STAGGER_CHILDREN_FAST,
  staggerContainer,
  staggerItem,
} from "./motion";
import { usePrefersReducedMotion } from "./motion/usePrefersReducedMotion";

interface AiSearchFormProps {
  className?: string;
}

export const AiSearchForm = ({ className }: AiSearchFormProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const cardVariants = getVariant(scaleIn, prefersReducedMotion);
  const chipsContainer = getVariant(staggerContainer, prefersReducedMotion);
  const chipItem = getVariant(staggerItem, prefersReducedMotion);

  const examples = [
    "SUV familiares",
    "Económicos",
    "Eléctricos",
    "Camionetas 4x4",
    "Autos de deportivos",
  ];

  return (
    <div className={cn(className)}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { delay: HERO_DELAYS.aiCard, duration: 0.3 }
        }
      >
        <div className="space-y-4">
          <p className="text-white">
            Cuéntanos qué buscas y nuestra IA encontrará el coche ideal para tí.
          </p>
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-4 size-5" />
            <Input
              placeholder="Ej: Busco un SUV automático, año 2020 en adelante, menos de 30.000€"
              className="h-12 bg-white pl-12 pr-10"
            />
            <Button className="absolute right-2 transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100">
              <SparklesIcon className="size-4" />
              Buscar con IA
            </Button>
          </div>
          <motion.div
            className="flex flex-wrap gap-2"
            initial="hidden"
            animate="visible"
            variants={chipsContainer}
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    delayChildren: HERO_DELAYS.aiChips,
                    staggerChildren: STAGGER_CHILDREN_FAST,
                  }
            }
          >
            {examples.map((example) => (
              <motion.div key={example} variants={chipItem}>
                <Button
                  variant="outline"
                  className="rounded-full transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-white/80 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  size="xs"
                >
                  {example}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
