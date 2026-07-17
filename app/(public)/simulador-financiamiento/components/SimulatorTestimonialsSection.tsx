"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, User } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { SimuladorTestimonioView } from "../interfaces/simulador-page.interface";

interface SimulatorTestimonialsSectionProps {
  titulo: string;
  testimonios: SimuladorTestimonioView[];
}

export const SimulatorTestimonialsSection = ({
  titulo,
  testimonios,
}: SimulatorTestimonialsSectionProps) => {
  const [startIndex, setStartIndex] = useState(0);

  if (!testimonios.length) {
    return null;
  }

  const visibleCount = Math.min(3, testimonios.length);
  const canNavigate = testimonios.length > visibleCount;

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? Math.max(0, testimonios.length - visibleCount) : prev - 1,
    );
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      prev + visibleCount >= testimonios.length ? 0 : prev + 1,
    );
  };

  const visible = canNavigate
    ? Array.from({ length: visibleCount }, (_, offset) => {
        const index = (startIndex + offset) % testimonios.length;
        return testimonios[index];
      })
    : testimonios;

  return (
    <section className="py-16 lg:py-20" aria-labelledby="testimonios-titulo">
      <div className="mb-10 flex items-center justify-between gap-4">
        <h2
          id="testimonios-titulo"
          className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        >
          {titulo}
        </h2>
        {canNavigate ? (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handlePrev}
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleNext}
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "grid grid-cols-1 gap-5",
          visible.length >= 3
            ? "md:grid-cols-3"
            : visible.length === 2
              ? "md:grid-cols-2"
              : "md:grid-cols-1",
        )}
      >
        {visible.map((item) => (
          <article
            key={item.id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
          >
            <div className="flex gap-0.5" aria-label={`${item.rating} de 5 estrellas`}>
              {Array.from({ length: 5 }, (_, starIndex) => (
                <Star
                  key={starIndex}
                  className={cn(
                    "size-4",
                    starIndex < item.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200",
                  )}
                  aria-hidden
                />
              ))}
            </div>
            <p className="flex-1 text-sm leading-relaxed text-slate-600">
              &ldquo;{item.cita}&rdquo;
            </p>
            <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
              {item.foto.url ? (
                <span className="relative size-10 overflow-hidden rounded-full bg-slate-100">
                  <Image
                    src={item.foto.url}
                    alt={item.foto.alt || item.nombre}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </span>
              ) : (
                <span className="flex size-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <User className="size-5" aria-hidden />
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{item.nombre}</p>
                {item.rol ? (
                  <p className="truncate text-xs text-slate-500">{item.rol}</p>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
