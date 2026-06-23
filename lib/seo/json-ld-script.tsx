type JsonLdScriptProps = {
  data: Record<string, unknown>;
};

export const JsonLdScript = ({ data }: JsonLdScriptProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);
