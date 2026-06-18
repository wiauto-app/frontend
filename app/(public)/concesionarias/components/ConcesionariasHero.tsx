"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { useDealersListingFilters } from "../hooks/useDealersListingFilters";
import { Button } from "@/components/ui/button";

const HERO_BG =
  "https://images.unsplash.com/photo-1562519819-016195667493?auto=format&fit=crop&w=1920&q=80";

export function ConcesionariasHero() {
  const { filters, commitFilters } = useDealersListingFilters();
  const [query, setQuery] = useState(filters.query ?? "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    commitFilters({ ...filters, query: query.trim() || undefined, page: 1 });
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${HERO_BG}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#001B3D]/95 via-[#001B3D]/80 to-[#001B3D]/60" />

      <div className="relative z-10 container-custom mx-auto px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              Concesionarios
            </h1>
            <p className="mt-3 max-w-xl text-base text-blue-100 sm:text-lg">
              Encuentra concesionarios verificados y confiables cerca de ti.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 flex max-w-2xl items-stretch overflow-hidden rounded-xl bg-white shadow-xl"
            >
              <input
                id="concesionaria-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar concesionarios..."
                className="min-w-0 flex-1 px-4 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:px-5 sm:text-base"
              />
              <Button
                type="submit"
                id="concesionaria-search-btn"
                className="h-auto shrink-0 rounded-none bg-[#0061F2] px-5 hover:bg-[#0050c8] sm:px-6"
                aria-label="Buscar concesionarios"
              >
                <Search className="size-5" />
              </Button>
            </form>
          </div>

          <Link
            href="/registrar-concesionario"
            id="eres-concesionario-btn"
            className="hidden shrink-0 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 lg:inline-flex"
          >
            ¿Eres concesionario?
          </Link>
        </div>
      </div>
    </div>
  );
}
