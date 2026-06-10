"use client";

import { BlocksContent, BlocksRenderer } from "@strapi/blocks-react-renderer";

export const StrapiRenderer = ({ content }: { content: BlocksContent }) => {
  return (
    <div className="prose prose-gray max-w-none">
      <BlocksRenderer
        content={content}
        blocks={{
          paragraph: ({ children }) => (
            <p className="mb-4 leading-7 text-gray-700">{children}</p>
          ),

          heading: ({ children, level }) => {
            switch (level) {
              case 1:
                return (
                  <h1 className="mb-6 mt-8 text-4xl font-bold">
                    {children}
                  </h1>
                );

              case 2:
                return (
                  <h2 className="mb-5 mt-8 text-3xl font-semibold">
                    {children}
                  </h2>
                );

              case 3:
                return (
                  <h3 className="mb-4 mt-6 text-2xl font-semibold">
                    {children}
                  </h3>
                );

              case 4:
                return (
                  <h4 className="mb-4 mt-6 text-xl font-semibold">
                    {children}
                  </h4>
                );

              default:
                return (
                  <h5 className="mb-3 mt-5 text-lg font-semibold">
                    {children}
                  </h5>
                );
            }
          },

          quote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-primary pl-4 italic text-gray-600">
              {children}
            </blockquote>
          ),

          code: ({ plainText }) => (
            <pre className="my-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-white">
              <code>{plainText}</code>
            </pre>
          ),

          list: ({ children, format }) =>
            format === "ordered" ? (
              <ol className="mb-4 list-decimal pl-6">{children}</ol>
            ) : (
              <ul className="mb-4 list-disc pl-6">{children}</ul>
            ),

          "list-item": ({ children }) => (
            <li className="mb-2">{children}</li>
          ),
        }}
      />
    </div>
  );
};