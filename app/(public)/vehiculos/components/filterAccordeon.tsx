import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { LucideIcon } from "lucide-react";

interface FilterAccordeonProps {
  sectionId: string;
  title: string;
  children: React.ReactNode;
  Icon: LucideIcon;
}

export const FilterAccordeon = ({
  sectionId,
  title,
  children,
  Icon,
}: FilterAccordeonProps) => {
  return (
    <AccordionItem value={sectionId}>
      <AccordionTrigger>
        <div className="flex items-center gap-3 text-base font-bold">
          <Icon aria-hidden />
          <span>{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
};
