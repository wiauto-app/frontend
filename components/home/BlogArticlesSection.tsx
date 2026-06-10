import { newsService } from "@/app/(landing)/noticias/services/newsService";
import type { NewsListItem } from "@/app/(landing)/noticias/types/news.types";
import { ArticlePreviewSection } from "./ArticlePreviewSection";

const HOME_BLOG_ARTICLES_LIMIT = 2;

const FALLBACK_BANNER_URL =
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&q=80&auto=format&fit=crop";

export async function BlogArticlesSection() {
  let items: NewsListItem[] = [];

  try {
    const result = await newsService.findAll({
      page: 1,
      page_size: HOME_BLOG_ARTICLES_LIMIT,
    });
    items = result.items;
  } catch {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white">
      {items.map((item, index) => (
        <ArticlePreviewSection
          key={item.document_id}
          title={item.title}
          excerpt={item.summary ?? ""}
          href={`/noticias/${item.slug}`}
          imageSrc={item.banner_url ?? FALLBACK_BANNER_URL}
          reverse={index % 2 === 1}
          imageAlt={item.title}
        />
      ))}
    </div>
  );
}
