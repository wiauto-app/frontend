import type {
  NewsListItem,
  NewsPaginatedResult,
} from "../types/news.types";
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
    return (
      <p className="py-16 text-center text-slate-500">
        {activeCategorySlug
          ? "No hay noticias en esta categoría."
          : "No hay noticias disponibles."}
      </p>
    );
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
