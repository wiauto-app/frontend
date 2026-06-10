import { PressContent } from "./components/PressContent";
import { pressService } from "./services/pressService";
import type { PressPaginatedResult } from "./types/press.types";
import { parsePressSearchParams } from "./utils/parse-press-search-params";

export default async function PressPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    page_size?: string;
  }>;
}) {
  const params = await searchParams;
  const filters = parsePressSearchParams(params);

  let items: PressPaginatedResult["items"] = [];
  let pagination: PressPaginatedResult["pagination"] = {
    page: filters.page,
    page_size: filters.page_size,
    page_count: 0,
    total: 0,
  };
  let error_message: string | null = null;

  try {
    const result = await pressService.findAll({
      page: filters.page,
      page_size: filters.page_size,
    });
    items = result.items;
    pagination = result.pagination;
  } catch (error) {
    error_message =
      error instanceof Error
        ? error.message
        : "No se pudieron cargar los artículos de prensa.";
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <section className="bg-[#E8F0FE] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-medium text-slate-800 md:text-5xl lg:text-6xl">
            <span className="relative inline-block">
              Prensa
              <span className="absolute -bottom-2 left-0 h-1 w-3/4 bg-blue-600"></span>
            </span>
            <span className="relative inline-block pl-4 font-bold text-blue-600">
              de actualidad
            </span>
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {error_message && items.length === 0 ? (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error_message}
          </div>
        ) : null}

        <PressContent items={items} pagination={pagination} />
      </section>
    </div>
  );
}
