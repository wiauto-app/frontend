'use client';

import Link from "next/link";

import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { MarcasSection } from "./MarcasSection";
import { Card, CardContent } from "@/components/ui/card";

import type {
  DynamicZoneBlock,
  CartaVentaja,
} from "@/interfaces/landings-colaboracion.interface";

interface DynamicContentSectionProps {
  blocks?: DynamicZoneBlock[];
  className?: string;
}

/**
 * Renders dynamic zone blocks from Strapi.
 * Supports: hero, carta-ventaja, caracteristicas, marcas
 */
export const DynamicContentSection = ({
  blocks,
  className,
}: DynamicContentSectionProps) => {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "hero":
            return <HeroSection key={idx} hero={block.data as any} />;

          case "caracteristicas":
            return (
              <FeaturesSection
                key={idx}
                data={block.data as any}
                className="mt-12"
              />
            );

          case "marcas":
            return (
              <MarcasSection
                key={idx}
                data={block.data}
                className="mt-12"
              />
            );

          case "carta-ventaja": {
            const cartaData = block.data as unknown as CartaVentaja;
            return (
              <section
                key={idx}
                className="container-custom mx-auto my-12 px-4 sm:px-6"
              >
                <Card className="overflow-hidden border-0 shadow-md">
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                    {/* Text content */}
                    <div className="flex flex-col justify-center">
                      {cartaData.titulo && (
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                          {cartaData.titulo}
                        </h3>
                      )}
                      {cartaData.descripcion && (
                        <p className="text-slate-600 mb-6">
                          {cartaData.descripcion}
                        </p>
                      )}
                      {cartaData.acciones && cartaData.acciones.length > 0 && (
                        <div className="flex flex-col lg:flex-row items-center gap-3 mt-4">
                          {cartaData.acciones.map((action) => (
                            <Link
                              key={action.id}
                              href={action.href ?? "#"}
                              className={`px-6 py-3 rounded-lg font-medium transition-colors w-full lg:w-auto text-center ${
                                action.tipo === "primary"
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : action.tipo === "secondary"
                                    ? "bg-slate-200 text-slate-900 hover:bg-slate-300"
                                    : "text-blue-600 hover:text-blue-700"
                              }`}
                            >
                              {action.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Image content */}
                    {cartaData.imagen && (
                      <div className="flex items-center justify-center">
                        <img
                          src={cartaData.imagen.url}
                          alt={cartaData.imagen.alt}
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
            );
          }

        }
      })}
    </div>
  );
};
