import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionContainer } from "./SectionContainer";
import { BRAND_BLUE, BRAND_BLUE_LIGHT } from "./data/home-data";

export type ArticlePreviewSectionProps = {
  title: string;
  excerpt: string;
  href: string;
  imageSrc: string;
  reverse?: boolean;
  imageAlt?: string;
};

export function ArticlePreviewSection({
  title,
  excerpt,
  href,
  imageSrc,
  reverse = false,
  imageAlt = "Imagen del artículo",
}: ArticlePreviewSectionProps) {
  return (
    <SectionContainer className="py-4 lg:py-5">
      <div className="grid overflow-hidden rounded-2xl lg:grid-cols-2">
        <div
          className={cn(
            "relative aspect-[4/3] min-h-[240px] lg:aspect-auto lg:min-h-[320px]",
            reverse && "lg:order-2",
          )}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div
          className={cn(
            "flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-14",
            reverse && "lg:order-1",
          )}
          style={{ backgroundColor: BRAND_BLUE_LIGHT }}
        >
          <h3 className="text-xl font-bold leading-snug text-slate-800 sm:text-2xl lg:text-[1.65rem]">
            {title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{excerpt}</p>
          <Link
            href={href}
            className="mt-6 inline-flex w-fit items-center justify-center rounded-lg px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            Leer más
          </Link>
        </div>
      </div>
    </SectionContainer>
  );
}
