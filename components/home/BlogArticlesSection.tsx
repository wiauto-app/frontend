import { ArticlePreviewSection } from "./ArticlePreviewSection";
import { BLOG_ARTICLES } from "./data/home-data";

export function BlogArticlesSection() {
  return (
    <div className="bg-white">
      {BLOG_ARTICLES.map((article) => (
        <ArticlePreviewSection
          key={article.id}
          title={article.title}
          excerpt={article.excerpt}
          href={article.href}
          imageSrc={article.imageSrc}
          reverse={article.reverse}
        />
      ))}
    </div>
  );
}
