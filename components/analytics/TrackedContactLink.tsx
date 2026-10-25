"use client";

import type { ComponentProps, MouseEvent } from "react";

import { trackContactHref } from "@/lib/analytics/events";
import type { ContactLocation } from "@/lib/analytics/contactMethod";

interface TrackedContactLinkProps extends ComponentProps<"a"> {
  href: string;
  location: ContactLocation;
}

/**
 * `<a>` que emite el evento `contact` al pulsar enlaces `tel:`, `mailto:` o de
 * WhatsApp. El canal se deduce del `href`; el resto de enlaces no emite nada.
 */
export const TrackedContactLink = ({
  href,
  location,
  onClick,
  ...rest
}: TrackedContactLinkProps) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackContactHref(href, location);
    onClick?.(event);
  };

  return <a href={href} onClick={handleClick} {...rest} />;
};
