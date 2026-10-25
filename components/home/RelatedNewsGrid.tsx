import type { NewsListItem } from "@/app/(landing)/noticias/types/news.types";
import { cn } from "@/lib/utils";

import { NewCard } from "./newCard";

interface RelatedNewsGridProps {
  items: NewsListItem[];
}

export const RelatedNewsGrid = ({ items }: RelatedNewsGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:auto-rows-[minmax(180px,1fr)] lg:grid-cols-4 lg:max-h-96">
      {items.map((item, index) => {
        const isFeatured = index === 0;

        return (
          <div
            key={item.document_id}
            className={cn(
              isFeatured && "sm:col-span-2 lg:col-span-2 lg:row-span-2",
            )}
          >
            <NewCard item={item} variant={isFeatured ? "featured" : "default"} />
          </div>
        );
      })}
    </div>
  );
};
