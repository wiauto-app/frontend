"use client";

import { Loader2, SearchIcon, SparklesIcon } from "lucide-react";
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

const MIN_QUERY_LENGTH = 3;

interface AiSearchFormProps {
  className?: string;
  /** Controles extra (ordenar, filtros…). En desktop van dentro del input; en mobile no. */
  endContent?: React.ReactNode;
  showLabel?: boolean;
  showExamples?: boolean;
}

export const AiSearchForm = ({
  className,
  endContent,
  showLabel = true,
  showExamples = true,
}: AiSearchFormProps) => {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const examples = [
    "Híbridos",
    "Diésel manual",
    "Diésel automático",
    "Gasolina automático con techo solar y cuero",
    "Con navegador y techo solar",
    "Compactos con aire acondicionado y cámara de aparcamiento",
  ];

  const trimmedQuery = query.trim();
  const isQueryTooShort =
    trimmedQuery.length > 0 && trimmedQuery.length < MIN_QUERY_LENGTH;
  const canSubmit = trimmedQuery.length >= MIN_QUERY_LENGTH && !isLoading;
  const hasEndContent = Boolean(endContent);

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
    <div className={cn("w-full min-w-0", className)}>
      <div className="space-y-4">
        {showLabel ? (
          <p className="text-white">
            Cuéntanos qué buscas y nuestra IA encontrará el coche ideal para ti.
          </p>
        ) : null}

        <form className="space-y-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <div className="relative flex items-center">
              <SearchIcon
                className="pointer-events-none absolute left-4 z-10 size-5 text-muted-foreground"
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
                className={cn(
                  "h-12 rounded-full bg-white pl-12",
                  hasEndContent ? "pr-14 md:pr-52" : "pr-14 md:pr-40",
                )}
                aria-label="Describe el vehículo que buscas"
                aria-invalid={Boolean(error)}
                disabled={isLoading}
              />
              <div className="absolute right-2 inline-flex items-center gap-1.5">
                <Button
                  type="submit"
                  size="sm"
                  className="shrink-0 rounded-full transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
                  disabled={!canSubmit}
                  aria-busy={isLoading}
                  aria-label="Buscar con IA"
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <SparklesIcon className="size-4" aria-hidden />
                  )}
                  <span className="hidden md:inline">Buscar con IA</span>
                </Button>
                {hasEndContent ? (
                  <div className="hidden items-center gap-1.5 md:flex">
                    {endContent}
                  </div>
                ) : null}
              </div>
            </div>

            {!hasEndContent ? (
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
            ) : null}
          </div>

          {(error || isQueryTooShort) && (
            <p
              className={cn(
                "text-sm",
                showLabel ? "text-red-200" : "text-red-600",
              )}
              role="alert"
            >
              {error ??
                `Escribe al menos ${MIN_QUERY_LENGTH} caracteres para buscar.`}
            </p>
          )}
        </form>

        {showExamples ? (
          <div className="flex flex-wrap gap-2">
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
          </div>
        ) : null}
      </div>
    </div>
  );
};
