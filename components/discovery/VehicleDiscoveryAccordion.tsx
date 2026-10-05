import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IconContainer } from "../ui/iconContainer";
import type { DiscoveryAccordionSection } from "./types";
import { resolveDiscoverySectionIcon } from "./utils/resolve-discovery-section-icon";
import { VehicleDiscoveryPillLink } from "./VehicleDiscoveryPillLink";

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
          {sections.map((section) => {
            const SectionIcon = resolveDiscoverySectionIcon(section.id);

            return (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline items-center gap-2">
                {SectionIcon ? (
                  <IconContainer Icon={SectionIcon} size="xs" />
                ) : null}
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
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
};
