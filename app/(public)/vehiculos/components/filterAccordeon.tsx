import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { LucideIcon } from "lucide-react";
export const FilterAccordeon = ({
  title,
  children,
  Icon,
}: {
  title: string;
  children: React.ReactNode;
  Icon: LucideIcon;
}) => {
  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex items-center gap-3 font-bold text-base">
            <Icon />
            {title}
          </div>
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
