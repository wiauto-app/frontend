import type { StrapiCard } from "@/interfaces/strapi-components.interface";
import { cn } from "@/lib/utils";

import { ExtraServiceCard } from "./ExtraServiceCard";
import { mapExtraServicesCards } from "./mapExtraServicesCards";

interface ExtraServicesCardsProps {
  /** `homepage.servicios_extra` (shared.carta-ventaja repetible). */
  data: StrapiCard[] | null | undefined;
  className?: string;
}

/** Grid 2x2 de servicios extra del home, alimentado por Strapi con fallback legacy. */
export const ExtraServicesCards = ({ data, className }: ExtraServicesCardsProps) => {
  const items = mapExtraServicesCards(data);

  return (
    <section
      className={cn("grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-3", className)}
    >
      {items.map((item) => (
        <div key={item.id} className="h-full">
          <ExtraServiceCard item={item} />
        </div>
      ))}
    </section>
  );
};
