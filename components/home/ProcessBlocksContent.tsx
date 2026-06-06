"use client";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import type { StrapiRichTextBlock } from "./types/strapi-home.types";
import { BRAND_BLUE } from "./data/home-data";

type ProcessBlocksContentProps = {
  content: StrapiRichTextBlock[];
  variant: "title" | "description";
};

export const ProcessBlocksContent = ({
  content,
  variant,
}: ProcessBlocksContentProps) => {
  if (!content?.length) {
    return null;
  }

  if (variant === "title") {
    return (
      <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem] lg:text-3xl">
        <BlocksRenderer
          content={content as unknown as BlocksContent}
          blocks={{
            paragraph: ({ children }) => <span>{children}</span>,
          }}
          modifiers={{
            bold: ({ children }) => (
              <span style={{ color: BRAND_BLUE }}>{children}</span>
            ),
          }}
        />
      </h2>
    );
  }

  return (
    <BlocksRenderer
      content={content as unknown as BlocksContent}
      blocks={{
        paragraph: ({ children }) => (
          <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
            {children}
          </p>
        ),
      }}
    />
  );
};
