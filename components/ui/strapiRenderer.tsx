"use client";

import {
  BlocksContent,
  BlocksRenderer,
} from "@strapi/blocks-react-renderer";
import Image from "next/image";
import Link from "next/link";

import { getStrapiMediaUrl } from "@/lib/strapi-media";
import { cn } from "@/lib/utils";

type StrapiRendererProps = {
  content: BlocksContent;
  className?: string;
};

const headingStyles: Record<number, string> = {
  1: "mb-6 mt-10 text-3xl font-bold tracking-tight text-slate-900 first:mt-0 sm:text-4xl",
  2: "mb-5 mt-10 text-2xl font-bold tracking-tight text-slate-900 first:mt-0 sm:text-3xl",
  3: "mb-4 mt-8 text-xl font-semibold text-slate-900 first:mt-0",
  4: "mb-3 mt-6 text-lg font-semibold text-slate-900 first:mt-0",
  5: "mb-3 mt-5 text-base font-semibold text-slate-900 first:mt-0",
  6: "mb-2 mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500 first:mt-0",
};

const renderHeading = (children: React.ReactNode, level: number) => {
  const className = headingStyles[level] ?? headingStyles[6];

  if (level === 2) {
    return (
      <h2 className={className}>
        <span
          className="mb-3 block h-1 w-10 rounded-full bg-primary"
          aria-hidden
        />
        {children}
      </h2>
    );
  }

  if (level === 1) return <h1 className={className}>{children}</h1>;
  if (level === 3) return <h3 className={className}>{children}</h3>;
  if (level === 4) return <h4 className={className}>{children}</h4>;
  if (level === 5) return <h5 className={className}>{children}</h5>;
  return <h6 className={className}>{children}</h6>;
};

export const StrapiRenderer = ({ content, className }: StrapiRendererProps) => {
  if (!content?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay contenido disponible.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "strapi-content max-w-none text-[17px] leading-[1.75] text-slate-600",
        className,
      )}
    >
      <BlocksRenderer
        content={content}
        blocks={{
          paragraph: ({ children }) => (
            <p className=" text-slate-600 ">{children}</p>
          ),

          heading: ({ children, level }) => renderHeading(children, level),

          list: ({ children, format }) =>
            format === "ordered" ? (
              <ol className="mb-6 list-decimal space-y-3 pl-6 text-slate-600 marker:font-semibold marker:text-primary">
                {children}
              </ol>
            ) : (
              <ul className="mb-6 list-disc space-y-3 pl-6 text-slate-600 marker:text-primary">
                {children}
              </ul>
            ),

          "list-item": ({ children }) => (
            <li className="pl-1 leading-relaxed">{children}</li>
          ),

          quote: ({ children }) => (
            <blockquote className="my-8 rounded-2xl border border-primary/15 bg-primary/5 px-6 py-5 text-base italic leading-relaxed text-slate-700">
              <span
                className="mb-3 block text-3xl leading-none text-primary/40"
                aria-hidden
              >
                “
              </span>
              {children}
            </blockquote>
          ),

          code: ({ plainText }) => (
            <pre className="my-8 overflow-x-auto rounded-xl border border-slate-200 bg-slate-950 p-5 text-sm leading-relaxed text-slate-100 shadow-sm">
              <code>{plainText}</code>
            </pre>
          ),

          link: ({ children, url }) => (
            <Link
              href={url}
              className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
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
              <figure className="my-8 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
                <Image
                  src={src}
                  alt={image.alternativeText ?? ""}
                  width={image.width ?? 960}
                  height={image.height ?? 540}
                  className="h-auto w-full object-cover"
                />
                {image.caption ? (
                  <figcaption className="border-t border-slate-100 px-4 py-3 text-center text-sm text-slate-500">
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
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
          underline: ({ children }) => (
            <span className="underline decoration-primary/40 underline-offset-2">
              {children}
            </span>
          ),
          strikethrough: ({ children }) => (
            <span className="text-slate-400 line-through">{children}</span>
          ),
          code: ({ children }) => (
            <code className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800">
              {children}
            </code>
          ),
        }}
      />
    </div>
  );
};
