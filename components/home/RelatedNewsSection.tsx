import Image from "next/image";
import Link from "next/link";
import { Calendar, MessageCircle } from "lucide-react";
import { newsService } from "@/app/(landing)/noticias/services/newsService";
import type { NewsListItem } from "@/app/(landing)/noticias/types/news.types";
import { STRAPI_API_URL } from "@/constants/strapi.constants";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";

const HOME_RELATED_NEWS_LIMIT = 4;
const RELATED_NEWS_CATEGORY_SLUG = "novedades";

const FALLBACK_BANNER_URL =
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&q=80&auto=format&fit=crop";

const formatDate = (value: string | null): string => {
  if (!value) {
    return "";
  }
  return new Date(value).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatCommentsLabel = (count: number): string => {
  if (count === 1) {
    return "1 Comentario";
  }
  return `${count} Comentarios`;
};

const isExternalStrapiUrl = (url: string): boolean => {
  if (!STRAPI_API_URL) {
    return false;
  }
  const base_url = STRAPI_API_URL.replace(/\/$/, "");
  return url.startsWith(base_url);
};

export async function RelatedNewsSection() {
  let items: NewsListItem[] = [];

  try {
    const result = await newsService.findAll({
      page: 1,
      page_size: HOME_RELATED_NEWS_LIMIT,
      category_slug: RELATED_NEWS_CATEGORY_SLUG,
    });
    items = result.items;
  } catch {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <SectionContainer className="bg-white py-12 lg:py-16">
      <SectionHeading lead="Novedades del" highlight="mundo automotriz" className="mb-8 sm:mb-10" />

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {items.map((item) => {
          const image_src = item.banner_url ?? FALLBACK_BANNER_URL;

          return (
            <Link
              key={item.document_id}
              href={`/noticias/${item.slug}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_8px_28px_rgba(15,23,42,0.12)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <Image
                  src={image_src}
                  alt={item.title}
                  fill
                  unoptimized={isExternalStrapiUrl(image_src)}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h3 className="line-clamp-3 text-sm font-bold leading-snug text-slate-900 group-hover:text-[#0061F2] sm:text-[15px]">
                  {item.title}
                </h3>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                  {item.published_at && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-3.5" style={{ color: "#8E9AAF" }} aria-hidden />
                      {formatDate(item.published_at)}
                    </span>
                  )}
                  {item.comments_count > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="size-3.5" style={{ color: "#8E9AAF" }} aria-hidden />
                      {formatCommentsLabel(item.comments_count)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </SectionContainer>
  );
}
