import { newsService } from "./services/newsService";
import { NewsContent } from "./components/NewsContent";
import { NewsCategories } from "./components/newsCategories";
import { parseNewsSearchParams } from "./utils/parse-news-search-params";
import type { NewsCategory, NewsPaginatedResult } from "./types/news.types";
import { LandingHeader } from "@/components/ui/landingHeader";

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    page?: string;
    page_size?: string;
  }>;
}) {
  const params = await searchParams;
  const filters = parseNewsSearchParams(params);

  let items: NewsPaginatedResult["items"] = [];
  let pagination: NewsPaginatedResult["pagination"] = {
    page: filters.page,
    page_size: filters.page_size,
    page_count: 0,
    total: 0,
  };
  let categories: NewsCategory[] = [];
  let error_message: string | null = null;

  try {
    const [newsResult, categoriesResult] = await Promise.all([
      newsService.findAll({
        page: filters.page,
        page_size: filters.page_size,
        category_slug: filters.category_slug,
      }),
      newsService.findAllCategories(),
    ]);

    items = newsResult.items;
    pagination = newsResult.pagination;
    categories = categoriesResult;
  } catch (error) {
    error_message =
      error instanceof Error ? error.message : "Could not load news articles.";
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <LandingHeader title="Noticias" description="Noticias de actualidad" />

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {error_message && items.length === 0 ? (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error_message}
          </div>
        ) : null}

        <NewsCategories
          categories={categories}
          activeCategorySlug={filters.category_slug}
        />

        <NewsContent
          items={items}
          pagination={pagination}
          activeCategorySlug={filters.category_slug}
        />
      </section>
    </div>
  );
}
