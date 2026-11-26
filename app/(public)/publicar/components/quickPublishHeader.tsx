"use client";
import { SectionHeading } from "@/components/home/SectionHeading";
import { useEntitlements } from "@/hooks/useEntitlements";
import { CarFront } from "lucide-react";

export const QuickPublishHeader = () => {
  const { isSubscribed } = useEntitlements();
  if (isSubscribed) {
    return null;
  }

  return (
    <div
      id="quick-publish-heading"
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-primary/10 p-2 lg:gap-4"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <CarFront className="size-8 shrink-0 text-primary" />
        <div className="flex min-w-0 flex-col">
          <SectionHeading
            descriptionClassName="text-xs text-muted-foreground text-start"
            className="text-md font-bold text-gray-900 not-sr-only text-start"
            lead="Publica tu coche Gratis"
            description="En menos de 1 minuto"
          />
        </div>
      </div>
    </div>
  );
};
