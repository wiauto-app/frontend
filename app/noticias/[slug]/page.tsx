import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Tag, User, Calendar, Eye } from "lucide-react";
import { CommentForm } from "../components/CommentForm";
import { CommentsList } from "../components/CommentsList";
import { NewsBlocksContent } from "../components/NewsBlocksContent";
import { newsService } from "../services/newsService";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

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

// Social share icons as inline SVGs
const ShareWhatsApp = () => (
  <a
    href="#"
    aria-label="Compartir en WhatsApp"
    className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.554 4.106 1.523 5.828L0 24l6.335-1.502A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.88 9.88 0 01-5.031-1.378l-.36-.214-3.742.981.999-3.648-.235-.374A9.847 9.847 0 012.118 12C2.118 6.527 6.527 2.118 12 2.118S21.882 6.527 21.882 12 17.473 21.882 12 21.882z" />
    </svg>
  </a>
);

const ShareFacebook = () => (
  <a
    href="#"
    aria-label="Compartir en Facebook"
    className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.428c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  </a>
);

const ShareTwitter = () => (
  <a
    href="#"
    aria-label="Compartir en Twitter"
    className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  </a>
);

const ShareLinkedIn = () => (
  <a
    href="#"
    aria-label="Compartir en LinkedIn"
    className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  </a>
);

const SharePinterest = () => (
  <a
    href="#"
    aria-label="Compartir en Pinterest"
    className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  </a>
);

const ShareLink = () => (
  <a
    href="#"
    aria-label="Copiar enlace"
    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-300 text-slate-700 hover:bg-slate-400 transition-colors"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  </a>
);

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;

  let news: Awaited<ReturnType<typeof newsService.findOne>>;

  try {
    news = await newsService.findOne({ slug });
  } catch {
    notFound();
  }

  console.log(news);

  const primary_banner = news.banners[0] ?? null;
  const MOCK_BANNER = "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop";

  // Mock comments for display when no real ones exist
  const mockComments = [
    { document_id: "m1", name: "Annette Black", email: "26 Apr, 2021", text: "In a nisl commodo, porttitor ligula consequat, tincidunt dui. Nulla volutpat, metus eu aliquam malesuada, elit libero venenatis urna, consequat maximus arcu diam non diam." },
    { document_id: "m2", name: "Devon Lane", email: "26 Apr, 2021", text: "Quisque eget tortor lobortis, facilisis metus eu, elementum orci. Nunc ut amet orci at quis ex convallis suscipit. Nam hendrerit, velit ut aliquam euismod, nibh tortor rutrum nisi, ac sodales ante orci nec risus. Sed scelerisque, est eget aliquam venenatis, est sem tempor arcu." },
    { document_id: "m3", name: "Jacob Jones", email: "30 Apr, 2021", text: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae." },
    { document_id: "m4", name: "Jane Cooper", email: "18 Apr, 2021", text: "Pellentesque fauciat, nibh vel vehicula pretium, nibh nibh bibendum elit, a volutpat arcu dui nec orci. Aenean dui odio, ullamcorper quis turpis ac, volutpat imperdiet ex." },
    { document_id: "m5", name: "Darrell Steward", email: "7 Apr, 2021", text: "Nulla molestie interdum ultrices." },
  ];

  const displayComments = news.comments.length > 0 ? news.comments : mockComments;

  return (
    <div className="bg-white min-h-screen">
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
              unoptimized
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          ) : (
            <Image
              src={MOCK_BANNER}
              alt={news.title}
              fill
              unoptimized
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          )}
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold leading-tight text-slate-900 mb-4">
          {news.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6 border-b border-slate-100 pb-5">
          {news.category && (
            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-blue-600">{news.category.name}</span>
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
              <time dateTime={news.published_at}>{formatDate(news.published_at)}</time>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-slate-400" />
            <span>738</span>
          </div>
        </div>

        {/* Publisher profile + share row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Publisher avatar */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 relative">
              {news.publisher?.image_url ? (
                <Image src={news.publisher.image_url} alt={news.publisher.name} fill className="object-cover" unoptimized />
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

          {/* Share buttons */}
          <div className="flex items-center gap-2">
            <ShareWhatsApp />
            <ShareFacebook />
            <ShareTwitter />
            <ShareLinkedIn />
            <SharePinterest />
            <ShareLink />
          </div>
        </div>

        {/* Summary */}
        {news.summary && (
          <p className="text-base leading-relaxed text-slate-700 mb-6">
            {news.summary}
          </p>
        )}

        {/* Citation / blockquote */}
        {news.citation && (
          <blockquote className="my-8 rounded-r-xl border-l-4 border-blue-600 bg-[#E8F0FE] py-5 pl-8 pr-6">
            <span className="block text-4xl font-serif text-blue-400 leading-none mb-2">"</span>
            <p className="text-base font-medium leading-relaxed text-slate-800">
              {news.citation}
            </p>
          </blockquote>
        )}

        {/* Article body */}
        <div className="mt-2">
          <NewsBlocksContent content={news.content} />
        </div>

        {/* ── Comments ── */}
        <section className="mt-14 border-t border-slate-100 pt-10">
          {/* Comment form */}
          <CommentForm
            news_document_id={news.document_id}
            news_slug={news.slug}
          />

          {/* Comments list */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Comentarios</h2>
            <CommentsList comments={displayComments} />
          </div>
        </section>
      </article>
    </div>
  );
}
