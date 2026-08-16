"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface VirtualizedAccordionListProps<T> {
  items: T[];
  getItemKey: (item: T) => string | number;
  getItemValue: (item: T) => string;
  openValues: string[];
  onOpenValuesChange: (value: string | string[]) => void;
  renderTrigger: (item: T) => ReactNode;
  renderContent: (item: T, isOpen: boolean) => ReactNode;
  estimateSize?: number;
  overscan?: number;
  gap?: number;
  className?: string;
}

export const VirtualizedAccordionList = <T,>({
  items,
  getItemKey,
  getItemValue,
  openValues,
  onOpenValuesChange,
  renderTrigger,
  renderContent,
  estimateSize = 56,
  overscan = 6,
  gap = 8,
  className = "max-h-50 overflow-y-auto",
}: VirtualizedAccordionListProps<T>) => {
  const scroll_ref = useRef<HTMLDivElement>(null);
  const open_value_set = new Set(openValues);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scroll_ref.current,
    estimateSize: () => estimateSize,
    overscan,
    gap,
  });

  useEffect(() => {
    virtualizer.measure();
  }, [items.length, openValues, virtualizer]);

  const virtual_items = virtualizer.getVirtualItems();

  return (
    <div ref={scroll_ref} className={className}>
      <Accordion
        multiple={false}
        value={openValues}
        onValueChange={onOpenValuesChange}
        className="w-full"
      >
        <div
          className="relative w-full"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtual_items.map((virtual_item) => {
            const item = items[virtual_item.index];
            if (!item) {
              return null;
            }

            const item_value = getItemValue(item);
            const is_open = open_value_set.has(item_value);

            return (
              <div
                key={getItemKey(item)}
                data-index={virtual_item.index}
                ref={virtualizer.measureElement}
                className="absolute top-0 left-0 w-full"
                style={{
                  transform: `translateY(${virtual_item.start}px)`,
                }}
              >
                <AccordionItem
                  className="rounded-md border px-2"
                  value={item_value}
                >
                  <AccordionTrigger className="py-2 **:data-[slot=accordion-trigger-icon]:text-primary!">
                    {renderTrigger(item)}
                  </AccordionTrigger>
                  <AccordionContent>
                    {renderContent(item, is_open)}
                  </AccordionContent>
                </AccordionItem>
              </div>
            );
          })}
        </div>
      </Accordion>
    </div>
  );
};
