import type { ReactNode } from "react";

export const renderHighlightedDiscoveryTitle = (title: string): ReactNode => {
  const highlight = "bajas emisiones";
  const index = title.toLowerCase().indexOf(highlight);

  if (index === -1) {
    return title;
  }

  return (
    <>
      {title.slice(0, index)}
      <span className="text-nature">
        {title.slice(index, index + highlight.length)}
      </span>
      {title.slice(index + highlight.length)}
    </>
  );
};
