"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { useStrapiAction } from "@/components/strapi-actions/strapi-action-context";
import { IconContainer } from "@/components/ui/iconContainer";
import { Input } from "@/components/ui/input";
import type { StrapiLink, StrapiMarcas } from "@/interfaces/strapi-components.interface";
import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";
import { getStrapiMediaUrl } from "@/lib/strapi-media";

interface MarcasSectionProps {
  data?: StrapiMarcas;
  className?: string;
}

interface BrandTileProps {
  brand: StrapiLink;
  onAction: () => void;
  hasAction: boolean;
}

const BrandTile = ({ brand, onAction, hasAction }: BrandTileProps) => {
  const image_url = getStrapiMediaUrl(brand.imagen?.url);
  const Icon = resolveStrapiIconName(brand.iconName, defaultStrapiIconPack);
  const is_action = Boolean(brand.funcion && hasAction);

  const content = image_url ? (
    <img
      src={image_url}
      alt={brand.label}
      className="h-20 w-full object-contain"
    />
  ) : Icon ? (
    <IconContainer Icon={Icon} justIcon size="lg" />
  ) : null;

  const class_name =
    "flex h-full items-center justify-center px-2 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0061F2]";

  if (is_action) {
    return (
      <button type="button" className={class_name} onClick={onAction}>
        {content}
      </button>
    );
  }

  if (!brand.url) {
    return <div className={class_name}>{content}</div>;
  }

  return (
    <Link
      href={brand.url}
      className={class_name}
      target={brand.externo ? "_blank" : undefined}
      rel={brand.externo ? "noopener noreferrer" : undefined}
    >
      {content}
    </Link>
  );
};

export const MarcasSection = ({ data, className }: MarcasSectionProps) => {
  const [query, setQuery] = useState("");
  const strapi_action = useStrapiAction();
  const brands = useMemo(() => data?.marcas ?? [], [data?.marcas]);

  const visible_brands = useMemo(() => {
    const normalized_query = query.trim().toLocaleLowerCase("es");
    if (!normalized_query) {
      return brands;
    }

    return brands.filter((brand) =>
      brand.label.toLocaleLowerCase("es").includes(normalized_query),
    );
  }, [brands, query]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const handleAction = () => {
    strapi_action?.openAction();
  };

  if (!data || brands.length === 0) {
    return null;
  }

  const search_field = data.header?.busqueda;

  return (
    <section className={className}>
      <div className="container-custom mx-auto px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          {data.header?.titulo ? (
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-4xl">
              {data.header.titulo}
            </h2>
          ) : null}
          {data.header?.descripcion ? (
            <p className="mt-3 text-slate-500">{data.header.descripcion}</p>
          ) : null}
        </div>

        {search_field ? (
          <label className="mx-auto mt-6 block max-w-md text-left">
            {search_field.label ? (
              <span className="mb-2 block text-sm font-medium text-slate-700">
                {search_field.label}
              </span>
            ) : null}
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <Input
                value={query}
                placeholder={search_field.placeholder ?? undefined}
                aria-label={
                  search_field.label ??
                  search_field.placeholder ??
                  "Buscar marcas"
                }
                className="bg-white pl-9"
                onChange={(event) => handleQueryChange(event.target.value)}
              />
            </div>
          </label>
        ) : null}

        {visible_brands.length === 0 ? (
          <p className="mt-8 text-center text-sm text-slate-500">
            Ninguna marca coincide con la búsqueda.
          </p>
        ) : (
          <ul className="mx-auto mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {visible_brands.map((brand) => (
              <li key={brand.id}>
                <BrandTile
                  brand={brand}
                  hasAction={Boolean(strapi_action?.actionKey)}
                  onAction={handleAction}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
