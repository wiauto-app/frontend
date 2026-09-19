import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Tag, User, Calendar, Eye } from "lucide-react";

import { FRONTEND_URL } from "@/constants";
import { CommentForm } from "../components/CommentForm";
import { CommentsList } from "../components/CommentsList";
import { NewsBlocksContent } from "../components/NewsBlocksContent";
import { NewsShareButtons } from "../components/NewsShareButtons";
import { newsService } from "../services/newsService";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

const formatDate = (value: string | null): string => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const generateMetadata = async ({
  params,
}: NewsDetailPageProps): Promise<Metadata> => {
  const { slug } = await params;
  try {
    const news = await newsService.findOne({ slug });
    return {
      title: news.seo?.metaTitle ?? news.title,
      description: news.seo?.metaDescription ?? news.summary,
    };
  } catch {
    return { title: "Noticia" };
  }
};

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;

  let news: Awaited<ReturnType<typeof newsService.findOne>>;
  try {
    news = await newsService.findOne({ slug });
  } catch {
    notFound();
  }

  const primary_banner = news.banners[0] ?? null;
  const shareUrl = `${FRONTEND_URL ?? ""}/noticias/${news.slug}`;
  const shareImageUrl = primary_banner?.url;
  const MOCK_BANNER =
    "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className=" min-h-screen">
      {/* ── Blue header zone – extra pb so image can overlap ── */}
      <div className="bg-[#E8F0FE] pb-52">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-4">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <ChevronLeft className="h-4 w-4 -ml-3" />
            Volver a Noticias
          </Link>
        </div>
      </div>

      {/* ── Banner image – pulled up into blue zone with negative margin ── */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-44">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-lg mb-8">
          {primary_banner ? (
            <Image
              src={primary_banner.url}
              alt={primary_banner.alternative_text ?? news.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          ) : (
            <Image
              src={MOCK_BANNER}
              alt={news.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          )}
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
        <h1 className="text-2xl md:text-3xl font-bold leading-tight text-slate-900 mb-4">
          {news.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6 border-b border-slate-100 pb-5">
          {news.category && (
            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-blue-600">
                {news.category.name}
              </span>
            </div>
          )}
          {news.publisher && (
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-slate-400" />
              <span>{news.publisher.name}</span>
            </div>
          )}
          {news.published_at && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              <time dateTime={news.published_at}>
                {formatDate(news.published_at)}
              </time>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 relative">
              {news.publisher?.image_url ? (
                <Image
                  src={news.publisher.image_url}
                  alt={news.publisher.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400 text-xs font-bold bg-slate-200">
                  {(news.publisher?.name ?? "A").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-sm font-semibold text-slate-800">
              {news.publisher?.name ?? "Cameron Williamson"}
            </span>
          </div>

          <NewsShareButtons
            url={shareUrl}
            title={news.title}
            imageUrl={shareImageUrl}
          />
        </div>

        {news.summary && (
          <p className="text-base leading-relaxed text-slate-700 mb-6">
            {news.summary}
          </p>
        )}

        {news.citation && (
          <blockquote className="my-8 rounded-r-xl border-l-4 border-blue-600 bg-[#E8F0FE] py-5 pl-8 pr-6">
            <span className="block text-4xl font-serif text-blue-400 leading-none mb-2">
              &ldquo;
            </span>
            <p className="text-base font-medium leading-relaxed text-slate-800">
              {news.citation}
            </p>
          </blockquote>
        )}

        <div className="mt-2">
          <NewsBlocksContent content={news.content} />
        </div>

        <section className="mt-14 border-t border-slate-100 pt-10">
          <CommentForm
            news_document_id={news.document_id}
            news_slug={news.slug}
          />

          {news.comments && news.comments.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Comentarios
              </h2>
              <CommentsList comments={news.comments} />
            </div>
          )}
        </section>
      </article>
    </div>
  );
}
