import React from "react";

export const HeroTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="font-bold lg:text-4xl max-w-md text-white">{children}</h1>
  );
};
