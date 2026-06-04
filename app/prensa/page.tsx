import Link from "next/link";
import Image from "next/image";
import { pressService } from "./services/pressService";
import { PressContent } from "./components/PressContent";

export default async function PressPage() {
  let items: Awaited<ReturnType<typeof pressService.findAll>>["items"] = [];
  let error_message: string | null = null;

  try {
    const result = await pressService.findAll({ page: 1, page_size: 13 });
    items = result.items;
  } catch (error) {
    error_message =
      error instanceof Error ? error.message : "Could not load press articles.";
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <section className="bg-[#E8F0FE] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-slate-800">
            <span className="relative inline-block">
              Prensa<span className="absolute -bottom-2 left-0 w-3/4 h-1 bg-blue-600"></span>
            </span>
            <span className="font-bold text-blue-600 relative inline-block pl-4">
              de actualidad
            </span>
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {error_message && items.length === 0 ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-8">
            {error_message}
          </div>
        ) : null}

        <PressContent initialItems={items} />
      </section>
    </div>
  );
}
