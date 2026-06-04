"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, UserCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import type { PressListItem } from "../types/press.types";

const FILTERS = [
  "Travel",
  "Lifestyle",
  "Fashion",
  "Technology",
  "Business",
  "Design",
  "Health",
  "Food",
  "Art",
];

// Imágenes de autos reales para el mock
const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=800&auto=format&fit=crop",
];

const MOCK_TITLES = [
  "Loremp Ipsum Loremp Set Impus Set Loremp Ipsum",
  "Loremp Ipsum Loremp Set Impus Set Loremp Ipsum",
  "Loremp Ipsum Loremp Set Impus Set Loremp Ipsum",
  "Loremp Ipsum Loremp Set Impus Set Loremp Ipsum",
  "Loremp Ipsum Loremp Set Impus Set Loremp Ipsum",
  "Loremp Ipsum Loremp Set Impus Set Loremp Ipsum",
];

const formatDate = (value: string | null): string => {
  if (!value) return "02 Diciembre 2022";
  return new Date(value).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

type DisplayItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  published_at: string | null;
  category_name: string;
  banner_url: string | null;
};

export const PressContent = ({ initialItems }: { initialItems: PressListItem[] }) => {
  const [activeFilter, setActiveFilter] = useState<string>("Technology");
  const MOCK_BANNER = "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop";

  // Construir lista para mostrar
  const displayItems: DisplayItem[] =
    initialItems.length > 0
      ? initialItems.map((item) => ({
          id: item.document_id,
          slug: item.slug,
          title: item.title,
          summary: item.summary ?? "",
          published_at: item.published_at,
          category_name: item.category?.name ?? "Actualidad",
          banner_url: item.banner_url,
        }))
      : Array.from({ length: 6 }, (_, i) => ({
          id: `mock-${i}`,
          slug: `mock-slug-${i}`,
          title: MOCK_TITLES[i % MOCK_TITLES.length],
          summary:
            "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...",
          published_at: new Date().toISOString(),
          category_name: "Actualidad",
          banner_url: i % 2 === 0 ? MOCK_BANNER : MOCK_IMAGES[i % MOCK_IMAGES.length],
        }));

  return (
    <>
      {/* ── Filtros ── */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-10 scrollbar-hide">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() =>
              setActiveFilter(filter === activeFilter ? "" : filter)
            }
            className={`flex-shrink-0 px-5 py-1.5 rounded border text-sm font-medium transition-all duration-200 ${
              filter === activeFilter
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ── Grid de Cards ── */}
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {displayItems.map((item) => (
          <article key={item.id} className="group flex flex-col gap-3">
            {/* Imagen */}
            <Link
              href={`/prensa/${item.slug}`}
              className="block overflow-hidden rounded-2xl relative aspect-[16/9] bg-slate-100"
            >
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
                <div className="flex h-full items-center justify-center text-sm text-slate-400 bg-slate-200">
                  Sin imagen
                </div>
              )}
            </Link>

            {/* Contenido */}
            <div>
              {/* Categoría */}
              <span className="inline-block rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-2">
                {item.category_name}
              </span>

              {/* Título */}
              <Link href={`/prensa/${item.slug}`} className="block">
                <h2 className="text-[17px] font-bold leading-snug text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {item.title}
                </h2>
              </Link>

              {/* Meta */}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-slate-500">
                <div className="flex items-center gap-1">
                  <UserCircle2 className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-slate-600">Jesica Koli</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{formatDate(item.published_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>3 Min. To Read</span>
                </div>
              </div>

              {/* Descripción */}
              <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-slate-600">
                {item.summary}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* ── Paginación ── */}
      {displayItems.length > 0 && (
        <div className="mt-20 flex items-center justify-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                n === 1
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {String(n).padStart(2, "0")}
            </button>
          ))}
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};
