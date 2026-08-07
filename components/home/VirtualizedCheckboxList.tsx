"use client";

import { useRef, type ReactNode } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface VirtualizedCheckboxListProps<T> {
  items: T[];
  getItemKey: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
  estimateSize?: number;
  overscan?: number;
  gap?: number;
  className?: string;
}

export const VirtualizedCheckboxList = <T,>({
  items,
  getItemKey,
  renderItem,
  estimateSize = 36,
  overscan = 8,
  gap = 8,
  className = "max-h-56 overflow-y-auto",
}: VirtualizedCheckboxListProps<T>) => {
  const scroll_ref = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scroll_ref.current,
    estimateSize: () => estimateSize,
    overscan,
    gap,
  });

  if (items.length === 0) {
    return null;
  }

  return (
    <div ref={scroll_ref} className={className}>
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtual_item) => {
          const item = items[virtual_item.index];
          if (!item) {
            return null;
          }

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
              {renderItem(item)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
