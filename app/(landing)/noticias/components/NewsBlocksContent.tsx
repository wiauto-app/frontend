"use client";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import Image from "next/image";
import Link from "next/link";
import { getStrapiMediaUrl } from "@/lib/strapi-media";
import type { StrapiBlock } from "../types/strapi-news.types";

type NewsBlocksContentProps = {
  content: StrapiBlock[];
};

export const NewsBlocksContent = ({ content }: NewsBlocksContentProps) => {
  if (!content?.length) {
    return (
      <p className="text-sm text-slate-500">No content available for this article.</p>
    );
  }

  return (
    <div className="prose prose-slate max-w-none">
      <BlocksRenderer
        content={content as unknown as BlocksContent}
        blocks={{
          paragraph: ({ children }) => (
            <p className="mb-4 leading-relaxed text-slate-700">{children}</p>
          ),
          heading: ({ children, level }) => {
            const class_name =
              level === 1
                ? "mb-4 text-3xl font-bold text-slate-900"
                : level === 2
                  ? "mb-3 text-2xl font-bold text-slate-900"
                  : "mb-2 text-xl font-semibold text-slate-900";
            if (level === 1) {
              return <h1 className={class_name}>{children}</h1>;
            }
            if (level === 2) {
              return <h2 className={class_name}>{children}</h2>;
            }
            if (level === 3) {
              return <h3 className={class_name}>{children}</h3>;
            }
            if (level === 4) {
              return <h4 className={class_name}>{children}</h4>;
            }
            if (level === 5) {
              return <h5 className={class_name}>{children}</h5>;
            }
            return <h6 className={class_name}>{children}</h6>;
          },
          list: ({ children, format }) =>
            format === "ordered" ? (
              <ol className="mb-4 list-decimal space-y-1 pl-6 text-slate-700">
                {children}
              </ol>
            ) : (
              <ul className="mb-4 list-disc space-y-1 pl-6 text-slate-700">
                {children}
              </ul>
            ),
          quote: ({ children }) => (
            <blockquote className="mb-4 border-l-4 border-[#0061F2] pl-4 italic text-slate-600">
              {children}
            </blockquote>
          ),
          link: ({ children, url }) => (
            <Link
              href={url}
              className="font-medium text-[#0061F2] underline-offset-2 hover:underline"
              target={url.startsWith("http") ? "_blank" : undefined}
              rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </Link>
          ),
          image: ({ image }) => {
            const src = getStrapiMediaUrl(image.url);
            if (!src) {
              return null;
            }
            return (
              <span className="my-6 block overflow-hidden rounded-lg">
                <Image
                  src={src}
                  alt={image.alternativeText ?? ""}
                  width={image.width ?? 800}
                  height={image.height ?? 450}
                  className="h-auto w-full object-cover"
                />
              </span>
            );
          },
        }}
        modifiers={{
          bold: ({ children }) => (
            <strong className="font-semibold text-slate-900">{children}</strong>
          ),
          italic: ({ children }) => (
            <em className="italic text-slate-700">{children}</em>
          ),
          underline: ({ children }) => <span className="underline">{children}</span>,
          strikethrough: ({ children }) => (
            <span className="line-through">{children}</span>
          ),
          code: ({ children }) => (
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800">
              {children}
            </code>
          ),
        }}
      />
    </div>
  );
};
