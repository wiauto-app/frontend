import type { StrapiCard } from "@/interfaces/strapi-components.interface";

import { ToolCard } from "./toolCard";

interface ToolsAccessProps {
  data: StrapiCard[] | null | undefined;
}

export const ToolsAccess = ({ data }: ToolsAccessProps) => {
  if (!data?.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {data.map((item) => (
        <ToolCard key={item.id} item={item} />
      ))}
    </div>
  );
};
