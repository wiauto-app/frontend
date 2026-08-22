"use client";

import type { MouseEvent } from "react";
import Link from "next/link";

import { StrapiLink } from "@/interfaces/strapi-components.interface";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface StrapiButtonProps {
  button: StrapiLink;
  className?: string;
}

const getSamePageHashId = (href: string): string | null => {
  if (!href.includes("#")) {
    return null;
  }

  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) {
      return null;
    }
    if (url.pathname !== window.location.pathname) {
      return null;
    }

    const hashId = url.hash.replace(/^#/, "");
    return hashId || null;
  } catch {
    return null;
  }
};

const scrollToHashTarget = (hashId: string): boolean => {
  const target = document.getElementById(hashId);
  if (!target) {
    return false;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });

  if (window.location.hash !== `#${hashId}`) {
    window.history.pushState(null, "", `#${hashId}`);
  }

  return true;
};

export const StrapiButton = ({ button, className }: StrapiButtonProps) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const hashId = getSamePageHashId(button.url);
    if (!hashId) {
      return;
    }

    if (scrollToHashTarget(hashId)) {
      event.preventDefault();
    }
  };

  return (
    <Link className="w-full lg:w-auto" href={button.url} onClick={handleClick}>
      <Button
        className={cn(
          className,

          button.destacado
            ? "bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all text-xs sm:text-sm"
            : "bg-white/90 backdrop-blur-xs border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-6 py-3 rounded-xl transition-all text-xs sm:text-sm shadow-2xs",
        )}
        variant={button.destacado ? "default" : "outline"}
        size="lg"
      >
        {button.label}
      </Button>
    </Link>
  );
};
