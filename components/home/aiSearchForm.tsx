"use client";

import { Loader2, SearchIcon, SparklesIcon } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type KeyboardEvent } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { buildAiSearchListingHref } from "@/lib/vehicles/listing-url";
import {
  AiSearchFiltersError,
  isAiSearchFiltersRateLimited,
  resolveAiSearchFilters,
} from "@/services/search/aiSearchFiltersService";

import {
  getVariant,
  HERO_DELAYS,
  STAGGER_CHILDREN_FAST,
  staggerContainer,
  staggerItem,
} from "./motion";
import { usePrefersReducedMotion } from "./motion/usePrefersReducedMotion";

const MIN_QUERY_LENGTH = 3;

interface AiSearchFormProps {
  className?: string;
}

export const AiSearchForm = ({ className }: AiSearchFormProps) => {
  const router = useRouter();
  const prefersReducedMotion = usePrefersReducedMotion();
  const chipsContainer = getVariant(staggerContainer, prefersReducedMotion);
  const chipItem = getVariant(staggerItem, prefersReducedMotion);

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const examples = [
    "SUV familiares",
    "Económicos",
    "Eléctricos",
    "4x4",
    "Coches de deportivos",
  ];

  const trimmedQuery = query.trim();
  const isQueryTooShort =
    trimmedQuery.length > 0 && trimmedQuery.length < MIN_QUERY_LENGTH;
  const canSubmit = trimmedQuery.length >= MIN_QUERY_LENGTH && !isLoading;

  const handleSearch = async (searchMessage: string) => {
    const message = searchMessage.trim();

    if (message.length < MIN_QUERY_LENGTH) {
      setError(`Escribe al menos ${MIN_QUERY_LENGTH} caracteres para buscar.`);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const filters = await resolveAiSearchFilters(message);
      const href = buildAiSearchListingHref(message, filters);
      router.push(href);
    } catch (searchError: unknown) {
      if (
        searchError instanceof AiSearchFiltersError &&
        isAiSearchFiltersRateLimited(searchError)
      ) {
        setError(searchError.message);
        return;
      }

      setError("No pudimos procesar tu búsqueda. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSearch(query);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    void handleSearch(query);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setError(null);
    void handleSearch(example);
  };

  return (
    <div className={cn(className)}>
      <div className="space-y-4">
        <p className="text-white">
          Cuéntanos qué buscas y nuestra IA encontrará el coche ideal para tí.
        </p>

        <form className="space-y-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 md:relative md:block">
            <div className="relative flex items-center">
              <SearchIcon
                className="pointer-events-none absolute left-4 size-5 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  if (error) {
                    setError(null);
                  }
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Ej: Busco un SUV automático, año 2020 en adelante, menos de 30.000€"
                className="h-12 bg-white pl-12 pr-4 md:pr-36"
                aria-label="Describe el vehículo que buscas"
                aria-invalid={Boolean(error)}
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="hidden transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 md:absolute md:right-2 md:inline-flex"
                disabled={!canSubmit}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <SparklesIcon className="size-4" aria-hidden />
                )}
                Buscar con IA
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 md:hidden"
              disabled={!canSubmit}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <SparklesIcon className="size-4" aria-hidden />
              )}
              Buscar con IA
            </Button>
          </div>

          {(error || isQueryTooShort) && (
            <p className="text-sm text-red-200" role="alert">
              {error ??
                `Escribe al menos ${MIN_QUERY_LENGTH} caracteres para buscar.`}
            </p>
          )}
        </form>

        <motion.div
          className="flex flex-wrap gap-2"
          initial="hidden"
          animate="visible"
          variants={chipsContainer}
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  delayChildren: HERO_DELAYS.aiChips,
                  staggerChildren: STAGGER_CHILDREN_FAST,
                }
          }
        >
          {examples.map((example) => (
            <Button
              key={example}
              type="button"
              variant="outline"
              className="rounded-full transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-white/80 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              size="xs"
              disabled={isLoading}
              onClick={() => handleExampleClick(example)}
              aria-label={`Buscar: ${example}`}
            >
              {example}
            </Button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
