import Image from "next/image";
import Link from "next/link";
import type { NewsListItem } from "../types/news.types";

type NewsCardProps = {
  item: NewsListItem;
};

const formatDate = (value: string | null): string => {
  if (!value) {
    return "";
  }
  return new Date(value).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const NewsCard = ({ item }: NewsCardProps) => {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/noticias/${item.slug}`} className="block">
        <div className="relative aspect-[16/9] bg-slate-100">
          {item.banner_url ? (
            <Image
              src={item.banner_url}
              alt={item.title}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Sin imagen
            </div>
          )}
          {item.is_featured ? (
            <span className="absolute left-3 top-3 rounded-full bg-[#0061F2] px-2.5 py-1 text-xs font-semibold text-white">
              Destacada
            </span>
          ) : null}
        </div>
        <div className="p-5">
          {item.category ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0061F2]">
              {item.category.name}
            </p>
          ) : null}
          <h2 className="mt-2 text-lg font-bold leading-snug text-slate-900">
            {item.title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
            {item.summary}
          </p>
          {item.published_at ? (
            <p className="mt-4 text-xs text-slate-400">{formatDate(item.published_at)}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
};
