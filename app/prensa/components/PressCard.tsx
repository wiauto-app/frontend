import Image from "next/image";
import { Calendar, Clock, ExternalLink } from "lucide-react";
import type { PressListItem } from "../types/press.types";

type PressCardProps = {
  item: PressListItem;
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

const formatReadingTime = (value: string | null): string => {
  if (!value) {
    return "";
  }
  return value.toLowerCase().includes("min") ? value : `${value} min. de lectura`;
};

export const PressCard = ({ item }: PressCardProps) => {
  const publisherName = item.publisher?.name ?? "Redacción";
  const readingTimeLabel = formatReadingTime(item.reading_time);

  return (
    <article className="group flex flex-col gap-4">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Leer "${item.title}" (se abre en una nueva pestaña)`}
        className="relative block aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100"
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
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
      </a>

      <div>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/title block"
        >
          <h2 className="flex items-start gap-2 text-xl font-bold leading-tight text-slate-900 transition-colors group-hover/title:text-blue-600">
            <span className="line-clamp-2">{item.title}</span>
            <ExternalLink
              aria-hidden
              className="mt-1 h-4 w-4 shrink-0 text-slate-400 group-hover/title:text-blue-600"
            />
          </h2>
        </a>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            {item.publisher?.image_url ? (
              <span className="relative h-5 w-5 overflow-hidden rounded-full bg-slate-200">
                <Image
                  src={item.publisher.image_url}
                  alt={publisherName}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="20px"
                />
              </span>
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500">
                {publisherName.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="text-slate-700">{publisherName}</span>
          </div>

          {item.published_at ? (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" aria-hidden />
              <time dateTime={item.published_at}>{formatDate(item.published_at)}</time>
            </div>
          ) : null}

          {readingTimeLabel ? (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-400" aria-hidden />
              <span>{readingTimeLabel}</span>
            </div>
          ) : null}
        </div>

        {item.summary ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
            {item.summary}
          </p>
        ) : null}
      </div>
    </article>
  );
};
