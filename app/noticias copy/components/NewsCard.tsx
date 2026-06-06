import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, UserCircle2 } from "lucide-react";
import type { NewsListItem } from "../types/news.types";

type NewsCardProps = {
  item: NewsListItem;
};

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

export const NewsCard = ({ item }: NewsCardProps) => {
  return (
    <article className="group flex flex-col gap-4">
      <Link href={`/noticias/${item.slug}`} className="block overflow-hidden rounded-2xl relative aspect-[16/9] bg-slate-100">
        {item.banner_url ? (
          <Image
            src={item.banner_url}
            alt={item.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Sin imagen
          </div>
        )}
      </Link>
      
      <div>
        <div className="flex items-center mb-2">
          <span className="inline-block rounded bg-blue-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-600">
            {item.category?.name || "Actualidad"}
          </span>
        </div>
        
        <Link href={`/noticias/${item.slug}`} className="block">
          <h2 className="text-xl font-bold leading-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h2>
        </Link>
        
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <UserCircle2 className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700">Jesica Koli</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>{formatDate(item.published_at)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>3 Min. de lectura</span>
          </div>
        </div>
        
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
          {item.summary || "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s..."}
        </p>
      </div>
    </article>
  );
};
