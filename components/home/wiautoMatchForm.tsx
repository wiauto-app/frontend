"use client";

import { motion } from "motion/react";
import { RiSparklingFill } from "react-icons/ri";

import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AiSearchForm } from "./aiSearchForm";
import { MotionSection } from "./motion";
import { getVariant, popIn, SPRING_ENTER, withDelay } from "./motion/motion-variants";
import { usePrefersReducedMotion } from "./motion/usePrefersReducedMotion";
import { SectionHeading } from "./SectionHeading";

export const WiautoMatchForm = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const cardVariants = getVariant(popIn, prefersReducedMotion);
  const badgeVariants = getVariant(withDelay(popIn, 0.2), prefersReducedMotion);

  return (
    <MotionSection variants={cardVariants} amount={0.25}>
      <motion.div
        className="rounded-xl bg-primary-dark shadow-lg ring-4 ring-primary/50"
        initial={false}
        whileInView={
          prefersReducedMotion
            ? undefined
            : {
                boxShadow: [
                  "0 0 0 4px color-mix(in srgb, var(--primary) 50%, transparent)",
                  "0 0 28px 6px color-mix(in srgb, var(--primary) 35%, transparent)",
                  "0 0 0 4px color-mix(in srgb, var(--primary) 50%, transparent)",
                ],
              }
        }
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Card size="sm" className="border-0 bg-transparent shadow-none ring-0">
          <CardHeader className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={badgeVariants}
              >
                <Badge>Nuevo</Badge>
              </motion.div>
              <motion.span
                className="inline-flex"
                initial={prefersReducedMotion ? false : { rotate: -90, opacity: 0 }}
                whileInView={
                  prefersReducedMotion
                    ? undefined
                    : { rotate: 0, opacity: 1, transition: SPRING_ENTER }
                }
                viewport={{ once: true }}
              >
                <RiSparklingFill className="size-6 text-primary" aria-hidden />
              </motion.span>
              <CardTitle>
                <SectionHeading
                  className="text-white text-2xl font-bold"
                  lead="Wiauto Match"
                />
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <AiSearchForm />
          </CardContent>
        </Card>
      </motion.div>
    </MotionSection>
  );
};
