import Link from "next/link";

import type { StrapiUiTextoEnlace } from "@/interfaces/strapi-components.interface";
import type { StrapiComponentProps } from "@/interfaces/strapi-content-props.interface";
import { cn } from "@/lib/utils";

interface StrapiTextoEnlaceProps
  extends StrapiComponentProps<StrapiUiTextoEnlace | null> {
  linkClassName?: string;
}

/** Pinta `ui.texto-enlace`: texto seguido de un enlace. */
export const StrapiTextoEnlace = ({
  content,
  className,
  linkClassName,
}: StrapiTextoEnlaceProps) => {
  if (!content?.texto && !content?.enlace) {
    return null;
  }

  const { texto, enlace } = content;

  return (
    <p className={cn("text-center text-sm text-gray-600", className)}>
      {texto}
      {texto && enlace ? " " : null}
      {enlace ? (
        <Link
          href={enlace.url}
          className={cn("font-medium text-blue-600 hover:text-blue-700", linkClassName)}
          {...(enlace.externo
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {enlace.label}
        </Link>
      ) : null}
    </p>
  );
};
