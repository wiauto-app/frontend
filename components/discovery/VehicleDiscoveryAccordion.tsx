import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { VehicleDiscoveryPillLink } from "./VehicleDiscoveryPillLink";
import type { DiscoveryAccordionSection } from "./types";
import { IconContainer } from "../ui/iconContainer";

interface VehicleDiscoveryAccordionProps {
  sections: DiscoveryAccordionSection[];
}

export const VehicleDiscoveryAccordion = ({
  sections,
}: VehicleDiscoveryAccordionProps) => {
  if (sections.length === 0) {
    return null;
  }

  return (
    <Card size="sm">
      <CardContent>
        <Accordion
          multiple
          defaultValue={sections.map((section) => section.id) }
        >
          {sections.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline items-center gap-2">
                {section.Icon && (
                  <IconContainer Icon={section.Icon} size="xs" />
                )}
                {section.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 p-2">
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
