import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { VehicleDiscoveryPillLink } from "./VehicleDiscoveryPillLink";
import type { DiscoveryAccordionSection } from "./types";

interface VehicleDiscoveryAccordionProps {
  sections: DiscoveryAccordionSection[];
  className?: string;
}

export const VehicleDiscoveryAccordion = ({
  sections,
  className,
}: VehicleDiscoveryAccordionProps) => {
  if (sections.length === 0) {
    return null;
  }

  return (
    <Card className={cn("border-0 bg-white shadow-none", className)} size="sm">
      <CardContent className="p-0">
        <Accordion defaultValue={[sections[0]?.id ?? ""]}>
          {sections.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="px-4 text-base font-semibold text-foreground hover:no-underline">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <div className="flex flex-wrap gap-2 pb-2">
                  {section.pills.map((pill) => (
                    <VehicleDiscoveryPillLink
                      key={`${section.id}-${pill.href}`}
                      pill={pill}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
