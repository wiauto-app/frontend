import Image from "next/image";
import { FaLeaf } from "react-icons/fa";

import { cn } from "@/lib/utils";

import { renderHighlightedDiscoveryTitle } from "./renderHighlightedDiscoveryTitle";
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
}

export const VehicleDiscoveryMotionContent = ({
  title,
  description,
  imageUrl,
  quickLinks,
  sections,
  className,
}: VehicleDiscoveryMotionContentProps) => {
  return (
    <section
      className={cn(className, "flex flex-col space-y-4 overflow-x-clip")}
      aria-labelledby="vehicle-discovery-title"
    >
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-5 lg:items-start">
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
        </div>
        <div className="overflow-hidden rounded-xl">
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
        </div>
      </div>

      {quickLinks && quickLinks.length > 0 ? (
        <VehicleDiscoveryQuickCards quickLinks={quickLinks} />
      ) : null}

      <VehicleDiscoveryAccordion sections={sections} />
    </section>
  );
};
