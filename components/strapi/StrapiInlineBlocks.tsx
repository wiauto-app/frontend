"use client";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

import type { StrapiComponentProps } from "@/interfaces/strapi-content-props.interface";
import { cn } from "@/lib/utils";

interface StrapiInlineBlocksProps
  extends StrapiComponentProps<BlocksContent | null> {
  linkClassName?: string;
}

/**
 * Pinta bloques de Strapi en línea (sin `<p>`), para usarlos dentro de un
 * `<label>` o un texto corto. Los enlaces abren en otra pestaña y no
 * propagan el clic (no marcan el checkbox del label).
 */
export const StrapiInlineBlocks = ({
  content,
  className,
  linkClassName,
}: StrapiInlineBlocksProps) => {
  if (!content?.length) {
    return null;
  }

  return (
    <span className={className}>
      <BlocksRenderer
        content={content}
        blocks={{
          paragraph: ({ children }) => <>{children}</>,
          link: ({ children, url }) => (
            <a
              href={url}
              className={cn("text-primary hover:underline", linkClassName)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              {children}
            </a>
          ),
        }}
      />
    </span>
  );
};
