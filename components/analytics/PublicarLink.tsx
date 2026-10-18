"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

import {
  trackPublicarClick,
  type PublicarClickSource,
} from "@/lib/analytics/funnel";

interface PublicarLinkProps extends ComponentProps<typeof Link> {
  source: PublicarClickSource;
}

export const PublicarLink = ({
  source,
  onClick,
  href,
  ...rest
}: PublicarLinkProps) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackPublicarClick(source);
    onClick?.(event);
  };

  return <Link href={href ?? "/publicar"} onClick={handleClick} {...rest} />;
};
