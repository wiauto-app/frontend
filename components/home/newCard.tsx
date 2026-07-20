import type { NewsListItem } from "@/app/(landing)/noticias/types/news.types";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type NewCardVariant = "default" | "featured";

type NewCardProps = {
  item: NewsListItem;
  className?: string;
  variant?: NewCardVariant;
};

const formatDate = (value: string | null): string => {
  if (!value) return "";

  return new Date(value).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatCommentsLabel = (count: number): string => {
  return count === 1 ? "1 Comentario" : `${count} Comentarios`;
};

export const NewCard = ({
  item,
  className,
  variant = "default",
}: NewCardProps) => {
  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/noticias/${item.slug}`}
      className={cn(
        "rounded-lg overflow-hidden",
        "hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(15,23,42,0.12)] transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isFeatured ? "lg:col-span-2" : "col-span-1",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          isFeatured
            ? "h-full min-h-[220px] sm:min-h-[260px] lg:min-h-0"
            : "aspect-4/5",
        )}
      >
        <Image
          src={item.banner_url || ""}
          alt={item.title}
          fill
          // className="home-card-image object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          className="object-cover rounded-lg overflow-hidden"
          sizes={
            isFeatured
              ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          }
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,.9) 0%, rgba(0,0,0,.55) 35%, rgba(0,0,0,.15) 65%, transparent 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 z-10 p-5">
          <h3
            className={cn(
              "line-clamp-2 font-bold text-white drop-shadow-lg",
              isFeatured ? "text-xl lg:text-2xl" : "text-lg",
            )}
          >
            {item.title}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
            {item.published_at && (
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                <span>{formatDate(item.published_at)}</span>
              </div>
            )}

            {item.comments_count > 0 && (
              <div className="flex items-center gap-1.5">
                <MessageCircle className="size-4" />
                <span>{formatCommentsLabel(item.comments_count)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
