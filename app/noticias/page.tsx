import Link from "next/link";
import { newsService } from "./services/newsService";
import { NewsCard } from "./components/NewsCard";

export default async function NewsPage() {
  let items: Awaited<ReturnType<typeof newsService.findAll>>["items"] = [];
  let error_message: string | null = null;

  try {
    const result = await newsService.findAll({ page: 1, page_size: 12 });
    items = result.items;
  } catch (error) {
    error_message =
      error instanceof Error ? error.message : "Could not load news articles.";
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0061F2]">
            WiAuto
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">News</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Latest articles from Strapi. Click an item to read the full story and
            leave a comment.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-[#0061F2] hover:underline"
        >
          Back to home
        </Link>
      </div>

      {error_message ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error_message}
        </div>
      ) : null}

      {!error_message && items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
          No published articles yet.
        </div>
      ) : null}

      {items.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <NewsCard key={item.document_id} item={item} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
