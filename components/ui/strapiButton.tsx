"use client";

import type { MouseEvent } from "react";
import Link from "next/link";

import { useStrapiAction } from "@/components/strapi-actions/strapi-action-context";
import { StrapiLink } from "@/interfaces/strapi-components.interface";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ChevronRight } from "lucide-react";

interface StrapiButtonProps {
  button: StrapiLink;
  className?: string;
  onFunctionClick?: () => void;
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

export const StrapiButton = ({
  button,
  className,
  onFunctionClick,
}: StrapiButtonProps) => {
  const strapiAction = useStrapiAction();
  const hasActionKey = Boolean(strapiAction?.actionKey);
  const isFunctionButton = Boolean(button.funcion && onFunctionClick);
  const isActionButton = hasActionKey || isFunctionButton;

  const handleActionClick = () => {
    if (hasActionKey) {
      strapiAction?.openAction();
      return;
    }
    onFunctionClick?.();
  };

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

  const renderedButton = (
    <Button
      type="button"
      className={cn("w-full lg:w-auto rounded-xl", className)}
      variant={button.destacado ? "default" : "outline"}
      size="lg"
      onClick={isActionButton ? handleActionClick : undefined}
    >
      {button.label}
      {button.destacado && <ChevronRight />}
    </Button>
  );

  if (isActionButton) {
    return renderedButton;
  }

  return (
    <Link
      target={button.externo ? "_blank" : undefined}
      className="w-full lg:w-auto"
      href={button.url}
      onClick={handleClick}
    >
      {renderedButton}
    </Link>
  );
};
