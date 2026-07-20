import React from "react";

export const HeroTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="font-bold text-2xl text-center lg:text-left lg:text-4xl w-full lg:w-auto lg:max-w-md text-white">{children}</h1>
  );
};
