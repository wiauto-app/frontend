import { EmptyContent } from "@/components/ui/emptyContent";
import type { NewsListItem, NewsPaginatedResult } from "../types/news.types";
import { NewsCard } from "./NewsCard";
import { NewsPagination } from "./NewsPagination";

type NewsContentProps = {
  items: NewsListItem[];
  pagination: NewsPaginatedResult["pagination"];
  activeCategorySlug?: string;
};

export const NewsContent = ({
  items,
  pagination,
  activeCategorySlug,
}: NewsContentProps) => {
  if (items.length === 0) {
    return <EmptyContent title="No hay noticias disponibles" description="No hay noticias disponibles" />;
  }

  return (
    <>
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <NewsCard key={item.document_id} item={item} />
        ))}
      </div>

      <NewsPagination pagination={pagination} />
    </>
  );
};
