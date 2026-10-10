"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";

import { extraServicesIconPack } from "./extraServicesCards.constants";
import type { ExtraServiceCardItem } from "./extraServicesCards.types";

interface ExtraServiceCardProps {
  item: ExtraServiceCardItem;
}

export const ExtraServiceCard = ({ item }: ExtraServiceCardProps) => {
  const Icon =
    resolveStrapiIconName(item.iconName, extraServicesIconPack) ?? Check;

  return (
    <Link
      href={item.href}
      aria-label={item.title}
      {...(item.isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="group relative flex h-full overflow-hidden rounded-3xl bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring "
      style={
        !item.imageUrl && item.backgroundColor
          ? { backgroundColor: item.backgroundColor }
          : undefined
      }
    >
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt=""
          fill
          quality={80}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : null}

      <div className="relative z-10 flex w-full  flex-col p-6 gap-4">
        <h3 className=" text-2xl font-bold leading-tight md:text-3xl">
          {item.title}
        </h3>

        {item.description ? (
          <p className=" text-sm text-muted-foreground md:text-base max-w-[60%]">
            {item.description}
          </p>
        ) : null}

        <span
          className="mt-auto flex size-12 items-center justify-center rounded-full bg-white shadow-sm ring-4 ring-white/60 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          style={{ color: item.accentColor }}
          aria-hidden
        >
          <ArrowRight className="size-5" />
        </span>
      </div>
    </Link>
  );
};
