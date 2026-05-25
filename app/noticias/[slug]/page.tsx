import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentForm } from "../components/CommentForm";
import { CommentsList } from "../components/CommentsList";
import { NewsBlocksContent } from "../components/NewsBlocksContent";
import { newsService } from "../services/newsService";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
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
    return { title: "News" };
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

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/noticias"
        className="text-sm font-medium text-[#0061F2] hover:underline"
      >
        ← Back to news
      </Link>

      {news.category ? (
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-[#0061F2]">
          {news.category.name}
        </p>
      ) : null}

      <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
        {news.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        {news.published_at ? <time dateTime={news.published_at}>{formatDate(news.published_at)}</time> : null}
        {news.publisher ? (
          <span>
            By <span className="font-medium text-slate-700">{news.publisher.name}</span>
          </span>
        ) : null}
        {news.is_featured ? (
          <span className="rounded-full bg-[#0061F2]/10 px-2 py-0.5 text-xs font-semibold text-[#0061F2]">
            Featured
          </span>
        ) : null}
      </div>

      {primary_banner ? (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={primary_banner.url}
            alt={primary_banner.alternative_text ?? news.title}
            fill
            unoptimized
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      ) : null}

      <p className="mt-8 text-lg leading-relaxed text-slate-600">{news.summary}</p>

      {news.citation ? (
        <blockquote className="mt-6 border-l-4 border-[#0061F2] pl-4 italic text-slate-600">
          {news.citation}
        </blockquote>
      ) : null}

      <div className="mt-10 border-t border-slate-200 pt-10">
        <NewsBlocksContent content={news.content} />
      </div>

      <section className="mt-12 space-y-8 border-t border-slate-200 pt-10">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Comments ({news.comments.length})
          </h2>
          <div className="mt-4">
            <CommentsList comments={news.comments} />
          </div>
        </div>

        <CommentForm
          news_document_id={news.document_id}
          news_slug={news.slug}
        />
      </section>
    </article>
  );
}
